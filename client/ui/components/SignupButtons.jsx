import React from 'react';
import Button from "@material-ui/core/Button";
import {withSnackbar} from "notistack";
import { autorun } from 'meteor/cereal:reactive-render';
import {signupsClosed} from "/imports/api/groups";

@withSnackbar
@autorun
export default class extends React.Component {

  handleSignup = () => {
    const { enqueueSnackbar, group } = this.props;
    Meteor.call("groups.signup", group._id.toHexString(), (err, res) => {
      if(err) {
        console.error(err);
        enqueueSnackbar("Error signing up! Please try again.", { variant: "error" });
      } else {
        enqueueSnackbar("You're all signed up!", { variant: "success" });
      }
    })
  };

  handleSignout = () => {
    const { enqueueSnackbar, group } = this.props;
    Meteor.call("groups.signout", group._id.toHexString(), (err, res) => {
      if(err) {
        console.error(err);
        enqueueSnackbar("Error leaving secret santa! Please try again.", { variant: "error" });
      } else {
        enqueueSnackbar("You've left the secret santa", { variant: "success" });
      }
    })
  };

  render() {
    const { group } = this.props;
    const user = Meteor.user();
    if(signupsClosed(group)) {
      return null;
    }
    if(group.participants.includes(user.discordId)) {
      return <Button variant={"contained"} color="secondary" onClick={this.handleSignout}>Leave Secret Santa</Button>
    } else {
      return <Button variant={"contained"} color="secondary" onClick={this.handleSignup}>Sign up!</Button>
    }
  }
}