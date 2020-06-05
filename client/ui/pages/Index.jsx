import React from 'react';
import Typography from '@material-ui/core/Typography';
import {autorun} from 'meteor/cereal:reactive-render';
import PaddedPaper from "../components/PaddedPaper";
import Dashboard from "../components/Dashboard";
import Grid from "@material-ui/core/Grid";

@autorun
export default class extends React.Component {
  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PaddedPaper>
            <Typography variant={"h4"}>Hello!</Typography>
            {
              !Meteor.userId() && <Typography>
                Login to get started
              </Typography>
            }
          </PaddedPaper>
        </Grid>
        <Grid item xs={12}>
          <Dashboard />
        </Grid>
      </Grid>
    )
  }
}
