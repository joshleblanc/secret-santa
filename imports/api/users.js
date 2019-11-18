import * as yup from 'yup';
import {Meteor} from "meteor/meteor";
import {shirtSizes} from "../lib/constants";

export const profileSchema = yup.object().shape({
  address: yup.string().required().max(1000),
  shirtSize: yup.string().required().oneOf(Object.keys(shirtSizes))
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
        shirtSize: 1,
        discordId: 1,
        "guilds": 1
      }
    });
  });

  Meteor.methods({
    'users.updateProfile'(address, shirtSize) {
      try {
        profileSchema.validateSync({
          address: address,
          shirtSize: shirtSize
        });
        console.log(address);
        Meteor.users.update({ _id: Meteor.userId() }, {
          $set: {
            "shipping.address": address,
            shirtSize: shirtSize
          }
        });
      } catch(e) {
        console.error(e);
        throw new Meteor.Error("Invalid Document");
      }

    }
  });
}
