import * as yup from 'yup';
import {Meteor} from "meteor/meteor";
import {shirtSizes} from "../lib/constants";
import {WeightGroups} from './weight_groups';
import moment from "moment";
import { BellGroups } from '/imports/api/bell_groups';

export const profileSchema = yup.object().shape({
  address: yup.string().required().max(1000),
  shirtSize: yup.string().required().oneOf(Object.keys(shirtSizes)),
  dodoCode: yup.string().max(5)
});

export const addWeightSchema = yup.object().shape({
  weight: yup.number().required().typeError("Weight must be a number")
});

export const addBellsSchema = yup.object().shape({
  price: yup.number().required().typeError("Bell price must be a number")
})

export function avatarUrl(user) {
  return user.avatarUrl;
}

Meteor.methods({
  'user.addWeight'(weight, measurement) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error("Not authorized");
    }
    try {
      addWeightSchema.validateSync({weight, measurement});

      // convert to lbs
      if (measurement === "kg") {
        weight = weight * 2.205;
      } else if (measurement === 'stone') {
        weight = weight * 14;
      }

      return Meteor.users.update({_id: user._id}, {
        $push: {
          weights: {
            weight,
            addedAt: new Date()
          }
        }
      });
    } catch (e) {
      console.error(e);
      throw new Meteor.Error("Invalid Document");
    }
  },
  'user.addBell'(price, beforeNoon, expiresIn) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error("Not authorized");
    }
    try {
      addBellsSchema.validateSync({price});
      const date = new Date();
      return Meteor.users.update({_id: user._id}, {
        $push: {
          bells: {
            price: parseInt(price, 10),
            beforeNoon,
            expiresAt: new Date(date.getTime() + expiresIn),
            addedAt: date
          }
        }
      });
    } catch (e) {
      console.error(e);
      throw new Meteor.Error("Invalid Document");
    }
  },
  'user.deleteWeight'(weight, addedAt) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error("Not Authorized");
    }
    return Meteor.users.update({_id: user._id}, {
      $pull: {
        weights: {
          weight, addedAt
        }
      }
    })
  },
  'user.deleteBell'(price, addedAt) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error("Not Authorized");
    }
    return Meteor.users.update({_id: user._id}, {
      $pull: {
        bells: {
          price, addedAt
        }
      }
    })
  }
});

export function sendMessageReminders() {
  const users = Meteor.users.find({
    unreadMessages: {
      $exists: true,
      $not: {
        $size: 0
      }
    }
  }).fetch();
  Email.send({
    from: "secret-santa@grep.sh",
    bcc: users.map(u => u.email),
    subject: "You have unread messages at secret santa!",
    text: "Someone's sent you a message on secret santa!\n" +
      `Head over to ${Meteor.absoluteUrl(`/messages`)} to see what you've missed!`
  });
}

export async function sync(user) {
  let userIn = user;
  const {cdnUrl, uploadImage} = import("../lib/aws/s3");
  // default update params
  const updateParams = {
    $set: {
      /**
       * We need to copy pertinent discord thing to the top level
       * because meteor can't consolidate embedded documents when publishing
       * cursors with different visible fields
       */
      avatar: user.services.discord.avatar,
      discordId: user.services.discord.id,
      email: user.services.discord.email,
      discordUsername: user.services.discord.username,
      lastSync: new Date(),
    }
  };

  // download avatar
  let uploadKey;
  let file;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user.services.discord.id}/${user.services.discord.avatar}.png`;
  try {
    file = HTTP.get(avatarUrl, {
      npmRequestOptions: {
        encoding: null
      }
    });
    const result = await uploadImage(file.content, `${user.services.discord.id}.png`);
    uploadKey = result.key;
  } catch (e) {
    console.log(`Error getting avatar for ${user._id}`);
  }

  if (uploadKey) {
    updateParams["$set"].avatarUrl = cdnUrl(uploadKey);
  }

  // only get gets if they've never been gotten, or they haven't been updated in more than a day
  const getGuilds = !user.lastSync || moment().diff(moment(user.lastSync), 'days') >= 1;

  if (getGuilds) {
    let guildsResponse;
    const api_url = "https://discordapp.com/api";
    const config = ServiceConfiguration.configurations.findOne({service: 'discord'});
    if (new Date() > new Date(user.services.discord.expiresIn)) { // access token is expired
      const refreshTokenResponse = HTTP.post(`${api_url}/oauth2/token`, {
        params: {
          client_id: Meteor.settings.discord.id,
          client_secret: Meteor.settings.discord.secret,
          grant_type: 'refresh_token',
          redirect_url: OAuth._redirectUri('discord', config),
          scope: user.services.discord.scope
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          "services.discord.accessToken": refreshTokenResponse.data.access_token,
          "services.discord.expiresIn": refreshTokenResponse.data.expires_in,
        }
      });
      userIn = Meteor.users.findOne({_id: user._id});
    }

    try {
      guildsResponse = HTTP.get(`${api_url}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${userIn.services.discord.accessToken}`
        }
      });
      updateParams['$set'].guilds = guildsResponse.data;
    } catch (e) {
      console.log(e);
      console.error(`${userIn.discordId} needs to sign in again, can't sync servers`);
    }
  }

  Meteor.users.update({
    _id: userIn._id
  }, updateParams);
}


if (Meteor.isServer) {
  Meteor.methods({
    'users.subscribeToFitbit'() {
      const user = Meteor.user();
      if (!user || !user.services.fitbit) return;
      HTTP.post("https://api.fitbit.com/1/user/-/body/apiSubscriptions/1.json", {
        headers: {
          Authorization: `Bearer ${user.services.fitbit.accessToken}`
        }
      });
    },
  });

  Meteor.publish('users.weight', groupId => {
    const group = WeightGroups.findOne(new Mongo.ObjectID(groupId));
    return Meteor.users.find({
      _id: {
        $in: group.userIds
      }
    }, {fields: {discordUsername: 1, weights: 1}})
  });

  Meteor.publish('users.bells', groupId => {
    const group = BellGroups.findOne(new Mongo.ObjectID(groupId));
    return Meteor.users.find({
      _id: {
        $in: group.userIds,
      },
    }, {
      fields: {
        discordUsername: 1,
        dodoCode: 1,
        bells: 1
      }
    });
  });

  Meteor.publish('currentUser.weights', function () {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        weights: 1
      }
    })
  });

  Meteor.publish('currentUser.bells', function () {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        price: 1,
        beforeNoon: 1,
        expiresAt: 1
      }
    })
  });

  Meteor.publish('currentUser', function () {
    const id = this.userId;
    return Meteor.users.find({
      _id: id
    }, {
      fields: {
        discordUsername: 1,
        "shipping.address": 1,
        shirtSize: 1,
        discordId: 1,
        "guilds": 1,
        avatarUrl: 1,
        theme: 1,
        unreadMessages: 1,
        services: 1,
        dodoCode: 1
      }
    });
  });

  Meteor.methods({
    'currentUser.setTheme'(theme) {
      const user = Meteor.user();
      if (!user || !['light', 'dark'].includes(theme)) return;
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          theme
        }
      });
    },
    'users.disconnectFitbit'() {
      const user = Meteor.user();
      if (!user) return;
      Meteor.users.update({
        _id: user._id
      }, {
        $unset: {
          "services.fitbit": ""
        }
      });
    },
    'users.updateProfile'(address, shirtSize, dodoCode) {
      try {
        profileSchema.validateSync({
          address: address,
          shirtSize: shirtSize,
          dodoCode: dodoCode
        });
        Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
            "shipping.address": address,
            shirtSize,
            dodoCode
          }
        });
      } catch (e) {
        console.error(e);
        throw new Meteor.Error("Invalid Document");
      }
    }
  });
}
