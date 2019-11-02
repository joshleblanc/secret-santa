import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './components/Routes';
import MomentUtils from "@date-io/moment";
import {createGenerateClassName, StylesProvider, ThemeProvider} from "@material-ui/styles";
import theme from "./lib/theme";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CssBaseline from "@material-ui/core/CssBaseline";

export default () => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);
  return(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <StylesProvider
        generateClassName={createGenerateClassName()}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ThemeProvider>
      </StylesProvider>
    </MuiPickersUtilsProvider>
  )
}
