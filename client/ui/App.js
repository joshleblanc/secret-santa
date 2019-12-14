import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from "@material-ui/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CssBaseline from "@material-ui/core/CssBaseline";
import {SnackbarProvider} from "notistack";
import Layout from "./Layout";
import getTheme from './lib/theme';
import {AppStoreContext} from './stores/AppStore';
import { autorun } from 'meteor/cereal:reactive-render';

@autorun
export default class App extends React.Component {
  static contextType = AppStoreContext;
  render() {
    const { theme } = this.context;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={getTheme(theme)}>
          <SnackbarProvider>
              <CssBaseline/>
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}
