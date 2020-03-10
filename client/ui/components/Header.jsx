import React from 'react';
import {withStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Grow from "./Grow";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const styles = theme => ({
    header: {
        display: 'flex',
        marginBottom: theme.spacing(2)
    }
});

@withStyles(styles)
export default class Header extends React.Component {
    render() {
        const { classes, title, to, linkLabel } = this.props;
        return(
            <div className={classes.header}>
                <Typography variant={"h4"}>{title}</Typography>
                <Grow/>
                <Button
                    size="small"
                    component={Link}
                    variant="contained"
                    to={to}
                    color={"secondary"}
                >
                    {linkLabel}
                </Button>
            </div>
        )
    }
}