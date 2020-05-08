import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";
import { autorun } from 'meteor/cereal:reactive-render';
import List from "@material-ui/core/List";
import { routes } from '../../lib/constants';
import AuthenticatedDrawerItems from "./AuthenticatedDrawerItems";

@autorun
export default class extends React.Component {
  render() {
    return(
      <div>
        <Divider />
        <List>
          {
            routes.map(r => (
              <ListItem key={r.name} button component={Link} to={r.href}>
                <ListItemIcon>
                  {<r.Icon/>}
                </ListItemIcon>
                <ListItemText primary={r.name}/>
              </ListItem>
            ))
          }
        </List>
        <AuthenticatedDrawerItems />
      </div>
    )
  }
}
