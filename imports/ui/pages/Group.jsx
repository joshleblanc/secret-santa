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
import Grow from "../components/Grow";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/styles/withStyles";
import {withSnackbar} from "notistack";
import Container from "../components/Container";
import moment from "moment";
import Match from "../components/Match";
import SignupButtons from "../components/SignupButtons";

const styles = theme => ({
  titleRow: {
    display: 'flex'
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const { classes, match: { params: { id } } } = this.props;
    const user = Meteor.user();
    if(!user) {
      return(
        <Container>
          <Typography variant={"h4"}>Hold on!</Typography>
          <Typography variant="subtitle1">You need to sign in first!</Typography>
        </Container>
      )
    }

    const subscription = Meteor.subscribe('group', id);
    const userSubscription = Meteor.subscribe('currentUser', Meteor.userId());
    if(!subscription.ready() || !userSubscription.ready() || !user.guilds) {
      return <LinearProgress />
    }
    console.log(user);
    const group = Groups.findOne({ _id: new Mongo.ObjectID(id) });
    console.log(group);
    const server = user.guilds.find(g => g.id === group.server);
    const users = Meteor.users.find({ discordId: {
      $in: group.participants
    }}).fetch();
    console.log(users);

    return(
      <React.Fragment>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12} md={6}>
            <PaddedPaper>
              <div className={classes.titleRow}>
                <Typography variant="h4">
                  {group.name}
                </Typography>
                <Grow />
                <SignupButtons group={group} />
              </div>

              <Typography variant="subtitle1">{server.name}</Typography>
              <Grid container spacing={2} justify="center">
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">Signups Deadline</Typography>
                  <Typography align="center">{moment(group.startDate).format("YYYY-MM-DD")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">Shipping Deadline</Typography>
                  <Typography align="center">{moment(group.endDate).format("YYYY-MM-DD")}</Typography>
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
                        <TableRow key={u._id}>
                          <TableCell>{u.username}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </PaddedPaper>
          </Grid>
        </Grid>
        <Grid container spacing={2} justify={"center"}>
          <Grid item xs={12} md={6}>
            <Match group={group} />
          </Grid>
        </Grid>
      </React.Fragment>

    )
  }
}
