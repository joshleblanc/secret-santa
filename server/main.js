import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {createMatches} from "../imports/api/groups";
import './migrations';
import {sendMessageReminders, sync} from "../imports/api/users";
import '../imports/api/weight_groups';
import 'meteor/cereal:accounts-fitbit';

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

ServiceConfiguration.configurations.upsert(
    { service: "fitbit" },
    {
      $set: {
        clientId: Meteor.settings.fitbit.id,
        secret: Meteor.settings.fitbit.secret
      }
    }
)

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
