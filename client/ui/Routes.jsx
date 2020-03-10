import React from 'react';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import AddGroup from "./pages/AddGroup";
import Group from "./pages/Group";
import {Route, Switch} from "react-router-dom";
import Messages from "./pages/Messages";
import Message from './pages/Message';
import { autorun } from 'meteor/cereal:reactive-render';
import WeightGroupList from "./pages/WeightGroupList";
import WeightGroup from "./pages/WeightGroup";
import AddWeightGroup from "./pages/AddWeightGroup";

@autorun
export default class extends React.Component {
  render() {
    const user = Meteor.user();
    if(user) {
      return(
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/groups" component={Groups} />
          <Route exact path="/groups/add" component={AddGroup} />
          <Route exact path="/groups/:id" component={Group} />
          <Route exact path="/messages" component={Messages} />
          <Route exact path="/messages/:id" component={Message} />
          <Route exact path="/weight_groups" component={WeightGroupList} />
          <Route exact path="/weight_groups/add" component={AddWeightGroup} />
          <Route exact path="/weight_groups/:id" component={WeightGroup} />
        </Switch>
      )
    } else {
      return <Index />
    }
  }
};