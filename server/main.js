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