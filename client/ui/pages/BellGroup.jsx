import React from 'react';
import {useParams} from 'react-router-dom';
import {LinearProgress} from "@material-ui/core";
import {useTracker} from 'meteor/react-meteor-data';
import {BellGroups} from '/imports/api/bell_groups';
import {EnterBells} from "../components/bells/EnterBells";
import Grid from "@material-ui/core/Grid";
import BellList from "../components/bells/BellList";

export const BellGroup = () => {
  const {id} = useParams();
  console.log(id);
  const ready = useTracker(() => Meteor.subscribe('users.bells', id).ready());
  const groupReady = useTracker(() => Meteor.subscribe('bell_group', id).ready())
  const group = useTracker(() => BellGroups.findOne(new Mongo.ObjectID(id)));
  const users = useTracker(() => {
    if (group) {
      return Meteor.users.find({
        _id: {
          $in: group.userIds
        }
      }).fetch();
    } else {
      return [];
    }

  });
  if (!ready || !groupReady) {
    return <LinearProgress/>
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <EnterBells group={group}/>
      </Grid>
      <Grid item xs={12}>
        <BellList users={users} />
      </Grid>
    </Grid>
  );
}
