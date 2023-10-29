import {createGroup} from "../lib/groups";

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
    }
});
