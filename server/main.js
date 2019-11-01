import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';

ServiceConfiguration.configurations.upsert(
  { service: 'discord' },
  {
      $set: {
          loginStyle: "redirect",
          clientId: "639045709819019264",
          secret: Meteor.settings.discord.secret
      }
  }
);

// get servers
Accounts.onLogin(() => {
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
});
