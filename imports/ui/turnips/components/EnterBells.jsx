import React from 'react';
import PropTypes from 'prop-types';
import PaddedPaper from 'meteor/cereal:ui/components/PaddedPaper';
import Typography from "@material-ui/core/Typography";
import {Field, Form, Formik} from "formik";
import {addBellsSchema, addWeightSchema} from "../../../api/users";
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import {BaseAccessButton} from "../../components/groups/BaseAccessButton";
import BellEntriesDialog from "./BellEntriesDialog";
import {useSnackbar} from "notistack";
import moment from "moment";
import { useUser } from 'meteor/cereal:ui/hooks/useUser.ts';



export const EnterBells = ({ group }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [ dialogOpen, setDialogOpen ] = React.useState(false);
  const handleDialogClose = React.useCallback(() => {
    setDialogOpen(false);
  }, []);
  const handleDialogOpen = React.useCallback(() => {
    setDialogOpen(true);
  }, []);
  const handleSubmit = React.useCallback((values, { setSubmitting }) => {
    setSubmitting(true);
    const date = moment();
    const noon = moment({ hour: 12, minute: 0 });
    const closingTime = moment({ hour: 22, minute: 0 });
    let expiresIn;
    let beforeNoon;
    if(date.isBefore(noon)) {
      beforeNoon = true;
      expiresIn = noon.diff(date);
    } else {
      beforeNoon = false;
      expiresIn = closingTime.diff(date);
    }
    let price = values.price;
    let turnipBuyPrice = values.turnipBuyPrice;
    if(!values.price || values.price.length === 0) {
      price = null;
    }
    if(!values.turnipBuyPrice || values.turnipBuyPrice.length === 0) {
      turnipBuyPrice = null;
    }
    Meteor.call('user.addBell', price, beforeNoon, expiresIn, turnipBuyPrice, err => {
      if(err) {
        enqueueSnackbar("Something went wrong", {variant: "error"});
      } else {
        enqueueSnackbar("Turnip price added!", {variant: "success"});
      }
      setSubmitting(false);
    })
  }, []);

  const user = useUser();
  const initialValues = {
    price: "",
    turnipBuyPrice: user.turnipBuyPrice
  }

  return(
    <PaddedPaper>
      <Typography variant={"h4"}>Enter Your Current Turnip Price</Typography>
      <BellEntriesDialog open={dialogOpen} onClose={handleDialogClose} />
      <Formik initialValues={initialValues} validationSchema={addBellsSchema} onSubmit={handleSubmit}>
        {({ isValid }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Field
                  label={"Current Turnip Sell Price"}
                  name={"price"}
                  component={TextField}
                  margin={"normal"}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Field
                  label={"Current Turnip Buy Price"}
                  name={"turnipBuyPrice"}
                  component={TextField}
                  margin={"normal"}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={3}>
                <Button fullWidth type={"submit"} color="primary" disabled={!isValid}
                        variant={"contained"}>Submit</Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button color="secondary" variant={"contained"} fullWidth
                        onClick={handleDialogOpen}>Manage Entries</Button>
              </Grid>
              {
                group &&
                <Grid item xs={12} sm={3}>
                  <BaseAccessButton
                    group={group}
                    collectionName={"bell_groups"}
                  />
                </Grid>
              }
            </Grid>
          </Form>
        )}
      </Formik>
    </PaddedPaper>
  )
}

EnterBells.propTypes = {
  group: PropTypes.shape({

  })
}
