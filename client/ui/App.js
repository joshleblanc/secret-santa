import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MomentUtils from "@date-io/moment";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import CssBaseline from "@material-ui/core/CssBaseline";
import SnackbarProvider from "notistack/build/SnackbarProvider";
import getTheme from './lib/theme';
import {AppStoreContext} from './stores/AppStore';
import { autorun } from 'meteor/cereal:reactive-render';
import DrawerItems from "./components/drawer/DrawerItems";
import Routes from "./Routes";
import Layout from 'meteor/cereal:ui/components/Layout';

@autorun
export default class App extends React.Component {
  render() {
    return (
      <Layout
        Routes={Routes}
        DrawerItems={DrawerItems}
      />
    );
  }
}
