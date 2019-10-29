import React from 'react';
import { Meteor } from 'meteor/meteor';
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

@autorun
export default class extends React.Component {
    render() {
        if(Meteor.userId()) {
            return <Button color="inherit" component={Link} to="/profile">Profile</Button>
        } else if(Meteor.isClient && Meteor.loggingIn()) {
            return <LinearProgress />
        } else {
            return <Button color="inherit" component={Link} to="/login">Login</Button>
        }
    }
}
