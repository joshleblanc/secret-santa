import React from 'react';
import {Dialog, ListItemSecondaryAction} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuList from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import DialogContent from "@material-ui/core/DialogContent";

const BaseEntriesDialog = ({ title, open, onDelete, onClose, array, createPrimaryText, createSecondaryText, createKey }) => {
  const values = array ? array.sort((a,b) => b.addedAt - a.addedAt) : [];
  return(
    <Dialog open={open} fullWidth maxWidth={"sm"} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <MenuList>
          {
            values.map(v => (
              <ListItem key={createKey(v)}>
                <ListItemText primary={createPrimaryText(v)} secondary={createSecondaryText(v)} />
                <ListItemSecondaryAction onClick={() => {
                  if(window.confirm("Are you sure you want to delete this?")) {
                    onDelete(v);
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default BaseEntriesDialog;

BaseEntriesDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  array: PropTypes.array,
  onDelete: PropTypes.func,
  createPrimaryText: PropTypes.func,
  createSecondaryText: PropTypes.func,
  createKey: PropTypes.func
}
