import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import {LinearProgress} from "@material-ui/core";
import PaddedPaper from "../components/PaddedPaper";
import { WeightGroups } from "../../../imports/api/weight_groups";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import {Link} from "react-router-dom";
import MuiLink from '@material-ui/core/Link';
import Header from "../components/Header";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

@autorun
export default class WeightGroupList extends React.Component {
    render() {
        const ready = Meteor.subscribe('weight_groups').ready();
        if(!ready) {
            return <LinearProgress />
        }
        const user = Meteor.user();
        const weightGroups = WeightGroups.find({
            userIds: {
                $elemMatch: {
                    $eq: user._id
                }
            }
        }).fetch();
        console.log(WeightGroups.find({}).fetch());

        return (
            <PaddedPaper>
                <Header title={"WeightGroup Loss Groups"} to={'/weight_groups/add'} linkLabel={"Create WeightGroup Loss Group"} />
                {
                    weightGroups.length === 0
                        ? <Typography>You don't have any groups!</Typography>
                        : <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell># Participants</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                weightGroups.map(g => {
                                    return(
                                        <TableRow key={g._id.toHexString()}>
                                            <TableCell>
                                                <MuiLink component={Link} to={`/weight_groups/${g._id.toHexString()}`}>
                                                    {g.name}
                                                </MuiLink>
                                            </TableCell>
                                            <TableCell>
                                                {g.userIds.length}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    g.creator === user._id &&
                                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                                            if(window.confirm("Are you sure you want to delete this?")) {
                                                                Meteor.call("weight_groups.delete", g._id)
                                                            }
                                                        }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                }
                                            </TableCell>
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