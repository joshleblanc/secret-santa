import React from 'react';
import {autorun} from 'meteor/cereal:reactive-render';
import Grid from "@material-ui/core/Grid";
import PaddedPaper from "../components/PaddedPaper";
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Grow from "../components/Grow";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import MuiLink from '@material-ui/core/Link';
import {Groups} from '/imports/api/groups';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from "moment";

const styles = theme => ({
  header: {
    display: 'flex'
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  render() {
    const {classes} = this.props;
    const user = Meteor.user();
    if (!user) {
      return null;
    }
    const groupsSub = Meteor.subscribe('groups', user._id);

    if (!groupsSub.ready()) {
      return <LinearProgress/>
    }
    const groups = Groups.find({
      participants: {
        $elemMatch: {
          $eq: user.discordId
        }
      }
    }, {
      sort: {
        startDate: 1
      }
    }).fetch();
    return (
      <PaddedPaper>
        <div className={classes.header}>
          <Typography variant={"h4"}>Secret Santas</Typography>
          <Grow/>
          <Button
            size="small"
            component={Link}
            variant="contained"
            to="/groups/add"
            color={"secondary"}
          >
            Create Secret Santa
          </Button>
        </div>
        {
          groups.length === 0
            ? <Typography>You haven't signed up for any secret santas!</Typography>
            : <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Signup Deadline</TableCell>
                  <TableCell>Shipping Deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  groups.map(g => {
                    return (
                      <TableRow key={g._id.toHexString()}>
                        <TableCell>
                          <MuiLink component={Link} to={`/groups/${g._id.toHexString()}`}>
                            {g.name}
                          </MuiLink>
                        </TableCell>
                        <TableCell>{moment(g.startDate).format("YYYY-MM-DD")}</TableCell>
                        <TableCell>{moment(g.endDate).format("YYYY-MM-DD")}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
        }
      </PaddedPaper>

    )
  }
}
