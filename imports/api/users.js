import * as yup from 'yup';

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
        "services.discord.username": 1,
        "shipping.address": 1,
        "services.discord.id": 1,
        "guilds": 1
      }
    });
  });

  Meteor.users.allow({
    update: function (userId, doc, fields, modifier) {
      console.log(modifier, fields, doc);
      try {
        shippingSchema.validateSync({
          address: modifier['$set']['shipping.address']
        });
        return userId === doc._id;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  })
}
