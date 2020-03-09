import React from 'react';
import Chart from 'react-apexcharts';
import PaddedPaper from "../PaddedPaper";
import {LinearProgress} from "@material-ui/core";
import { autorun } from 'meteor/cereal:reactive-render';

@autorun
export default class WeightGraph extends React.Component {
    render() {
        const ready = Meteor.subscribe('users.weight').ready();
        if(!ready) {
            return <LinearProgress />
        }
        const users = Meteor.users.find({});
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
            }
        };

        return(
            <PaddedPaper>
                <Chart series={series} type={"line"} options={options}/>
            </PaddedPaper>
        )
    }
}