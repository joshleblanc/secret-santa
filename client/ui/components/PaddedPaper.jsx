import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    }
}));

export default ({children, ...props}) => {
    const classes = useStyles();
    return <Paper classes={classes} {...props}>{children}</Paper>
}
