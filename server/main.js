import {FastRender} from 'meteor/staringatlights:fast-render';
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import React from "react";
import ReactDOMServer from 'react-dom/server'
import '../imports/api/groups';
import '../imports/api/users';

ServiceConfiguration.configurations.upsert(
  { service: 'discord' },
  {
      $set: {
          loginStyle: "popup",
          clientId: "639045709819019264",
          secret: Meteor.settings.discord.secret
      }
  }
);

FastRender.onPageLoad(async sink => {
    const ServerEntryPoint = (await import('../imports/ui/entry_points/ServerEntryPoint')).default;
    const sheets = new ServerStyleSheets();

    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <ServerEntryPoint location={sink.request.url} />
        ),
    );

    const css = sheets.toString();

    sink.appendToHead(`<style id="jss-server-side">${css}</style>`);
    sink.renderIntoElementById('react-target', html);
});
