import { createMuiTheme } from '@material-ui/core/styles';
import primary from '@material-ui/core/colors/green';
import secondary from '@material-ui/core/colors/red';
import error from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
    palette: {
        primary: primary,
        secondary: secondary,
        error: error,
        tonalOffset: 0.8
    },
});
export default theme;
