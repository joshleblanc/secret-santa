import React from 'react';
import EnterWeight from "../components/weightloss/EnterWeight";
import WeightGraph from "../components/weightloss/WeightGraph";

export default class WeightLoss extends React.Component {
    render() {
        return (
            <>
                <EnterWeight />
                <WeightGraph />
            </>
        )

    }
}