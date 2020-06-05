import React from 'react';
import EnterWeight from "../components/EnterWeight";
import WeightGraph from "../components/WeightGraph";
import {Hidden, LinearProgress} from "@material-ui/core";
import WeightList from "../components/WeightList";
import {WeightGroups} from "../../../../imports/api/weight_groups";
import {autorun} from 'meteor/cereal:reactive-render';
import Grid from "@material-ui/core/Grid";

@autorun
export default class WeightGroup extends React.Component {
  render() {
    const {match: {params: {id}}} = this.props;
    const ready = Meteor.subscribe('users.weight', id).ready();
    const groupReady = Meteor.subscribe('weight_group', id).ready();
    if (!ready || !groupReady) {
      return <LinearProgress/>
    }
    const group = WeightGroups.findOne(new Mongo.ObjectID(id));
    const users = Meteor.users.find({
      _id: {
        $in: group.userIds
      }
    });
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <EnterWeight group={group}/>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12}>
            <WeightGraph group={group} users={users}/>
          </Grid>
        </Hidden>
        <Grid item xs={12}>
          <WeightList users={users}/>
        </Grid>
      </Grid>
    )
  }
}
