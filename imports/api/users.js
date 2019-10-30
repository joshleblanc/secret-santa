import * as yup from 'yup';

export const shippingSchema = yup.object().shape({
  address: yup.string().required().max(1000)
});

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

  Meteor.methods({
    'currentUser.getGuilds'() {
      const user = Meteor.user();
      if(!user) {
        throw new Meteor.Error("Not authorized");
      }
      const api_url = "https://discordapp.com/api";
      const response = HTTP.get(`${api_url}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${user.services.discord.accessToken}`
        }
      });
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          guilds: response.data
        }
      })
    }
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
