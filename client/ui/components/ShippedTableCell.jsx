import React from 'react';
import {Matches} from "../../../imports/api/matches";
import TableCell from "@material-ui/core/TableCell";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import green from "@material-ui/core/colors/green";
import red from '@material-ui/core/colors/red';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
  cell: {
    width: 100
  },
  check: {
    color: green[500]
  },
  close: {
    color: red[500]
  }
}));

export default ({user, group}) => {
  const classes = useStyles();
  const match = Matches.findOne({groupId: group._id, gifter: user.discordId});
  let icon;

  if (match && match.shipped) {
    icon = <CheckIcon className={classes.check} />;
  } else {
    icon = <CloseIcon className={classes.close} />;
  }

  return(
    <TableCell className={classes.cell}>
      {icon}
    </TableCell>
  )
}