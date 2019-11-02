import React from 'react';
import {autorun} from 'meteor/cereal:reactive-render';
import PaddedPaper from "./PaddedPaper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Matches} from '/imports/api/matches';
import Avatar from "@material-ui/core/Avatar";
import {avatarUrl} from '/imports/api/users';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  header: {
    display: 'flex',
    paddingBottom: theme.spacing(1)
  },
  username: {
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingLeft: theme.spacing(1)
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const {group, classes} = this.props;
    const user = Meteor.user();
    if (!group.hasMatches || !group.participants.includes(user.discordId)) {
      return null;
    }

    const subscription = Meteor.subscribe('match', group._id, user.discordId);
    if (!subscription.ready()) {
      return <LinearProgress/>
    }

    const match = Matches.findOne({
      gifter: user.discordId,
      groupId: group._id
    });

    const receiver = Meteor.users.findOne({
      discordId: match.receiver
    });

    /**
     * This *shouldn't* happen, but if it does,
     * we don't want the page to crash
     */
    if(!receiver) {
      console.log("Receiver is null", group, user, match);
      return null;
    }

    console.log(receiver);
    return (
      <PaddedPaper>
        <Typography variant={"h4"} gutterBottom>
          Match
          <Typography variant={"caption"} paragraph>
            You're this person's secret santa!
          </Typography>
        </Typography>

        <div className={classes.header}>
          <Avatar src={avatarUrl(receiver)}/>
          <Typography variant={"subtitle1"} className={classes.username}>
            {receiver.profile.name}
          </Typography>
        </div>
        <Typography variant={"h6"}>
          Contact information
        </Typography>
        <Typography gutterBottom>
          {receiver.email}
        </Typography>
        <Typography variant={"h6"}>
          Shipping information
        </Typography>
        {
          receiver.shipping
            ? receiver.shipping.address.split("\n").map((s, i) => {
                return (
                  <Typography key={i}>
                    {s}
                  </Typography>
                )
            })
            : <Typography>User hasn't submitted a shipping address</Typography>
        }
      </PaddedPaper>
    )
  }
}