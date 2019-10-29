import React from 'react';
import Navbar from './Navbar';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Index from '../pages/Index';
import { SnackbarProvider } from 'notistack';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Groups from '../pages/Groups';
import AddGroup from "../pages/AddGroup";

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
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <SnackbarProvider>
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/groups" component={Groups} />
                        <Route exact path={"/groups/add"} component={AddGroup} />
                    </Switch>
                </SnackbarProvider>
            </main>
        </div>
    )
};
