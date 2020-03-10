import * as yup from 'yup';

export const WeightGroups = new Mongo.Collection('weight_groups', {idGeneration: "MONGO"});

export const createWeightGroupSchema = yup.object().shape({
    name: yup.string().required().max(100)
});

Meteor.methods({
    "weight_groups.create"(name) {
        const user = Meteor.user();
        if(!user) {
            throw new Meteor.Error("Not Authorized");
        }
        try {
            createWeightGroupSchema.validateSync({ name });
            return WeightGroups.insert({
                name,
                creator: user._id,
                userIds: [ user._id ]
            });
        } catch(e) {
            console.error(e);
            throw new Meteor.Error("")
        }
    },
    "weight_groups.delete"(id) {
        console.log(id);
        const user = Meteor.user();
        if(!user) {
            throw new Meteor.Error("Not Authorized");
        }
        const group = WeightGroups.findOne(id);
        if(!group) {
            throw new Meteor.Error("No group found");
        }
        if(!group.userIds.includes(user._id)) {
            throw new Meteor.Error("Not Authorized");
        }
        return WeightGroups.remove({ _id: id });
    },
    "weight_groups.join"(groupId) {
        const id = new Mongo.ObjectID(groupId);
        const user = Meteor.user();
        if(!user) {
            throw new Meteor.Error("Not Authorized");
        }
        const group = WeightGroups.findOne(id);
        if(!group) {
            throw new Meteor.Error("No group found");
        }
        if(group.userIds.includes(user._id)) {
            throw new Meteor.Error("Already a member");
        } else {
            return WeightGroups.update({ _id: id }, {
                $push: {
                    userIds: user._id
                }
            })
        }
    },
    "weight_groups.leave"(groupId) {
        const id = new Mongo.ObjectID(groupId);
        const user = Meteor.user();
        if(!user) {
            throw new Meteor.Error("Not Authorized");
        }
        const group = WeightGroups.findOne(id);
        if(!group) {
            throw new Meteor.Error("No group found");
        }
        if(group.userIds.includes(user._id)) {
            return WeightGroups.update({ _id: id }, {
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
    Meteor.publish("weight_group", function(groupId) {
        return WeightGroups.find({ _id: new Mongo.ObjectID(groupId) });
    });
    Meteor.publish("weight_groups", function() {
        return WeightGroups.find({
            userIds: {
                $elemMatch: {
                    $eq: this.userId
                }
            }
        });
    });
}