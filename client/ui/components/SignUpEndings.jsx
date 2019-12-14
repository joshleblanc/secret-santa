import React from "react";
import { autorun } from 'meteor/cereal:reactive-render';
import { Groups } from '/imports/api/groups';
import moment from "moment";
import MuiLink from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import BorderedPaper from "./BorderedPaper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

@autorun
export class SignUpEndings extends React.Component {
  render() {
    const user = Meteor.user();
    const { classes } = this.props;
    if(!user) {
      return null;
    }

    const groupsSub = Meteor.subscribe('groups.ending', user._id);

    if(!groupsSub.ready()) {
      return <LinearProgress />
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

    const today = moment(new Date());

    return (
      <>
        <Typography variant="h5" gutterBottom>Sign Ups Ending</Typography>
        <Grid container spacing={2}>
          {
            groups.map(group => {
              const end = moment(group.startDate);
              return (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={group._id.toHexString()}>
                  <BorderedPaper>
                    <Typography variant="h6">
                      <MuiLink component={Link} to={`/groups/${group._id.toHexString()}`}>{group.name}</MuiLink>
                    </Typography>

                    <Typography variant="body2">Signups close in {moment.duration(end.diff(today)).humanize()}</Typography>
                    <br />
                    <Typography variant="body1">Ends on {end.format("YYYY-MM-DD")}</Typography>
                  </BorderedPaper>
                </Grid>

              );
            })
          }
        </Grid>
      </>
    );
  }
};