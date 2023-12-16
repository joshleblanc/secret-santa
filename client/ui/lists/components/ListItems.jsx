import React from 'react';
import PaddedPaper from '../../components/PaddedPaper';
import { Typography, List, ListItem } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { ListItem as MyListItem } from './ListItem';

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
                                        items.map(item => <MyListItem item={item} key={item.id} />)
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