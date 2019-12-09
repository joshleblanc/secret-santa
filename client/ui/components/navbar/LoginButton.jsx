import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import Button from "@material-ui/core/Button";

@autorun
export default class extends React.Component {
  handleClick = () => {
    Meteor.loginWithDiscord({
      requestPermissions: ['identify', 'email', 'guilds']
    });
  };

  render() {
    return(
      <Button color="inherit" onClick={this.handleClick}>Login</Button>
    )
  }
}
