import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import {drawerWidth} from '../../lib/constants';
import withStyles from '@material-ui/core/styles/withStyles';
import {autorun} from 'meteor/cereal:reactive-render';
import DrawerItems from "./DrawerItems";
import {AppStoreContext} from "../../stores/AppStore";
import {SwipeableDrawer} from "@material-ui/core";

const styles = theme => ({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

@withStyles(styles, {withTheme: true})
@autorun
export default class extends React.Component {
  static contextType = AppStoreContext;

  render() {
    const {container, classes, theme} = this.props;
    const { drawerOpen, closeDrawer, openDrawer  } = this.context;
    return (
      <nav>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={drawerOpen}
            onOpen={openDrawer}
            onClose={closeDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerItems />
          </SwipeableDrawer>
        </Hidden>
      </nav>
    )
  }
}