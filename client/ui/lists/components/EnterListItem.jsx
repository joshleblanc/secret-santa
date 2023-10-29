import React from 'react';
import PaddedPaper from '../../components/PaddedPaper';
import { Field, Form, Formik } from 'formik';
import { Grid, Typography, Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { BaseAccessButton } from '../../components/groups/BaseAccessButton';
import {withSnackbar} from "notistack";
import {autorun} from 'meteor/cereal:reactive-render';

const initialValues = {
    title: ""
}

@withSnackbar
@autorun
export class EnterListItem extends React.Component {
    handleSubmit = (values, { setSubmitting }) => {
        const { enqueueSnackbar, list } = this.props;
        setSubmitting(true);
        Meteor.call('list.addItem', list._id, values.title, err => {
            if (err) {
                enqueueSnackbar("Something went wrong D:", {variant: "error"});
            } else {
                enqueueSnackbar("Item added!", {variant: "success"});
            }
            setSubmitting(false);
        });
    };

    render() {
        const { list } = this.props;

        return(
            <PaddedPaper>
                <Typography variant="h4">New item</Typography>
                <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
                    {({ isValid }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Field 
                                        label={"Title"}
                                        name="title"
                                        component={TextField}
                                        margin="normal"
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
                                        <BaseAccessButton
                                            group={list}
                                            collectionName={"lists"}
                                        />
                                    </Grid>
                                </Grid>
                        </Form>
                    )}
                </Formik>
            </PaddedPaper>
        )
    } 
}