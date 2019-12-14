import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import {SignUpEndings} from "./SignUpEndings";
import PaddedPaper from "./PaddedPaper";
import Typography from "@material-ui/core/Typography";

@autorun
export default class Dashboard extends React.Component {
  render() {
    if(!Meteor.user()) {
      return null;
    }
    return(
      <PaddedPaper>
        <Typography variant="h4">Approaching Deadlines</Typography>
        <br/>
        <SignUpEndings/>
      </PaddedPaper>
    )
  }
}