import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: '1rem'
  }
}));

export default function ThemeToggle({ themeToggleHandler }) {
  const classes = useStyles();
  return (
    <Button variant="text" onClick={themeToggleHandler} size="small" className={classes.button}>
      Toggle Theme
    </Button>
  )
} 