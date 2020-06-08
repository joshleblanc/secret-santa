import React from 'react';
import {Route, Switch} from "react-router-dom";
import {BellGroupList} from "./pages/BellGroupList";
import {AddBellGroup} from "./pages/AddBellGroup";
import {BellGroup} from "./pages/BellGroup";

export const Routes = () => {
  return(
    <Switch>
      <Route exact path={"/bells/groups"} component={BellGroupList} />
      <Route exact path={"/bells/groups/add"} component={AddBellGroup} />
      <Route exact path={"/bells/groups/:id"} component={BellGroup} />
    </Switch>
  )
}
