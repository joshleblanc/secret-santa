import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import NavbarButton from "./NavbarButton";

@autorun
export default class extends React.Component {
  render() {
    if(!Meteor.user()) {
      return null;
    }
    return(
      <React.Fragment>
        <NavbarButton to="/groups">Secret Santas</NavbarButton>
        <NavbarButton to="/profile">Profile</NavbarButton>
      </React.Fragment>
    )
  }
}