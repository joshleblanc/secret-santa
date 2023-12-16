import React from 'react';
import {Route, Switch} from "react-router-dom";
import { AddList } from './pages/AddList';
import { ListList } from './pages/ListList';
import { List } from './pages/List';

export const Routes = () => {
    return(
        <Switch>
            <Route exact path="/lists" component={ListList}></Route>
            <Route exact path="/lists/add" component={AddList}></Route>
            <Route exact path="/lists/:id" component={List}></Route>
        </Switch>
    )
}