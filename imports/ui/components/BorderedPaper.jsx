import React from 'react';
import makeStyles from "@material-ui/styles/makeStyles";
import PaddedPaper from "./PaddedPaper";

const useStyles = makeStyles(theme => ({
  card: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.contrastText
  }
}));

export default ({children, ...props}) => {
  const classes = useStyles();
  return(
    <PaddedPaper elevation={0} className={classes.card} {...props}>
      {children}
    </PaddedPaper>
  )
}