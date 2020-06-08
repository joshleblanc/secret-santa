import React from 'react';
import {Link} from "react-router-dom";
import EmailIcon from '@material-ui/icons/Email';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from "@material-ui/core/LinearProgress";

@autorun
export default class extends React.Component {
  render() {
    const user = Meteor.user();
    if(!user) {
      return <LinearProgress />
    }
    const unread = user.unreadMessages;
    return (
      <ListItem button component={Link} to={"/messages"}>
        <ListItemIcon>
          <Badge color={"primary"} badgeContent={unread ? unread.length : 0} variant={"dot"}>
            <EmailIcon/>
          </Badge>
        </ListItemIcon>
        <ListItemText>Messages</ListItemText>
      </ListItem>

    )
  }
}