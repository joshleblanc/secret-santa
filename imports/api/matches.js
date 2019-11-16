import * as yup from 'yup';

export const Matches = new Mongo.Collection('matches', { idGeneration: "MONGO" });

export const schema = yup.object().shape({
  gifter: yup.string().required(),
  receiver: yup.string().required(),
  groupId: yup.string().required()
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
        "shipping.address": 1
      }
    });
    return [matches, users];
  });
}