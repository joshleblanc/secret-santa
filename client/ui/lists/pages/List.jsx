import React from 'react';
import {autorun} from 'meteor/cereal:reactive-render';
import { EnterListItem } from '../components/EnterListItem';
import { ListItems } from '../components/ListItems';
import { LinearProgress, Grid } from '@material-ui/core';
import { Lists } from '../../../../imports/api/lists';

@autorun
export class List extends React.Component {
    render() {
        const {match: {params: {id}}} = this.props;
        const groupReady = Meteor.subscribe('list', id).ready();
        if (!groupReady) {
          return <LinearProgress/>
        }
        const list = Lists.findOne(new Mongo.ObjectID(id));
        const users = Meteor.users.find({
          _id: {
            $in: list.userIds
          }
        });
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EnterListItem list={list}/>
            </Grid>
            <Grid item xs={12}>
              <ListItems list={list}/>
            </Grid>
          </Grid>
        )
    }
}