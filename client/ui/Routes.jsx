import React from 'react';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import AddGroup from "./pages/AddGroup";
import Group from "./pages/Group";
import {Redirect, Route, Switch} from "react-router-dom";
import Messages from "./pages/Messages";
import Message from './pages/Message';
import {autorun} from 'meteor/cereal:reactive-render';
import Login from "./pages/Login";
import { Routes as TurnipRoutes } from './turnips/Routes';
import { Routes as WeightRoutes } from './weights/Routes';

@autorun
export default class extends React.Component {
  render() {
    const user = Meteor.user();
    if (user) {
      return (
        <Switch>
          <Route exact path="/" component={Index}/>
          <Route exact path="/profile" component={Profile}/>
          <Route exact path="/groups" component={Groups}/>
          <Route exact path="/groups/add" component={AddGroup}/>
          <Route exact path="/groups/:id" component={Group}/>
          <Route exact path="/messages" component={Messages}/>
          <Route exact path="/messages/:id" component={Message}/>
          <Route path={"/weight_groups"}>
            <WeightRoutes />
          </Route>
          <Route path={"/bells"}>
            <TurnipRoutes />
          </Route>
          <Route exact path="/login">
            <Redirect to={"/"} />
          </Route>
        </Switch>
      )
    } else {
      return (
        <>
          <Route exact path="/login" component={Login}/>
          <Index/>
        </>
      )
    }
  }
};
