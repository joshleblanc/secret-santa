import React from 'react';
import Chart from 'react-apexcharts';
import PaddedPaper from "../PaddedPaper";
import { withTheme } from "@material-ui/core";
import { autorun } from 'meteor/cereal:reactive-render';

@withTheme
@autorun
export default class WeightGraph extends React.Component {
    render() {
        const { users, theme } = this.props;
        
        const series = users.map(u => {
            return({
                name: u.discordUsername,
                data: u.weights ? u.weights.map(w => ({ x: w.addedAt, y: w.weight })) : []
            });
        }).filter(s => s.data.length > 0);
        const options = {
            yaxis: {
                labels: {
                    formatter: value => {
                        if(value) {
                            return `${value.toFixed(2)}lbs`;
                        }
                    }
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
            },
            markers: {
                size: 4
            }
        };

        return(
            <PaddedPaper>
                <Chart series={series} type={"line"} options={options}/>
            </PaddedPaper>
        )
    }
}
