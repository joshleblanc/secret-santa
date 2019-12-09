import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from "@material-ui/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CssBaseline from "@material-ui/core/CssBaseline";
import {SnackbarProvider} from "notistack";
import Layout from "./Layout";
import getTheme from './lib/theme';

export default class App extends React.Component {
  state = {
    theme: 'light'
  };

  toggleTheme() {
    if(this.state.theme == 'light') {
      this.setState({ theme: 'dark' });
    } else {
      this.setState({ theme: 'light' });
    }
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={getTheme(this.state.theme)}>
          <SnackbarProvider>
            <CssBaseline/>
            <BrowserRouter>
              <Layout themeToggleHandler={() => this.toggleTheme()} />
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}
