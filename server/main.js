import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {Groups} from "../imports/api/groups";
import moment from "moment";
import './migrations';
import { match } from './lib/match';

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

SyncedCron.add({
  name: 'Create matches',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 minute');
  },
  job: function() {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const groups = Groups.find({
      startDate: {
        $lte: new Date()
      },
      matches: {
        $exists: false
      }
    }).fetch();
    console.log(groups.length);

    groups.forEach(group => {
      console.log(group);
      const participants = group.participants;
      const matches = match(participants);
      console.log(matches);
      // Groups.update({ _id: group._id }, {
      //   $set: {
      //     matches
      //   }
      // })
    });
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});