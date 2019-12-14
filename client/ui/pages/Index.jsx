import React from 'react';
import Typography from '@material-ui/core/Typography';
import {autorun} from 'meteor/cereal:reactive-render';
import PaddedPaper from "../components/PaddedPaper";
import Dashboard from "../components/Dashboard";

@autorun
export default class extends React.Component {
  render() {
    return (
      <>
        <PaddedPaper>
          <Typography variant={"h4"}>Hello!</Typography>
          {
            !Meteor.userId() && <Typography>
              Login to get started
            </Typography>
          }
        </PaddedPaper>
        <Dashboard />
      </>
    )
  }
}
