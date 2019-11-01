import React from 'react';
import { Meteor } from 'meteor/meteor';
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from '@material-ui/core/LinearProgress';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

@autorun
export default class extends React.Component {
    render() {
        if(Meteor.userId()) {
            return <LogoutButton />
        } else if(Meteor.isClient && Meteor.loggingIn()) {
            return <LinearProgress />
        } else {
            return <LoginButton />
        }
    }
}
