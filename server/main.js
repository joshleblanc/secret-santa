import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {createMatches} from "../imports/api/groups";
import './migrations';
import moment from "moment";

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
Accounts.onLogin(() => {
  const user = Meteor.user();
  if (!user) {
    throw new Meteor.Error("Not authorized");
  }
  if(user.lastSync) {
    const lastUpdated = moment(user.lastSync);
    if(moment().diff(lastUpdated, 'days') < 1) {
      return;
    }
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
      guilds: response.data,
      /**
       * We need to copy pertinent discord thing to the top level
       * because meteor can't consolidate embeded documents when publishing
       * cursors with different visibile fields
       */
      avatar: user.services.discord.avatar,
      discordId: user.services.discord.id,
      email: user.services.discord.email,
      username: user.services.discord.username,
      lastSync: new Date()
    }
  })
});


SyncedCron.add({
  name: 'Create matches',
  schedule: function (parser) {
    return parser.text('every day at midnight');
  },
  job: function () {
    createMatches();
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});