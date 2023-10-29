import React from 'react';
import PaddedPaper from '../../components/PaddedPaper';
import { ListItemText, Typography, List, ListItem, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export const ListItems = ({ list }) => {
    const items = (list.listItems || []).sort((a,b) => a.index - b.index);
    console.log(items);
    return(
        <PaddedPaper>
            <Typography variant="h4">List items</Typography>
            <List>
                {
                    items.map(item => (
                        <ListItem key={item._id}>
                            <ListItemText primary={`${item.index}: ${item.title}`}></ListItemText>
                            <ListItemSecondaryAction>
                                <Typography component={"span"}>
                                    <ListItemIcon>
                                    <IconButton edge="end" aria-label="delete" onClick={() => {
                                            if(window.confirm("Are you sure you want to delete this?")) {
                                                Meteor.call("list.deleteItem", list._id, item.index)
                                            }
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemIcon>
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
        </PaddedPaper>
    )
}