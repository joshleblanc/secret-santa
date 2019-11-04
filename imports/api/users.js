import * as yup from 'yup';
import {Meteor} from "meteor/meteor";

export const shippingSchema = yup.object().shape({
  address: yup.string().required().max(1000)
});

export function avatarUrl(user) {
  return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
}

if(Meteor.isServer) {
  Meteor.publish('currentUser', function (id) {
    return Meteor.users.find({
      _id: id
    }, {
      fields: {
        discordUsername: 1,
        "shipping.address": 1,
        discordId: 1,
        "guilds": 1
      }
    });
  });

  Meteor.methods({
    'users.updateShippingAddress'(address) {
      try {
        shippingSchema.validateSync({
          address: address
        });
        console.log(address);
        Meteor.users.update({ _id: Meteor.userId() }, {
          $set: {
            "shipping.address": address
          }
        });
      } catch(e) {
        console.error(e);
        throw new Meteor.Error("Invalid Document");
      }

    }
  });
}
