import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {createMatches} from "../imports/api/groups";
import './migrations';
import {sendMessageReminders, sync} from "../imports/api/users";

console.log(sync);

ServiceConfiguration.configurations.upsert(
  {service: 'discord'},
  {
    $set: {
      loginStyle: "redirect",
      clientId: Meteor.settings.discord.id,
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

  await sync(user);
});

SyncedCron.add({
  name: 'Create matches',
  schedule: function (parser) {
    return parser.text('at 0:00');
  },
  job: function () {
    createMatches();
    sendMessageReminders();
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});
