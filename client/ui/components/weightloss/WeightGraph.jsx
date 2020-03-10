import React from 'react';
import Chart from 'react-apexcharts';
import PaddedPaper from "../PaddedPaper";
import {LinearProgress, withTheme} from "@material-ui/core";
import { autorun } from 'meteor/cereal:reactive-render';
import { WeightGroups} from "../../../../imports/api/weight_groups";

@withTheme
@autorun
export default class WeightGraph extends React.Component {
    render() {
        const { theme, groupId } = this.props;
        const ready = Meteor.subscribe('users.weight', groupId).ready();
        const groupReady = Meteor.subscribe('weight_group', groupId).ready();
        if(!ready || !groupReady) {
            return <LinearProgress />
        }
        const group = WeightGroups.findOne(new Mongo.ObjectID(groupId));
        console.log(group);
        const users = Meteor.users.find({
            _id: {
                $in: group.userIds
            }
        });
        const series = users.map(u => {
            return({
                name: u.discordUsername,
                data: u.weights ? u.weights.map(w => ({ x: w.addedAt, y: w.weight })) : []
            });
        });
        const options = {
            yaxis: {
                labels: {
                    formatter: value => `${value}lbs`
                }
            },
            xaxis: {
                type: 'datetime'
            },
            theme: {
                mode: theme.palette.type,
                palette: "palette3"
            },
            tooltip: {
                shared: false
            }
        };

        return(
            <PaddedPaper>
                <Chart series={series} type={"line"} options={options}/>
            </PaddedPaper>
        )
    }
}
