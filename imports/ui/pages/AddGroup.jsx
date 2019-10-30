import React from 'react';
import Grid from "@material-ui/core/Grid";
import PaddedPaper from "../components/PaddedPaper";
import Typography from "@material-ui/core/Typography";
import {TextField} from "formik-material-ui";
import {Field, Form, Formik} from "formik";
import Button from "@material-ui/core/Button";
import {DatePicker} from "@material-ui/pickers";
import { schema as GroupSchema, Groups } from '/imports/api/groups';
import moment from "moment";
import { withSnackbar } from 'notistack';
import {LinearProgress} from "@material-ui/core";
import {Meteor} from "meteor/meteor";
import { autorun } from 'meteor/cereal:reactive-render';

@withSnackbar
@autorun
export default class extends React.Component {
    render() {
        const { enqueueSnackbar } = this.props;
        const subscription = Meteor.subscribe('currentUser', Meteor.userId());
        const loading = !subscription.ready();
        console.log(loading);
        if(!Meteor.user()) {
          return null;
        }
        if(loading) {
            return <LinearProgress />
        }
        return(
            <Grid container spacing={2} justify={"center"}>
                <Grid item xs={12} md={6}>
                    <PaddedPaper>
                        <Typography variant={"h4"}>Create Secret Santa</Typography>
                        <Formik
                            initialValues={{
                                name: "",
                                startDate: moment().toISOString(),
                                endDate: moment().toISOString(),
                                participants: [
                                  Meteor.user().services.discord.id
                                ]
                            }}
                            validationSchema={GroupSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                Groups.insert(values, (err, res) => {
                                    if(err) {
                                        console.error(err);
                                        enqueueSnackbar("Something went wrong, please try again", { variant: "error" })
                                        setSubmitting(false);
                                    } else {
                                        enqueueSnackbar("Secret Santa created!", { variant: "success" });
                                        this.props.history.push(`/groups/${res.toHexString()}`);
                                    }
                                });

                            }}
                        >
                            {({ errors, touched, values }) => (
                                <Form>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        fullWidth
                                        margin="normal"
                                        label="Name"
                                        helperText={errors.name && touched.name ? errors.name : null}
                                    />
                                    <Field
                                        name="startDate"
                                        component={({field, form, ...props}) => {
                                            return <DatePicker
                                                fullWidth
                                                label="Signups Close"
                                                margin="normal"
                                                helperText={errors.startDate && touched.startDate ? errors.startDate : null}
                                                value={moment(field.value)}
                                                onChange={v => form.setFieldValue('startDate', v.toISOString())}
                                            />
                                        }}
                                    />
                                    <Field
                                        name="endDate"
                                        component={({field, form, ...props}) => {
                                            return <DatePicker
                                                fullWidth
                                                label="Shipping Deadline"
                                                margin="normal"
                                                helperText={errors.endDate && touched.endDate ? errors.endDate : null}
                                                value={moment(field.value)}
                                                onChange={v => form.setFieldValue('endDate', v.toISOString())}
                                            />
                                        }}
                                    />
                                    <Typography variant="caption" paragraph>
                                        After sign ups close, pairs of people will be matched together to exchange gifts.
                                    </Typography>
                                    <Button type="submit">Submit</Button>
                                </Form>
                            )}
                        </Formik>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}
