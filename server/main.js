import React from "react";
import '../imports/api/groups';
import '../imports/api/users';
import './api';
import {Groups} from "../imports/api/groups";
import moment from "moment";
import './migrations';

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

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * https://stackoverflow.com/a/12646864/2424975
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function partition(arr, size) {
  const ret = [];
  for(let i = 0; i < arr.length; i++) {
    ret.push(arr.slice(i, i + size));
  }
  return ret;
}

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
      shuffleArray(participants);
      const matches = partition(participants);
      Groups.update({ _id: group._id }, {
        $set: {
          matches
        }
      })
    });
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  SyncedCron.start();
});