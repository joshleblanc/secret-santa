import React from 'react';
import {BaseGroupList} from "../components/groups/BaseGroupList";
import {BellGroups} from "../../../imports/api/bell_groups";
import {EnterBells} from "../components/bells/EnterBells";
import Grid from "@material-ui/core/Grid";

export const BellGroupList = () => {
  return(
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <EnterBells />
      </Grid>
      <Grid item xs={12}>
        <BaseGroupList
          subscription={"bell_groups"}
          collection={BellGroups}
          addLinkLabel={"Create Turnip Group"}
          addUrl={"/bells/groups/add"}
          createGroupUrl={id => `/bells/groups/${id.toHexString()}`}
          deleteMethod={"bell_groups.delete"}
          title={"Turnip Groups"}
        />
      </Grid>
    </Grid>
  )
}
