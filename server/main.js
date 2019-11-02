import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {Groups} from "../imports/api/groups";
import './migrations';
import {match} from './lib/match';
import {Matches} from '../imports/api/matches';
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
    // parser is a later.parse object
    return parser.text('every 1 minute');
  },
  job: function () {
    const groups = Groups.find({
      startDate: {
        $lte: new Date()
      },
      hasMatches: false,
      participants: {
        $exists: true,
        $not: {
          $size: 0
        }
      }
    }).fetch();

    groups.forEach(group => {
      const participants = group.participants;
      const matches = match(participants);
      const users = Meteor.users.find({
        discordId: {
          $in: participants
        }
      }).fetch();
      Matches.remove({groupId: group._id});
      matches.forEach(match => {
        Matches.insert({
          gifter: match[0],
          receiver: match[1],
          groupId: group._id
        })
      });
      Groups.update({_id: group._id}, {
        $set: {
          hasMatches: true
        }
      });
      Email.send({
        from: "secret-santa@grep.sh",
        bcc: users.map(u => u.email),
        subject: "Your secret santa match has been made!",
        text: "You're a secret santa!\n" +
          `Head over to ${Meteor.absoluteUrl(`/groups/${group._id.toHexString()}`)} to check it out!`
      });
    });
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});