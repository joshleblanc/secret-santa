import React from 'react';
import {autorun} from 'meteor/cereal:reactive-render';
import {LinearProgress} from "@material-ui/core";
import {Matches} from '/imports/api/matches';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Groups} from "../../../imports/api/groups";
import ListItemText from "@material-ui/core/ListItemText";
import PaddedPaper from "../components/PaddedPaper";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

@autorun
export default class extends React.Component {
  state = {};

  render() {
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
    const groups = Groups.find({
      _id: {
        $in: matches.map(m => m.groupId)
      }
    }).fetch();
    return (
      <PaddedPaper>
        <Typography variant="h6">Messages</Typography>
        <List>
          {
            matches.map(m => {
              const group = Groups.findOne({_id: m.groupId});
              let secondary;
              console.log(m.receiver, user.discordId);
              if(m.receiver === user.discordId) {
                secondary = "Your secret santa messaged you!"
              } else {
                secondary = "You message your recipient!"
              }
              return (
                <React.Fragment key={m._id.toHexString()}>
                  <ListItem button component={Link} key={m._id.toHexString()} to={`/messages/${m._id.toHexString()}`}>
                    <ListItemText primary={group.name} secondary={secondary}/>
                  </ListItem>
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