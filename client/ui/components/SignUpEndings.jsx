import React from "react";
import { autorun } from 'meteor/cereal:reactive-render';
import { withStyles } from "@material-ui/styles";
import { Groups } from '/imports/api/groups';
import { CircularProgress, Typography } from "@material-ui/core";
import moment from "moment";
import PaddedPaper from "./PaddedPaper";

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
      }
    }, {
      sort: {
        startDate: 1
      },
      limit: 3
    }).fetch();
    const today = moment(new Date());

    return (
      <section className={classes.horizontalView}>
        {
          groups.filter(group => group.startDate > (new Date())).map(group => {
            const end = moment(group.startDate);
            return (
              <PaddedPaper elevation={1} className={classes.card}>
                <Typography variant="h6">{group.name}</Typography>
                <Typography variant="body2">{end.diff(today, "days")} days remaining</Typography>
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