import React from 'react';
import {withStyles} from "@material-ui/core";
import Table from "@material-ui/core/Table";

const styles = {
    container: {
        overflowX: "auto"
    }
};

@withStyles(styles)
export default class StyledTable extends React.Component {
    render() {
        const { classes, children, ...props } = this.props;
        return(
            <div className={classes.container}>
                <Table size={"small"} {...props}>
                    {children}
                </Table>
            </div>
        )
    }
}