import React from 'react';
import Navbar from './navbar/Navbar';
import { Route, Switch } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Index from '../pages/Index';
import Profile from "../pages/Profile";
import Groups from '../pages/Groups';
import AddGroup from "../pages/AddGroup";
import Group from '../pages/Group';
import Drawer from "./drawer/Drawer";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        maxWidth: '100%'
    },
    toolbar: theme.mixins.toolbar,
}));

export default () => {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <Navbar />
            <Drawer />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/groups" component={Groups} />
                    <Route exact path="/groups/add" component={AddGroup} />
                    <Route exact path="/groups/:id" component={Group} />
                </Switch>
            </main>
        </div>
    )
};
