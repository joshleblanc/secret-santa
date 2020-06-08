import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Button from "@material-ui/core/Button";
import { Mongo } from 'meteor/mongo';

export const BaseAccessButton = ({ group, collectionName }) => {
  const isMember = group.userIds.includes(Meteor.userId());
  const join = React.useCallback(() => {
    Meteor.call(`${collectionName}.join`, group._id.toHexString());
  }, [collectionName]);

  const leave = React.useCallback(() => {
    Meteor.call(`${collectionName}.leave`, group._id.toHexString());
  }, [collectionName])
  if(isMember) {
    return(
      <Button fullWidth color="secondary" variant={"contained"}
              onClick={leave}>Leave</Button>
    )
  } else {
    return(
      <Button fullWidth color="secondary" variant={"contained"}
              onClick={join}>Join</Button>
    )
  }

}

BaseAccessButton.propTypes = {
  group: PropTypes.shape({
    userIds: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.instanceOf(Mongo.ObjectID)
  })
}
