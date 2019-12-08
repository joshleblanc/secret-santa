import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {createMatches} from "../imports/api/groups";
import './migrations';
import moment from "moment";
import {cdnUrl, uploadImage} from "./lib/aws/s3";
import {avatarUrl} from "../imports/api/users";

ServiceConfiguration.configurations.upsert(
  {service: 'discord'},
  {
    $set: {
      loginStyle: "redirect",
      clientId: "639045709819019264",
      secret: Meteor.settings.discord.secret
    }
  }
);

// get servers
Accounts.onLogin(async () => {
  const user = Meteor.user();
  if (!user) {
    throw new Meteor.Error("Not authorized");
  }
  if (user.lastSync) {
    const lastUpdated = moment(user.lastSync);
    if (moment().diff(lastUpdated, 'days') < 1) {
      return;
    }
  }
  const api_url = "https://discordapp.com/api";
  try {
    const response = HTTP.get(`${api_url}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${user.services.discord.accessToken}`
      }
    });

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.services.discord.id}/${user.services.discord.avatar}.png`;
    const file = HTTP.get(avatarUrl, {
      headers: {
        'Content-Type': 'image/png'
      }
    });
    let uploadKey;
    try {
      debugger;
      const result = await uploadImage(file.content, `${user.services.discord.id}.png`);
      uploadKey = result.key;
    } catch(e) {
      console.error(e);
    }

    Meteor.users.update({
      _id: user._id
    }, {
      $set: {
        guilds: response.data,
        /**
         * We need to copy pertinent discord thing to the top level
         * because meteor can't consolidate embedded documents when publishing
         * cursors with different visible fields
         */
        avatar: user.services.discord.avatar,
        discordId: user.services.discord.id,
        email: user.services.discord.email,
        discordUsername: user.services.discord.username,
        lastSync: new Date(),
        avatarUrl: cdnUrl(uploadKey)
      }
    });

  } catch (e) {
    console.log(e);
    console.error(`${user.discordId} needs to sign in again, can't sync servers`);
  }

});


SyncedCron.add({
  name: 'Create matches',
  schedule: function (parser) {
    return parser.text('at 0:00');
  },
  job: function () {
    createMatches();
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});
