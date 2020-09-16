import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from "@material-ui/core/LinearProgress";
import {Matches} from "../../../imports/api/matches";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import SwapIcon from "@material-ui/icons/SwapHorizontalCircle";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import classNames from 'classnames';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  check: {
    color: green[500]
  },
  cancel: {
    color: red[500]
  },
  swap: {
    color: orange[500]
  },
  icon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'bottom'
  }
}));

const Icon = ({Component, name}) => {
  const classes = useStyles();
  return <Component className={classNames(classes[name], classes.icon)} fontSize={"small"} />
};

@autorun
export default class extends React.Component {
  render() {
    const { group } = this.props;
    const matchesSubscription = Meteor.subscribe('matches.shippingInfo', group._id);
    if(!matchesSubscription.ready()) {
      return <LinearProgress />
    }

    const matches = Matches.find({ groupId: group._id }).fetch();
    if(matches.length === 0) {
      return null;
    }

    const allShipped = matches.every(m => m.shipped);
    const noneShipped = matches.every(m => !m.shipped);
    let text = "Shipments are starting to go out";
    let icon = <Icon Component={SwapIcon} name={"swap"} />;
    if(allShipped) {
      text = "Everyone's shipped their gifts!";
      icon = <Icon Component={CheckIcon} name={"check"} />
    } else if(noneShipped) {
      text = "No one's shipped yet!";
      icon = <Icon Component={CancelIcon} name={"cancel"} />
    }
    return(
      <Typography variant={"body2"}>
        {icon}
        {text}
      </Typography>
    )
  }
}