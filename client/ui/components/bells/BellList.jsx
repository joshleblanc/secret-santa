import React from 'react';
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import moment from "moment";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {ListItemSecondaryAction} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PaddedPaper from 'meteor/cereal:ui/components/PaddedPaper';
import BellHistory from "./BellHistory";

const BellList = ({users}) => {
  const date = moment();
  const bellListData = [];
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [ selectedUser, setSelectedUser ] = React.useState(null);
  const openHistory = React.useCallback((u) => {
    setSelectedUser(u);
    setHistoryOpen(true);
  }, [])
  const closeHistory = React.useCallback(() => {
    setHistoryOpen(false)
  }, []);

  users.forEach(u => {
    let bells = u.bells || [];
    bells = bells.filter(bell => date.isBefore(moment(bell.expiresAt)));
    if (bells.length > 0) {
      bells = bells.sort((a, b) => b.addedAt - a.addedAt);
      bellListData.push({
        bell: bells[0],
        user: u
      })
    }
  });
  if (bellListData.length === 0) {
    return (
      <PaddedPaper>
        <Typography variant={"h5"}>No users have entered their turnip prices</Typography>
      </PaddedPaper>
    )
  }
  bellListData.sort((a,b) => b.bell.price - a.bell.price)
  return (
    <PaddedPaper>
      <Typography variant={"h4"}>Current Turnip Prices</Typography>
      <List>
        {
          bellListData.map(({user: u, bell: latestBell}) => {
            return (
              <ListItem key={u._id} button onClick={() => openHistory(u)}>
                <ListItemText primary={u.discordUsername} secondary={
                  <>Expires in {moment.duration(date.diff(latestBell.expiresAt)).humanize()}</>
                }/>
                <ListItemSecondaryAction>
                  <Typography component={"span"}>
                    <ListItemIcon>
                      <>
                        <NotificationsIcon/>
                        <strong>{latestBell.price}</strong>
                      </>
                    </ListItemIcon>
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
        }
      </List>
      <BellHistory open={historyOpen} onClose={closeHistory} bells={selectedUser?.bells} />
    </PaddedPaper>
  )
}

export default BellList;
