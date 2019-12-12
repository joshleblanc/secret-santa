import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import {authenticatedRoutes} from "../../lib/constants";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MessagesDrawerItem from "./MessagesDrawerItem";

@autorun
class AuthenticatedDrawerItems extends React.Component {
  render() {
    if(!Meteor.user()) {
      return null;
    }

    return(
      <>
        <Divider />
        {
          authenticatedRoutes.map(r => (
            <ListItem key={r.name} button component={Link} to={r.href}>
              <ListItemIcon>
                {<r.Icon/>}
              </ListItemIcon>
              <ListItemText primary={r.name}/>
            </ListItem>
          ))
        }
        <MessagesDrawerItem />
      </>
    )
  }
}

export default AuthenticatedDrawerItems;