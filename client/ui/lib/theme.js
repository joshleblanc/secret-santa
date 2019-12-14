import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import primaryLight from '@material-ui/core/colors/green';
import primaryDark from '@material-ui/core/colors/teal';
import secondary from '@material-ui/core/colors/red';
import error from '@material-ui/core/colors/pink';

export default function getTheme(theme) {
    return createMuiTheme({
        palette: {
            type: theme,
            primary: theme === "light" ? primaryLight : primaryDark,
            secondary: secondary,
            error: error,
            tonalOffset: 0.8,
        },
        typography: {
            fontFamily: `Poppins, Roboto, sans-serif`
        }
    });
};
