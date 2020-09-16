import React from 'react';
import Badge from "@material-ui/core/Badge";
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from "@material-ui/core/LinearProgress";
import NavbarButton from "./NavbarButton";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  badge: {
    marginTop: theme.spacing(1)
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const { classes } = this.props;
    const user = Meteor.user();
    if(!user) {
      return <LinearProgress />
    }
    const unread = user.unreadMessages || [];

    return (
      <Badge color={"secondary"} badgeContent={unread.length} classes={classes} variant={"dot"}>
        <NavbarButton to={"/messages"}>Messages</NavbarButton>
      </Badge>
    )
  }
}