import React from 'react';
import Navbar from './components/navbar/Navbar';
import { makeStyles } from '@material-ui/styles';
import Drawer from "./components/drawer/Drawer";
import Routes from "./Routes";
import Footer from "./components/Footer";
import Container from "@material-ui/core/Container";
import {LinearProgress} from "@material-ui/core";
import { makeTracker } from 'meteor/cereal:reactive-render';

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

const useTracker = makeTracker(() => {
  return Meteor.subscribe('currentUser', Meteor.userId());
});

export default (props) => {
  const classes = useStyles();
  useTracker();
  return(
    <Container maxWidth={"md"}>
      <Navbar />
      <Drawer />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes />
      </main>
      <Footer />
    </Container>
  )
};
