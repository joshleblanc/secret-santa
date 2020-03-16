import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import PaddedPaper from "../PaddedPaper";
import Typography from "@material-ui/core/Typography";
import {LinearProgress, ListItemSecondaryAction} from "@material-ui/core";
import {WeightGroups} from "../../../../imports/api/weight_groups";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

@autorun
export default class WeightList extends React.Component {
    render() {
        const { users } = this.props;
        return(
            <PaddedPaper>
                <Typography variant={"h4"}>Participants</Typography>
                <List>
                    {
                        users.map(u => {
                            const weights = u.weights ? u.weights : [];
                            let status = "No Data";
                            let firstWeight = "No Data";
                            if(weights.length > 0) {
                                firstWeight = weights[weights.length - 1].weight;
                                const weightDiff = firstWeight - weights[0].weight;
                                status = `${weightDiff.toFixed(2)}lbs`;
                                firstWeight = `${firstWeight.toFixed(2)}lbs`;
                            }
                            return(
                                <ListItem key={u._id}>
                                    <ListItemText primary={u.discordUsername} secondary={firstWeight}/>
                                    <ListItemSecondaryAction>
                                        <Typography variant={"h6"}>
                                            {status}
                                        </Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </PaddedPaper>
        )
    }
}