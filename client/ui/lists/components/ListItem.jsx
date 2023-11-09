import React from 'react';
import { withStyles } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import { ListItemText, Typography, ListItem as MuiListItem, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    ...draggableStyle
});


const styles = theme => ({
    icon: {
        paddingRight: theme.spacing(2),
        justifyContent: 'flex-end'
    },
});

@withStyles(styles, { withTheme: true })
export class ListItem extends React.Component {
    render() {
        const { item, classes } = this.props;

        console.log(item);

        return (
            <Draggable draggableId={item.id} index={item.index}>
                {(provided, snapshot) => (
                    <MuiListItem
                        selected={snapshot.isDragging}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={
                            getItemStyle(snapshot.isDragging, provided.draggableProps.style)
                        }
                        divider
                        dense
                    >
                        <ListItemIcon className={classes.icon}>{item.index}</ListItemIcon>
                        <ListItemText primary={item.title}></ListItemText>
                        <Typography component={"span"}>
                            <ListItemIcon>
                                <IconButton edge="end" aria-label="delete" onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this?")) {
                                        Meteor.call("list.deleteItem", list._id, item.index)
                                    }
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemIcon>
                        </Typography>
                    </MuiListItem>
                )}
            </Draggable>
        )

    }
}