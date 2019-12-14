import React from 'react';
import {Groups} from '/imports/api/groups';
import {Matches} from '/imports/api/matches';
import {autorun} from 'meteor/cereal:reactive-render';
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
import withStyles from "@material-ui/styles/withStyles";
import moment from "moment";
import Match from "../components/Match";
import SignupButtons from "../components/SignupButtons";
import ShipmentStatus from "../components/ShipmentStatus";
import Avatar from "@material-ui/core/Avatar";
import {avatarUrl} from "../../../imports/api/users";
import Container from "@material-ui/core/Container";
import BorderedPaper from "../components/BorderedPaper";

const styles = theme => ({
  titleRow: {
    display: 'flex'
  },
  avatar: {
    width: 48
  },
  username: {
    fontSize: '1rem',
    fontWeight: 500
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const {classes, match: {params: {id}}} = this.props;
    const user = Meteor.user();
    if (!user) {
      return (
        <Container>
          <Typography variant={"h4"}>Hold on!</Typography>
          <Typography variant="subtitle1">You need to sign in first!</Typography>
        </Container>
      )
    }

    const groupId = new Mongo.ObjectID(id);
    const subscription = Meteor.subscribe('group', groupId);
    if (!subscription.ready() || !user.guilds) {
      return <LinearProgress/>
    }
    const group = Groups.findOne({_id: groupId});
    const server = user.guilds.find(g => g.id === group.server);
    const users = Meteor.users.find({
      discordId: {
        $in: group.participants
      }
    }).fetch();
    const matches = Matches.find({groupId}).fetch();
    return (
      <>
        <Match group={group}/>
        <PaddedPaper>
          <div className={classes.titleRow}>
            <Typography variant="h4">
              {group.name}
            </Typography>
          </div>
          <SignupButtons group={group}/>
          <ShipmentStatus group={group}/>
          <Typography variant="subtitle1">{server.name}</Typography>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} md={6}>
              <BorderedPaper>
                <Typography variant="h6" align="center">Signups Deadline</Typography>
                <Typography align="center">{moment(group.startDate).format("YYYY-MM-DD")}</Typography>
              </BorderedPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <BorderedPaper>
                <Typography variant="h6" align="center">Shipping Deadline</Typography>
                <Typography align="center">{moment(group.endDate).format("YYYY-MM-DD")}</Typography>
              </BorderedPaper>
            </Grid>
          </Grid>
          <Typography variant="h6">Participants</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                users.map(u => {
                  return (
                    <TableRow key={u._id}>
                      <TableCell className={classes.avatar}><Avatar src={avatarUrl(u)}/></TableCell>
                      <TableCell className={classes.username}>
                        {u.discordUsername}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </PaddedPaper>
      </>

    )
  }
}
