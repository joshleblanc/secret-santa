import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    }
}));

export default React.forwardRef(({children, ...props}, ref) => {
    const classes = useStyles();
    return <Paper ref={ref} classes={classes} {...props}>{children}</Paper>
});
