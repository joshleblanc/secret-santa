import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from "@material-ui/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CssBaseline from "@material-ui/core/CssBaseline";
import {SnackbarProvider} from "notistack";
import Layout from "./Layout";
import getTheme from './lib/theme';
import appStore from './stores/AppStore';
import { autorun } from 'meteor/cereal:reactive-render';

@autorun
export default class App extends React.Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={getTheme(appStore.theme)}>
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
