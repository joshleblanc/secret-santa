import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import Button from "@material-ui/core/Button";

@autorun
export default class extends React.Component {
  handleClick = () => {
    const { group } = this.props;
    Meteor.call("group.sendEmails", group._id.toHexString());
  };

  render() {
    const user = Meteor.user();
    if(!user || !(user.discordId === "104628928781496320")) {
      return null;
    }
    return <Button variant={"contained"} color="secondary" onClick={this.handleClick}>Send Emails</Button>
  }}
