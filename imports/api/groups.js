import * as yup from 'yup';

export const Groups = new Mongo.Collection('groups', { idGeneration: "MONGO" });

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

if(Meteor.isServer) {
    Meteor.publish('groups', function(userId) {
        const user = Meteor.users.findOne({ _id: userId });
        return Groups.find({
          participants: {
            $elemMatch: {
              $eq: user.services.discord.id
            }
          }
        });
    });

    Meteor.publish('group', function(id) {
      const groups = Groups.find({
        _id: new Mongo.ObjectID(id)
      });
      const group = Groups.findOne({
        _id: new Mongo.ObjectID(id)
      });
      const users = Meteor.users.find({
        "services.discord.id": {
          $in: group.participants
        }
      }, {
          fields: {
              "services.discord.id": 1,
              "services.discord.username": 1
          }
      });
      return [groups, users];
    });

    Groups.allow({
      insert: function(userId, doc) {
        try {
          schema.validateSync(doc);
          return userId === Meteor.userId();
        } catch(e) {
          console.error(e);
          return false;
        }
      }
    });

    Meteor.methods({
        'groups.create'(obj) {
            const user = Meteor.user();
            if(!user) {
                throw new Meteor.Error("Not authorized");
            }
            try {
                insertSchema.validateSync(obj);
                return Groups.insert({
                    ...obj,
                    creator: user.services.discord.id,
                    participants: [
                        user.services.discord.id
                    ]
                });
            } catch(e) {
                console.error(e);
                throw new Meteor.Error("Invalid Document");
            }
        }
    });
}
