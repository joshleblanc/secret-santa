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

@withSnackbar
@autorun
export default class extends React.Component {
    logout = () => {
        Meteor.logout();
    };

    render() {
        const { enqueueSnackbar } = this.props;
        Meteor.subscribe('currentUser', Meteor.userId());
        const user = Meteor.user();
        if(!user || !user.services || !user.services.discord) {
            return null;
        }
        console.log(user);
        return(
            <Grid container justify="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <PaddedPaper>
                        <Typography variant="h4">
                            {user.services.discord.username}
                        </Typography>
                        <Typography variant="h6">
                            Shipping Address
                        </Typography>
                        <Formik
                            initialValues={{
                                address: user.shipping && user.shipping.address || ""
                            }}
                            validationSchema={shippingSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                try {
                                    Meteor.users.update({ _id: Meteor.userId() }, {
                                        $set: {
                                            "shipping.address": values.address
                                        }
                                    })
                                } catch(e) {
                                    console.log(e);
                                }
                                setSubmitting(false);
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
                                    <Button onClick={this.logout}>Logout</Button>
                                </Form>
                            )}
                        </Formik>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}
