import * as yup from 'yup';
import { Matches } from './matches';
import moment from "moment";

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

  Meteor.publish('group', function (id, userDiscordId) {
    const groups = Groups.find({
      _id: new Mongo.ObjectID(id)
    });
    const group = Groups.findOne({
      _id: new Mongo.ObjectID(id)
    });

    const users = Meteor.users.find({
      discordId: {
        $in: group.participants
      }
    }, {
      fields: {
        discordId: 1,
        username: 1,
        avatar: 1
      }
    });

    return [groups, users];
  });

  Groups.allow({
    insert: function (userId, doc) {
      try {
        schema.validateSync(doc);
        return userId === Meteor.userId();
      } catch (e) {
        console.error(e);
        return false;
      }
    }
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
      const group = Groups.findOne({ _id: new Mongo.ObjectID(groupId) });
      if(group) {
        if(signupsClosed(group)) {
          throw new Meteor.Error("Signups have already closed");
        } else if(group.participants.includes(id)) {
          throw new Meteor.Error("You're already signed up");
        } else {
          Groups.update({ _id: new Mongo.ObjectID(groupId) }, {
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
      const group = Groups.findOne({ _id: new Mongo.ObjectID(groupId) });
      if(group) {
        if(signupsClosed(group)) {
          throw new Meteor.Error("Signups have already closed");
        } else if(group.participants.includes(id)) {
          Groups.update({ _id: new Mongo.ObjectID(groupId) }, {
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
