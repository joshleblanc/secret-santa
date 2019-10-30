import * as yup from 'yup';

export const Groups = new Mongo.Collection('groups', { idGeneration: "MONGO" });

export const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    participants: yup.array().of(yup.string().required()).required()
});

if(Meteor.isServer) {
    Meteor.publish('groups', function(userId) {
        return Groups.find({
          participants: {
            $elemMatch: {
              $eq: userId
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
        _id: {
          $in: group.participants
        }
      });
      return [groups, users];
    })

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
}
