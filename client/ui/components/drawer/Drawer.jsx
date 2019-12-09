import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import {drawerWidth} from '../../lib/constants';
import {State} from '../../lib/state';
import {withStyles} from '@material-ui/styles';
import {autorun} from 'meteor/cereal:reactive-render';
import DrawerItems from "./DrawerItems";

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
  render() {
    const {container, classes, theme} = this.props;
    return (
      <nav>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={State.get('drawerOpen')}
            onClose={() => State.set('drawerOpen', false)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerItems/>
          </Drawer>
        </Hidden>
      </nav>
    )
  }
}