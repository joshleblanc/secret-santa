import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import {LinearProgress} from "@material-ui/core";
import { Matches } from '/imports/api/matches';

@autorun
export default class extends React.Component {
  state = {};

  componentDidMount() {
    this.setState({
      matchesSubscription:  Meteor.subscribe('matches', Meteor.userId())
    });
  }

  componentWillUnmount() {
    if(this.state.matchesSubscription) {
      this.state.matchesSubscription.stop();
    }
  }

  render() {
    if(!this.state.matchesSubscription || !this.state.matchesSubscription.ready()) {
      return <LinearProgress />
    }
    console.log(Matches.find({}).fetch());
    return(
      <>
      </>
    )
  }
}