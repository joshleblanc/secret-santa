import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import BaseEntriesDialog from "../groups/BaseEntriesDialog";

@autorun
export default class EntriesDialog extends React.Component {
  render() {
    const { open, onClose } = this.props;
    const ready = Meteor.subscribe('currentUser.bells').ready();
    const user = Meteor.user();
    if(!ready || !user) return null;
    return(
      <BaseEntriesDialog
        title={"Bell Entries"}
        open={open}
        onClose={onClose}
        array={user.bells}
        createPrimaryText={b => b.price}
        createSecondaryText={b => b.addedAt.toLocaleString()}
        createKey={b => `${b.price}${b.addedAt.toLocaleString()}`}
        onDelete={b => Meteor.call('user.deleteBell', b.price, b.addedAt)}
      />
    )
  }
}
