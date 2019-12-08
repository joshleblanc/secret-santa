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

  // default update params
  const updateParams = {
    $set: {
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
    }
  };

  // download avatar
  let uploadKey;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user.services.discord.id}/${user.services.discord.avatar}.png`;
  const file = HTTP.get(avatarUrl, {
    npmRequestOptions: {
      encoding: null
    }
  });

  // upload avatar
  try {
    const result = await uploadImage(file.content, `${user.services.discord.id}.png`);
    uploadKey = result.key;
  } catch (e) {
    console.error(e);
  }

  if(uploadKey) {
    updateParams["$set"].avatarUrl = cdnUrl(uploadKey);
  }

  // only get gets if they've never been gotten, or they haven't been updated in more than a day
  const getGuilds = !user.lastSync || moment().diff(moment(user.lastSync), 'days') >= 1;

  if (getGuilds) {
    let guildsResponse;
    const api_url = "https://discordapp.com/api";
    try {
      guildsResponse = HTTP.get(`${api_url}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${user.services.discord.accessToken}`
        }
      });
      updateParams['$set'].guilds = guildsResponse.data;
    } catch (e) {
      console.log(e);
      console.error(`${user.discordId} needs to sign in again, can't sync servers`);
    }
  }

  Meteor.users.update({
    _id: user._id
  }, updateParams);

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
