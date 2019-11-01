import React from 'react';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1)
  }
}));

export default ({ to, children }) => {
  const classes = useStyles();
  return(
    <Button className={classes.button} color="inherit" component={Link} to={to}>{children}</Button>
  )
}