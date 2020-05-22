import React from 'react';
import {ListItemSecondaryAction, MenuList} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { autorun } from 'meteor/cereal:reactive-render';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import BaseEntriesDialog from "../../components/groups/BaseEntriesDialog";

@autorun
export default class EntriesDialog extends React.Component {
    render() {
        const { open, onClose } = this.props;
        const ready = Meteor.subscribe('currentUser.weights').ready();
        const user = Meteor.user();
        if(!ready || !user) return null;
        return(
          <BaseEntriesDialog
            title={"Weight Entries"}
            open={open}
            onClose={onClose}
            array={user.weights}
            createPrimaryText={w => `${w.weight.toFixed(2)}lbs`}
            createSecondaryText={w => w.addedAt.toLocaleString()}
            createKey={w => `${w.weight}${w.addedAt.toLocaleString()}`}
            onDelete={w => Meteor.call('user.deleteWeight', w.weight, w.addedAt)}
          />
        )
    }
}
