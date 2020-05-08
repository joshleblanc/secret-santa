import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';

@autorun
export default class extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    console.log(this.props);
    if(!Meteor.user() && !Meteor.loggingIn()) {
      Meteor.loginWithDiscord({
        requestPermissions: ['identify', 'email', 'guilds']
      });
    } else {
      history.push("/");
    }
  }

  render() {
    return null;
  }
}
