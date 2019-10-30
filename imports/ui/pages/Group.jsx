import React from 'react';
import { Groups } from '/imports/api/groups';
import { autorun } from 'meteor/cereal:reactive-render';
import Grid from '@material-ui/core/Grid';
import PaddedPaper from '../components/PaddedPaper';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

@autorun
export default class extends React.Component {
  render() {
    const { match: { params: { id } } } = this.props;
    const subscription = Meteor.subscribe('group', id);
    const userSubscription = Meteor.subscribe('currentUser', Meteor.userId());
    if(!subscription.ready() || !userSubscription.ready()) {
      return <LinearProgress />
    }
    const group = Groups.findOne({ _id: new Mongo.ObjectID(id) });
    const server = Meteor.user().guilds.find(g => g.id === group.server);
    const users = Meteor.users.find({ "services.discord.id": {
      $in: group.participants
    }}).fetch();

    return(
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} md={6}>
          <PaddedPaper>
            <Typography variant="h4">{group.name}</Typography>
            <Typography variant="subtitle1">{server.name}</Typography>
            <Grid container spacing={2} justify="center">
              <Grid item xs={6}>
                <Typography variant="h6" align="center">Signups Deadline</Typography>
                <Typography align="center">{group.startDate}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" align="center">Shipping Deadline</Typography>
                <Typography align="center">{group.endDate}</Typography>
              </Grid>
            </Grid>
            <Typography variant="h6">Participants</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  users.map(u => {
                    return(
                      <TableRow>
                        <TableCell>{u.name}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </PaddedPaper>
        </Grid>
      </Grid>
    )
  }
}
