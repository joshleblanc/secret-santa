import React from 'react';
import {Route, Switch} from "react-router-dom";
import {WeightGroupList} from "./pages/WeightGroupList";
import {AddWeightGroup} from "./pages/AddWeightGroup";
import WeightGroup from "./pages/WeightGroup";

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/weight_groups" component={WeightGroupList}/>
      <Route exact path="/weight_groups/add" component={AddWeightGroup}/>
      <Route exact path="/weight_groups/:id" component={WeightGroup}/>
    </Switch>
  )
}
