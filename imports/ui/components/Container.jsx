import React from 'react';
import Grid from "@material-ui/core/Grid";
import PaddedPaper from "./PaddedPaper";

export default ({children}) => {
  return(
    <Grid container spacing={2} justify='center'>
      <Grid item xs={12} md={6}>
        <PaddedPaper>
          {children}
        </PaddedPaper>
      </Grid>
    </Grid>
  )
}