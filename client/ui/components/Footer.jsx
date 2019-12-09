import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2)
  },
  link: {
    color: "#4285F4",
    textDecoration: "none"
  }
}));

export default () => {
  const classes = useStyles();
  return(
    <footer className={classes.footer}>
      <div>
        Santa Icon made by <a className={classes.link} href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a className={classes.link} href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      </div>
    </footer>
  )
}