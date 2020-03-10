import React from 'react';
import EnterWeight from "../components/weightloss/EnterWeight";
import WeightGraph from "../components/weightloss/WeightGraph";

export default class WeightGroup extends React.Component {
    render() {
        const { match: {params: {id} } } = this.props;

        return(
            <>
                <EnterWeight />
                <WeightGraph groupId={id} />
            </>
        )
    }
}