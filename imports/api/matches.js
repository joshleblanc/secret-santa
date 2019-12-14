import * as yup from 'yup';
import {Groups} from "./groups";

export const Matches = new Mongo.Collection('matches', {idGeneration: "MONGO"});

export const schema = yup.object().shape({
  gifter: yup.string().required(),
  receiver: yup.string().required(),
  groupId: yup.string().required()
});

Meteor.methods({
  "match.readMessage"(matchId) {
    const user = Meteor.user();
    if(user) {
      Meteor.users.update({
        _id: user._id
      }, {
        $pull: {
          unreadMessages: new Mongo.ObjectID(matchId)
        }
      })
    }
  },
  "match.sendMessage"(matchId, message) {
    const user = Meteor.user();
    const match = Matches.findOne({_id: new Mongo.ObjectID(matchId)});
    if (user && match && message.length < 1000) {
      Matches.update({_id: new Mongo.ObjectID(matchId)}, {
        $push: {
          messages: {
            sender: user._id,
            message: message
          }
        }
      });
      if(match.gifter === user.discordId) {
        Meteor.users.update({
          discordId: match.receiver
        }, {
          $addToSet: {
            unreadMessages: new Mongo.ObjectID(matchId),
          }
        })
      } else {
        Meteor.users.update({
          discordId: match.gifter
        }, {
          $addToSet: {
            unreadMessages: new Mongo.ObjectID(matchId)
          }
        })
      }
    }
  },
  "matches.setShipped"(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error("Not Authorized");
    }
    const match = Matches.findOne({
      gifter: user.discordId,
      groupId
    });
    if (match) {
      Matches.update({
        _id: match._id
      }, {
        $set: {
          shipped: true
        }
      });
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('matches', function (userId) {
    const user = Meteor.users.findOne({_id: userId});
    return Matches.find({
      $or: [
        {gifter: user.discordId},
        {receiver: user.discordId}
      ],
      messages: {
        $exists: true,
      }
    }, {
      fields: {
        receiver: 1,
        _id: 1,
        groupId: 1,
        messages: 1
      }
    });
  });

  Meteor.publish('messages', function (matchId, userId) {
    const match = Matches.findOne({_id: new Mongo.ObjectID(matchId)});
    const user = Meteor.users.findOne({_id: userId});
    let gifter = undefined;
    let receiver = undefined;

    if (match.receiver === user.discordId) {
      receiver = 1;
    }
    if (match.gifter === user.discordId) {
      gifter = 1;
      receiver = 1;
    }

    if(!gifter && !receiver) {
      return [];
    }

    const matches = Matches.find({
      _id: new Mongo.ObjectID(matchId)
    }, {
      fields: {
        messages: 1,
        gifter,
        receiver,
        groupId: 1
      }
    });
    const users = Meteor.users.find({discordId: match.receiver}, {fields: {discordUsername: 1, discordId: 1}});
    const groups = Groups.find({ _id: match.groupId });
    return [matches, users, groups];
  });

  Meteor.publish('match', function (groupId, discordUserId) {
    const matches = Matches.find({
      gifter: discordUserId,
      groupId: groupId
    });

    const match = Matches.findOne({
      gifter: discordUserId,
      groupId: groupId
    });

    const users = Meteor.users.find({
      "services.discord.id": match.receiver
    }, {
      fields: {
        avatarUrl: 1,
        discordID: 1,
        email: 1,
        "profile.name": 1,
        "shipping.address": 1,
        shirtSize: 1
      }
    });
    return [matches, users];
  });

  Meteor.publish('matches.shippingInfo', function (groupId) {
    return Matches.find({
      groupId
    }, {
      fields: {
        shipped: 1,
        gifter: 1,
        groupId: 1
      }
    });
  });
}
