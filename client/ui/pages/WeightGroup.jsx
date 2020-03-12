import React from 'react';
import EnterWeight from "../components/weightloss/EnterWeight";
import WeightGraph from "../components/weightloss/WeightGraph";
import Button from "@material-ui/core/Button";
import {Hidden} from "@material-ui/core";
import WeightList from "../components/weightloss/WeightList";

export default class WeightGroup extends React.Component {
    render() {
        const { match: {params: {id} } } = this.props;

        return(
            <>
                <EnterWeight groupId={id} />
                <Hidden xsDown>
                    <WeightGraph groupId={id} />
                </Hidden>
                <WeightList groupId={id} />
            </>
        )
    }
}