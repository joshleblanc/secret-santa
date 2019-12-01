import * as yup from 'yup';

export const Matches = new Mongo.Collection('matches', { idGeneration: "MONGO" });

export const schema = yup.object().shape({
  gifter: yup.string().required(),
  receiver: yup.string().required(),
  groupId: yup.string().required()
});

Meteor.methods({
  "matches.setShipped"(groupId) {
    const user = Meteor.user();
    if(!user) {
      throw new Meteor.Error("Not Authorized");
    }
    const match = Matches.findOne({
      gifter: user.discordId,
      groupId
    });
    if(match) {
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

if(Meteor.isServer) {
  Meteor.publish('match', function(groupId, discordUserId) {
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
        avatar: 1,
        discordID: 1,
        email: 1,
        "profile.name": 1,
        "shipping.address": 1,
        shirtSize: 1
      }
    });
    return [matches, users];
  });

  Meteor.publish('matches.shippingInfo', function(groupId) {
    console.log(groupId);
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
