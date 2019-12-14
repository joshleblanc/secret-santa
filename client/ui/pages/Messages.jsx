import React from 'react';
import {autorun} from 'meteor/cereal:reactive-render';
import {LinearProgress, withStyles} from "@material-ui/core";
import {Matches} from '/imports/api/matches';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Groups} from "../../../imports/api/groups";
import ListItemText from "@material-ui/core/ListItemText";
import PaddedPaper from "../components/PaddedPaper";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";

const styles = theme => ({
  badge: {
    margin: theme.spacing(2, 1)
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {

  render() {
    const { classes } = this.props;
    const matchesSubscription = Meteor.subscribe('matches', Meteor.userId());
    const groupsSubscription = Meteor.subscribe('groups', Meteor.userId());
    if (!matchesSubscription.ready() || !groupsSubscription.ready()) {
      return <LinearProgress/>
    }
    const user = Meteor.user();

    // The query should be duplicated here
    // but I can't think of a way to do that while
    // still hiding the gifter id
    const matches = Matches.find({}).fetch();
    return (
      <PaddedPaper>
        <Typography variant="h6">Messages</Typography>
        <List>
          {
            matches.map(m => {
              const group = Groups.findOne({_id: m.groupId});
              let secondary;
              console.log(m.receiver, user.discordId);
              if (m.receiver === user.discordId) {
                secondary = "Your secret santa messaged you!"
              } else {
                secondary = "You message your recipient!"
              }
              const unreadMessages = user.unreadMessages || [];
              let hasUnreadMessage = unreadMessages.map(u => u.toHexString()).includes(m._id.toHexString());
              console.log(user.unreadMessages, m._id);
              console.log(user.unreadMessages && user.unreadMessages.includes(m._id));
              return (
                <React.Fragment key={m._id.toHexString()}>
                  <Badge
                    color={"primary"}
                    badgeContent={hasUnreadMessage ? "" : 0}
                    variant={"dot"}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left'}}
                    classes={classes}
                  >
                  <ListItem button component={Link} to={`/messages/${m._id.toHexString()}`}>
                      <ListItemText primary={

                          group.name
                      } secondary={secondary}/>
                  </ListItem>
                  </Badge>

                  <Divider/>
                </React.Fragment>
              )
            })
          }
        </List>
      </PaddedPaper>
    )
  }
}