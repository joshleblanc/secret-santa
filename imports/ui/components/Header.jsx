import React from 'react';
import {withStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    header: {
        display: 'flex',
        marginBottom: theme.spacing(2)
    },
    buttonContainer: {
      textAlign: "end"
    }
});

@withStyles(styles)
export default class Header extends React.Component {
    render() {
        const { classes, title, to } = this.props;
        return(
          <Grid container>
            <Grid item xs={12} sm={10}>
              <Typography variant={"h4"}>{title}</Typography>
            </Grid>
            <Grid item xs={12} sm={2} className={classes.buttonContainer}>
              <Button
                size="small"
                component={Link}
                fullWidth
                variant="contained"
                to={to}
                color={"primary"}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        )
    }
}
