import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import DrawerItems from "./components/drawer/DrawerItems";
import Routes from "./Routes";
import Layout from 'meteor/cereal:ui/components/Layout';
import {LinearProgress} from "@material-ui/core";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

@autorun
export default class App extends React.Component {
  render() {
    const handle = Meteor.subscribe('currentUser');
    if(!handle.ready()) {
      return <LinearProgress />
    }
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Layout
          Routes={Routes}
          DrawerItems={DrawerItems}
        />
      </MuiPickersUtilsProvider>
    );
  }
}
