import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2)
  },
}));

export default () => {
  const classes = useStyles();
  return(
    <footer className={classes.footer}>
      <div>
        Santa Icon made by <Link href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</Link> from <Link href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</Link>
      </div>
    </footer>
  )
}