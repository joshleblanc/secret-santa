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

@autorun
export default class EntriesDialog extends React.Component {
    render() {
        const { open, onClose } = this.props;
        const ready = Meteor.subscribe('currentUser.weights').ready();
        const user = Meteor.user();
        if(!ready || !user) return null;
        const weights = user.weights ? user.weights.sort((a,b) => b.addedAt - a.addedAt) : [];
        return(
            <Dialog open={open} fullWidth maxWidth={"sm"} onClose={onClose}>
                <DialogTitle>Weight Entries</DialogTitle>
                <MenuList>
                    {
                        weights.map((w, i) => (
                            <ListItem key={`${w.weight}${w.addedAt.toLocaleString()}`}>
                                <ListItemText primary={`${w.weight.toFixed(2)}lbs`} secondary={w.addedAt.toLocaleString()} />
                                <ListItemSecondaryAction onClick={() => {
                                    if(window.confirm("Are you sure you want to delete this?")) {
                                        Meteor.call('user.deleteWeight', w.weight, w.addedAt)
                                    }
                                }}>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    }
                </MenuList>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}