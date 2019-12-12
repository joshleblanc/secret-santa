import React from 'react';
import {Link} from "react-router-dom";
import EmailIcon from '@material-ui/icons/Email';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default () => {
  return(
    <ListItem button component={Link} to={"/messages"}>
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText>Messages</ListItemText>
    </ListItem>
  )
}