import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";
import { autorun } from 'meteor/cereal:reactive-render';
import List from "@material-ui/core/List";
import withStyles from '@material-ui/core/styles/withStyles';
import { routes } from '../../lib/constants';
import AuthenticatedDrawerItems from "./AuthenticatedDrawerItems";
import ThemeIcon from "@material-ui/icons/WbSunny";
import {AppStoreContext} from "../../stores/AppStore";

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  static contextType = AppStoreContext;

  render() {
    const { classes } = this.props;
    const { toggleTheme } = this.context;

    return(
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {
            routes.map(r => (
              <ListItem key={r.name} button component={Link} to={r.href}>
                <ListItemIcon>
                  {<r.Icon/>}
                </ListItemIcon>
                <ListItemText primary={r.name}/>
              </ListItem>
            ))
          }
          <ListItem button onClick={toggleTheme}>
            <ListItemIcon>
              <ThemeIcon />
            </ListItemIcon>
            <ListItemText primary="Toggle Theme" />
          </ListItem>
        </List>
        <AuthenticatedDrawerItems />
      </div>
    )
  }
}