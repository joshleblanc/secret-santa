import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import Button from "@material-ui/core/Button";

@autorun
export default class extends React.Component {
  handleClick = () => {
    Meteor.loginWithDiscord({
      requestPermissions: ['identify', 'email']
    }, err => {
      if(err) {
        console.error(err)
      } else {
        console.log("Logged in")
      }
    })
  };

  render() {
    return(
      <Button color="inherit" onClick={this.handleClick}>Login</Button>
    )
  }
}
