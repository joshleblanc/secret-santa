import React from 'react';
import Button from "@material-ui/core/Button";
import { Meteor } from 'meteor/meteor';
import { autorun } from 'meteor/cereal:reactive-render';

@autorun
export default class LoginWithFitbitButton extends React.Component {
    handleLogin = () => {
        Meteor.loginWithFitbit({
            requestPermissions: ['profile', 'weight']
        }, (err, res) => {
            if(!err) {
                Meteor.call('users.subscribeToFitbit');
            }
        });
    }

    handleDisconnect = () => {
        Meteor.call("users.disconnectFitbit");
    }

    render() {
        const user = Meteor.user();
        if (!user) {
            return null;
        }
        if(user.services.fitbit) {
            return(
              <Button variant="contained" onClick={this.handleDisconnect}>Disconnect fitbit</Button>
            )
        } else {
            return(
              <Button variant="contained" onClick={this.handleLogin}>Login with fitbit</Button>
            )
        }

    }
}