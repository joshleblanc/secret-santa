import React from 'react';
import Button from "@material-ui/core/Button";
import {Meteor} from "meteor/meteor";

export default class extends React.Component {
  logout = () => {
    Meteor.logout();
  };

  render() {
    return(
      <Button color="inherit" onClick={this.logout}>Logout</Button>
    )
  }
}