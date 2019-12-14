import * as yup from 'yup';
import {Meteor} from "meteor/meteor";
import {shirtSizes} from "../lib/constants";
import moment from "moment";

export const profileSchema = yup.object().shape({
  address: yup.string().required().max(1000),
  shirtSize: yup.string().required().oneOf(Object.keys(shirtSizes))
});

export function avatarUrl(user) {
  return user.avatarUrl;
}

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
  const { cdnUrl, uploadImage } = import("../lib/aws/s3");
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
  } catch(e) {
    console.log(`Error getting avatar for ${user._id}`);
  }

  if(uploadKey) {
    updateParams["$set"].avatarUrl = cdnUrl(uploadKey);
  }

  // only get gets if they've never been gotten, or they haven't been updated in more than a day
  const getGuilds = !user.lastSync || moment().diff(moment(user.lastSync), 'days') >= 1;

  if (getGuilds) {
    let guildsResponse;
    const api_url = "https://discordapp.com/api";
    try {
      guildsResponse = HTTP.get(`${api_url}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${user.services.discord.accessToken}`
        }
      });
      updateParams['$set'].guilds = guildsResponse.data;
    } catch (e) {
      console.log(e);
      console.error(`${user.discordId} needs to sign in again, can't sync servers`);
    }
  }

  Meteor.users.update({
    _id: user._id
  }, updateParams);
}

if(Meteor.isServer) {
  Meteor.publish('currentUser', function (id) {
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
        unreadMessages: 1
      }
    });
  });

  Meteor.methods({
    'currentUser.setTheme'(theme) {
      const user = Meteor.user();
      if(!user || !['light', 'dark'].includes(theme)) return;
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          theme
        }
      });
    },
    'users.updateProfile'(address, shirtSize) {
      try {
        profileSchema.validateSync({
          address: address,
          shirtSize: shirtSize
        });
        Meteor.users.update({ _id: Meteor.userId() }, {
          $set: {
            "shipping.address": address,
            shirtSize: shirtSize
          }
        });
      } catch(e) {
        console.error(e);
        throw new Meteor.Error("Invalid Document");
      }
    }
  });
}
