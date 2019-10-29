import {FastRender} from 'meteor/staringatlights:fast-render';
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import React from "react";
import ReactDOMServer from 'react-dom/server'
import '../imports/api/groups';

Meteor.users.allow({
    update: function(userId, doc, fields, modifier) {
        const target = modifier['$set']['emails.0.address'];
        return userId === doc._id && fields.includes("emails") && target && target.length < 100;
    }
});

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
