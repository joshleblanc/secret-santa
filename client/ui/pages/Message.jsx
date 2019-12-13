import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from "@material-ui/core/LinearProgress";
import { Matches } from '/imports/api/matches';
import PaddedPaper from "../components/PaddedPaper";

@autorun
export default class extends React.Component {
  state = {};

  componentDidMount() {
    this.setState({
      matchSubscription: Meteor.subscribe('messages', this.props.match.params.id, Meteor.userId())
    })
  }

  componentWillUnmount() {
    if(this.state.matchSubscription) {
      this.state.matchSubscription.stop();
    }
  }

  render() {
    if(!this.state.matchSubscription || !this.state.matchSubscription.ready()) {
      return <LinearProgress />
    }
    const match = Matches.findOne({
      _id: new Mongo.ObjectID(this.props.match.params.id)
    });
    console.log(match);
    return(
      <PaddedPaper>
      </PaddedPaper>
    )
  }
}