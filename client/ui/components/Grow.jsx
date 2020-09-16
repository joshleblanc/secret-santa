import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    }
}));

export default () => {
    const classes = useStyles();

    return(
        <div className={classes.grow} />
    )
}
