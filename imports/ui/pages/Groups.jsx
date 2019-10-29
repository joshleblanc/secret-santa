import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import Grid from "@material-ui/core/Grid";
import PaddedPaper from "../components/PaddedPaper";
import {Typography} from "@material-ui/core";
import Grow from "../components/Grow";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

@autorun
export default class extends React.Component {
    render() {
        return(
            <Grid container spacing={2} justify={"center"}>
                <Grid item xs={12} md={6}>
                    <PaddedPaper>
                        <Typography variant={"h4"}>Secret Santas</Typography>
                        <Grow />
                        <Button
                            component={Link}
                            variant="contained"
                            to="/groups/add"
                            color={"secondary"}
                        >
                            Create Secret Santa
                        </Button>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}
