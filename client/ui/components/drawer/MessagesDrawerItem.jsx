import React from 'react';
import {Link} from "react-router-dom";
import EmailIcon from '@material-ui/icons/Email';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";

export default () => {
  return (

    <ListItem button component={Link} to={"/messages"}>
      <ListItemIcon>
        <Badge color={"primary"} badgeContent={""} variant={"dot"}>
          <EmailIcon/>
        </Badge>
      </ListItemIcon>
      <ListItemText>Messages</ListItemText>
    </ListItem>

  )
}