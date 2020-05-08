import * as yup from 'yup';
import pluralize from 'pluralize';

export function createGroup(name) {
  const collection = new Mongo.Collection(name, { idGeneration: "MONGO" })
  const createSchema = yup.object().shape({
    name: yup.string().required().max(100)
  });
  Meteor.methods({
    [`${name}.create`](nameIn) {
      const user = Meteor.user();
      if(!user) {
        throw new Meteor.Error("Not Authorized");
      }
      try {
        createSchema.validateSync({ name: nameIn });
        return collection.insert({
          name: nameIn,
          creator: user._id,
          userIds: [ user._id ]
        });
      } catch(e) {
        console.error(e);
        throw new Meteor.Error("Not a valid group")
      }
    },
    [`${name}.delete`](id) {
      const user = Meteor.user();
      if(!user) {
        throw new Meteor.Error("Not Authorized");
      }
      const group = collection.findOne(id);
      if(!group) {
        throw new Meteor.Error("No group found");
      }
      if(!group.userIds.includes(user._id)) {
        throw new Meteor.Error("Not Authorized");
      }
      return collection.remove({ _id: id });
    },
    [`${name}.join`](groupId) {
      const id = new Mongo.ObjectID(groupId);
      const user = Meteor.user();
      if(!user) {
        throw new Meteor.Error("Not Authorized");
      }
      const group = collection.findOne(id);
      if(!group) {
        throw new Meteor.Error("No group found");
      }
      if(group.userIds.includes(user._id)) {
        throw new Meteor.Error("Already a member");
      } else {
        return collection.update({ _id: id }, {
          $push: {
            userIds: user._id
          }
        })
      }
    },
    [`${name}.leave`](groupId) {
      const id = new Mongo.ObjectID(groupId);
      const user = Meteor.user();
      if(!user) {
        throw new Meteor.Error("Not Authorized");
      }
      const group = collection.findOne(id);
      if(!group) {
        throw new Meteor.Error("No group found");
      }
      if(group.userIds.includes(user._id)) {
        return collection.update({ _id: id }, {
          $pull: {
            userIds: user._id
          }
        });
      } else {
        throw new Meteor.Error("Not a member");
      }
    }
  });
  if(Meteor.isServer) {
    Meteor.publish(name, function() {
      return collection.find({
        userIds: {
          $elemMatch: {
            $eq: this.userId
          }
        }
      });
    });
    Meteor.publish(pluralize.singular(name), function(groupId) {
      return collection.find({ _id: new Mongo.ObjectID(groupId) });
    })
  }
  return {
    collection,
    createSchema
  };
}
