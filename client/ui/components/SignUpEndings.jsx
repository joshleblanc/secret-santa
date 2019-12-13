import React from "react";
import { autorun } from 'meteor/cereal:reactive-render';
import { withStyles } from "@material-ui/styles";
import { Groups } from '/imports/api/groups';
import { CircularProgress, Typography } from "@material-ui/core";
import moment from "moment";
import PaddedPaper from "./PaddedPaper";
import MuiLink from '@material-ui/core/Link';
import { Link } from 'react-router-dom';

const styles = theme => ({
  horizontalView: {
    display: 'flex',
    margin: '1rem',
    width: `calc(100% - 2rem )`,
    overflow: 'auto',
    padding: '.2rem',
  },
  card: {
    margin: "0 .25rem",
    width: '240px'
  }
});

@withStyles(styles)
@autorun
export class SignUpEndings extends React.Component {
  render() {
    const user = Meteor.user();
    const { classes } = this.props;
    if(!user) {
      return null;
    }

    const userSub = Meteor.subscribe('currentUser', user._id);
    const groupsSub = Meteor.subscribe('groups.ending', user._id);

    if(!groupsSub.ready() || !userSub.ready()) {
      return <CircularProgress />
    }

    const groups = Groups.find({
      participants: {
        $elemMatch: {
          $eq:  user.discordId
        }
      },
      startDate: {
        $gt: new Date()
      }
    }, {
      sort: {
        startDate: 1
      },
      limit: 3
    }).fetch();

    console.log(groups);
    const today = moment(new Date());

    return (
      <section className={classes.horizontalView}>
        {
          groups.map(group => {
            const end = moment(group.startDate);
            return (
              <PaddedPaper elevation={1} className={classes.card} key={group._id.toHexString()}>
                <Typography variant="h6">
                  <MuiLink component={Link} to={`/groups/${group._id.toHexString()}`} color={"inherit"}>{group.name}</MuiLink>
                </Typography>

                <Typography variant="body2">Signups close in {moment.duration(end.diff(today)).humanize()}</Typography>
                <br />
                <Typography variant="body1">Ends on {end.format("YYYY-MM-DD")}</Typography>
              </PaddedPaper>
            );
          })
        }
      </section>
    );
  }
}