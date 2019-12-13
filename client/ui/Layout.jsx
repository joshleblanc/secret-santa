import React from 'react';
import Navbar from './components/navbar/Navbar';
import { makeStyles } from '@material-ui/styles';
import Drawer from "./components/drawer/Drawer";
import Routes from "./Routes";
import Footer from "./components/Footer";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    lineHeight: 1.65
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    maxWidth: '100%'
  },
  toolbar: theme.mixins.toolbar,
}));

export default (props) => {
  const classes = useStyles();
  return(
    <div className={classes.root}>
      <Navbar themeToggleHandler={props.themeToggleHandler} />
      <Drawer themeToggleHandler={props.themeToggleHandler} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes />
      </main>
      <Footer />
    </div>
  )
};
