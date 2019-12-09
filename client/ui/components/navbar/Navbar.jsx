import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { State } from '../../lib/state';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { autorun } from 'meteor/cereal:reactive-render';
import AccountButtons from './AccountButtons';
import NavbarButton from "./NavbarButton";
import AuthenticatedNavbarItems from "./AuthenticatedNavbarItems";
import Hidden from "@material-ui/core/Hidden";
import { routes } from '../../lib/constants';
import ThemeToggle from "./ThemeToggle";

const styles = theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    grow: {
        flexGrow: 1
    }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
    render() {
        const { classes } = this.props;
        return(
            <AppBar position={"fixed"}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => State.set('drawerOpen', !State.get('drawerOpen'))}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Secret Santa
                    </Typography>
                    <Hidden xsDown implementation="css">
                        {
                            routes.map(r => (
                              <NavbarButton key={r.name} to={r.href}>{r.name}</NavbarButton>
                            ))
                        }
                        <AuthenticatedNavbarItems />
                    </Hidden>
                    <div className={classes.grow} />
                    <AccountButtons />
                    <ThemeToggle themeToggleHandler={this.props.themeToggleHandler} />
                </Toolbar>
            </AppBar>
        )
    }
};
