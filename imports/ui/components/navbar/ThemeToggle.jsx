import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {useStore} from "../../stores/AppStore";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: '1rem'
  }
}));

export default function ThemeToggle() {
  const classes = useStyles();
  const { toggleTheme } = useStore();
  return(
    <Button variant="text" onClick={toggleTheme} size="small" className={classes.button}>
      Toggle Theme
    </Button>
  )
} 