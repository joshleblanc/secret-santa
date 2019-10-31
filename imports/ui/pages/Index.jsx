import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import PaddedPaper from "../components/PaddedPaper";

export default class extends React.Component {
    render() {
        return(
          <Grid container spacing={2} justify={"center"}>
              <Grid item xs={12} md={6}>
                  <PaddedPaper>
                      <Typography variant={"h4"}>Hello!</Typography>
                      <Typography>
                          Login to get started
                      </Typography>
                  </PaddedPaper>
              </Grid>
          </Grid>
        )
    }
}
