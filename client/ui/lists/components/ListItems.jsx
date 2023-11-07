import React from 'react';
import PaddedPaper from '../../components/PaddedPaper';
import { ListItemText, Typography, List, ListItem, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import { autorun } from 'meteor/cereal:reactive-render';

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
});

export class ListItems extends React.Component {
    handleDragEnd = result => {
        if (!result.destination) {
            return;
        }

        Meteor.call("list.reorder", this.props.list._id, result.source.index, result.destination.index)
    }

    render() {
        const { list } = this.props;

        const items = (list.listItems || []).sort((a, b) => a.index - b.index);

        return (
            <DragDropContext onDragEnd={this.handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            <PaddedPaper>
                                <Typography variant="h4">List items</Typography>
                                <List>
                                    {
                                        items.map(item => (
                                            <Draggable key={item.id} draggableId={item.id} index={item.index}>
                                                {(provided, snapshot) => (
                                                    <ListItem 
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
                                                        <ListItemIcon>{item.index}</ListItemIcon>
                                                        <ListItemText primary={item.title}></ListItemText>
                                                        <ListItemSecondaryAction>
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
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )}
                                            </Draggable>

                                        ))
                                    }
                                </List>
                            </PaddedPaper>

                        </div>

                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}