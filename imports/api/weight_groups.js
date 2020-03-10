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
    }
});

if(Meteor.isServer) {
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