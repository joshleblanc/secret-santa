import * as yup from 'yup';

export const Groups = new Mongo.Collection('groups', { idGeneration: "MONGO" });

export const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.date().required(),
    endDate: yup.date().required()
});

if(Meteor.isServer) {
    Meteor.publish('groups', function(limit = 10, skip = 0) {
        return Groups.find({}, { skip , limit });
    });

    Groups.allow({
      insert: function(userId, doc) {
        console.log(userId, doc);
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
