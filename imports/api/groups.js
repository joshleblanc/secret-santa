import * as yup from 'yup';
import {Matches} from './matches';
import moment from "moment";
import {match} from "../lib/match";

export const Groups = new Mongo.Collection('groups', {idGeneration: "MONGO"});

export const insertSchema = yup.object().shape({
  name: yup.string().required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  server: yup.string().required(),
});

export const schema = insertSchema.concat(yup.object().shape({
  creator: yup.string().required(),
  participants: yup.array().of(yup.number().required()).required()
}));

export function signupsClosed(group) {
  return moment().diff(moment(group.startDate)) > 0;
}

export function createMatches() {
  const groups = Groups.find({
    startDate: {
      $lte: new Date()
    },
    hasMatches: false,
    participants: {
      $exists: true,
      $not: {
        $size: 0
      }
    }
  }).fetch();

  groups.forEach(group => {
    const participants = group.participants;
    const matches = match(participants);
    const users = Meteor.users.find({
      discordId: {
        $in: participants
      }
    }).fetch();
    Matches.remove({groupId: group._id});
    matches.forEach(match => {
      Matches.insert({
        gifter: match[0],
        receiver: match[1],
        groupId: group._id
      })
    });
    Groups.update({_id: group._id}, {
      $set: {
        hasMatches: true
      }
    });
    Email.send({
      from: "secret-santa@grep.sh",
      bcc: users.map(u => u.email),
      subject: "Your secret santa match has been made!",
      text: "You're a secret santa!\n" +
        `Head over to ${Meteor.absoluteUrl(`/groups/${group._id.toHexString()}`)} to check it out!`
    });
  });
}

if (Meteor.isServer) {
  Meteor.publish('groups', function (userId) {
    const user = Meteor.users.findOne({_id: userId});
    return Groups.find({
      participants: {
        $elemMatch: {
          $eq: user.discordId
        }
      }
    });
  });

  Meteor.publish('group', function (id) {
    const groups = Groups.find({_id: id});
    const group = Groups.findOne({_id: id});

    const users = Meteor.users.find({
      discordId: {
        $in: group.participants
      }
    }, {
      fields: {
        discordId: 1,
        discordUsername: 1,
        avatarUrl: 1
      }
    });

    return [groups, users];
  });

  Meteor.publish('groups.ending', function (userId) {
    const user = Meteor.users.findOne({_id: userId});

    return Groups.find({
      participants: {
        $elemMatch: {
          $eq: user.discordId,
        }
      },
      startDate: {
        $gt: new Date()
      }
    }, {
      sort: {
        startDate: 1
      },
      limit: 3
    })
  });

  Meteor.methods({
    'groups.create'(obj) {
      const user = Meteor.user();
      if (!user) {
        throw new Meteor.Error("Not authorized");
      }
      try {
        insertSchema.validateSync(obj);
        return Groups.insert({
          ...obj,
          startDate: new Date(obj.startDate),
          endDate: new Date(obj.endDate),
          creator: user.services.discord.id,
          hasMatches: false,
          participants: [
            user.services.discord.id
          ]
        });
      } catch (e) {
        console.error(e);
        throw new Meteor.Error("Invalid Document");
      }
    },
    'groups.signup'(groupId) {
      const user = Meteor.user();
      if (!user) {
        throw new Meteor.Error("Not authorized");
      }
      const id = user.discordId;
      const group = Groups.findOne({_id: new Mongo.ObjectID(groupId)});
      if (group) {
        if (signupsClosed(group)) {
          throw new Meteor.Error("Signups have already closed");
        } else if (group.participants.includes(id)) {
          throw new Meteor.Error("You're already signed up");
        } else {
          Groups.update({_id: new Mongo.ObjectID(groupId)}, {
            $push: {
              participants: id
            }
          })
        }
      } else {
        throw new Meteor.Error("Group not found");
      }
    },
    'groups.signout'(groupId) {
      const user = Meteor.user();
      if (!user) {
        throw new Meteor.Error("Not authorized");
      }
      const id = user.services.discord.id;
      const group = Groups.findOne({_id: new Mongo.ObjectID(groupId)});
      if (group) {
        if (signupsClosed(group)) {
          throw new Meteor.Error("Signups have already closed");
        } else if (group.participants.includes(id)) {
          Groups.update({_id: new Mongo.ObjectID(groupId)}, {
            $pull: {
              participants: id
            }
          });
        } else {
          throw new Meteor.Error("User isn't signed up");
        }
      } else {
        throw new Meteor.Error("Group not found");
      }
    }
  });
}
