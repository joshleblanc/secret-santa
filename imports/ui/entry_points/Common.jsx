import React from 'react';
import { ThemeProvider, StylesProvider, createGenerateClassName } from "@material-ui/styles";
import theme from '/imports/ui/lib/theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

export default ({children}) => {
    return(
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <StylesProvider
                generateClassName={createGenerateClassName()}
            >
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </StylesProvider>
        </MuiPickersUtilsProvider>
    )
}
