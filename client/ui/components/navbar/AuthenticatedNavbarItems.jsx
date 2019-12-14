import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import NavbarButton from "./NavbarButton";
import { authenticatedRoutes } from '../../lib/constants';
import MessagesNavItem from "./MessagesNavItem";

@autorun
export default class extends React.Component {
  render() {
    if(!Meteor.user()) {
      return null;
    }
    return(
      <React.Fragment>
        {
          authenticatedRoutes.map(d => (
            <NavbarButton key={d.name} to={d.href}>{d.name}</NavbarButton>
          ))
        }
        <MessagesNavItem />
      </React.Fragment>
    )
  }
}