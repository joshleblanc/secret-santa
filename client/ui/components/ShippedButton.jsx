import React from 'react';
import Button from "@material-ui/core/Button";

export default ({ match }) => {
  const handleClick = React.useCallback(() => {
    if(window.confirm("Are you sure you want to mark your gift as shipped?")) {
      Meteor.call('matches.setShipped', match.groupId);
    }
  }, []);
  let text;
  if(match.shipped) {
    text = "You've shipped your gift!";
  } else {
    text = "I've shipped my gift!"
  }
  return(
    <Button
      fullWidth
      variant={"outlined"}
      color={"primary"}
      onClick={handleClick}
      disabled={match.shipped}
    >
      {text}
    </Button>
  )
}