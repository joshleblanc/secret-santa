import React from 'react';
import Typography from '@material-ui/core/Typography';
import {SignUpEndings} from '../components/SignUpEndings';
import {autorun} from 'meteor/cereal:reactive-render';
import PaddedPaper from "../components/PaddedPaper";

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
        <PaddedPaper>
          <Typography variant="h4">Approaching Deadlines</Typography>
          <br/>
          <Typography variant="h5" gutterBottom>Sign Ups Ending</Typography>
          <SignUpEndings/>
        </PaddedPaper>
      </>
    )
  }
}
