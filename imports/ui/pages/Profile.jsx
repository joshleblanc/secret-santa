import React from 'react';
import { Meteor } from 'meteor/meteor';
import { autorun } from 'meteor/cereal:reactive-render';
import PaddedPaper from '../components/PaddedPaper';
import Typography from '@material-ui/core/Typography';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import { shippingSchema } from "../../api/users";
import LinearProgress from "@material-ui/core/LinearProgress";

@withSnackbar
@autorun
export default class extends React.Component {
    render() {
        const { enqueueSnackbar } = this.props;
        const subscription = Meteor.subscribe('currentUser', Meteor.userId());
        const user = Meteor.user();
        if(!subscription.ready()) {
            return <LinearProgress />
        }
        console.log(user);
        if(!user) {
            return null;
        }
        return(
            <Grid container justify="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <PaddedPaper>
                        <Typography variant="h4">
                            {user.username}
                        </Typography>
                        <Typography variant="h6">
                            Shipping Address
                        </Typography>
                        <Typography variant="caption">
                            Don't forget to include your name and country!
                        </Typography>
                        <Formik
                            initialValues={{
                                address: (user.shipping && user.shipping.address) || ""
                            }}
                            validationSchema={shippingSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                Meteor.call('users.updateShippingAddress', values.address, (err, res) => {
                                    if(err) {
                                        console.error(err);
                                        enqueueSnackbar("Something went wrong D:", { variant: "error" });
                                    } else {
                                        enqueueSnackbar("Profile updated!", { variant: "success" });
                                    }
                                    setSubmitting(false);
                                });
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <Field
                                      name="address"
                                      type="address"
                                      component={TextField}
                                      fullWidth
                                      multiline
                                      rows="6"
                                      margin="normal"
                                      label="Address"
                                      helperText={errors.address && touched.address ? errors.address : null}
                                    />
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
