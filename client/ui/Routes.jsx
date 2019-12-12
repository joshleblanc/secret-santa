import React from 'react';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import AddGroup from "./pages/AddGroup";
import Group from "./pages/Group";
import {Route, Switch} from "react-router-dom";
import Messages from "./pages/Messages";

export default () => {
  return(
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/groups" component={Groups} />
      <Route exact path="/groups/add" component={AddGroup} />
      <Route exact path="/groups/:id" component={Group} />
      <Route exact path="/messages" component={Messages} />
    </Switch>
  )
};