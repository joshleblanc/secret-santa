import {createGroup} from "../lib/groups";
import { Random } from 'meteor/random';

const { collection, createSchema } = createGroup("lists");

export const Lists = collection;
export const createListSchema = createSchema;

Meteor.methods({
    "list.addItem"(id, title) {
        const user = Meteor.user();
        const list = Lists.findOne(id)
        if(user && list) {

            Lists.update({
                _id: id
            }, {
                $push: {
                    listItems: {
                        title,
                        id: Random.id(),
                        index: (list.listItems || []).length
                    }
                }
            })
        }
    },
    "list.deleteItem"(id, index) {
        const user = Meteor.user();
        let list = Lists.findOne(id);

        console.log("Hello?", id, index)
        if(user && list) {
            Lists.update({
                _id: id
            }, {
                $pull: {
                    listItems: {
                        index
                    }
                }
            })
            list = Lists.findOne(id);
            list.listItems.sort((a,b) => a.index - b.index).forEach((item, idx) => {
                Lists.update({ _id: id }, {
                    $set: {
                        [`listItems.${idx}.index`]: idx
                    }
                })
            })

        }
    },
    "list.reorder"(id, sourceIndex, destinationIndex) {
        const list = Lists.findOne(id);
        const user = Meteor.user();

        if(!list) return;

        const items = list.listItems.sort((a,b) => a.index - b.index);
        const tmp = items[sourceIndex].index;

        items[sourceIndex].index = destinationIndex;
        items[destinationIndex].index = tmp;

        Lists.update({ _id: id }, {
            $set: {
                listItems: items
            }
        })
    }
});
