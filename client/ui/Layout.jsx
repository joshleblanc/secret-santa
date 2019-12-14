import React from 'react';
import Navbar from './components/navbar/Navbar';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from "./components/drawer/Drawer";
import Routes from "./Routes";
import Footer from "./components/Footer";
import Container from "@material-ui/core/Container";
import { autorun } from 'meteor/cereal:reactive-render';

const styles = theme => ({
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
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const { classes } = this.props;
    Meteor.subscribe('currentUser', Meteor.userId());
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
  }
};
