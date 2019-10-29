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

@withSnackbar
@autorun
export default class extends React.Component {


    logout = () => {
        Meteor.logout();
    };

    render() {
        const { enqueueSnackbar } = this.props;
        if(!Meteor.user()) {
            return null;
        }
        console.log(Meteor.user());
        return(
            <Grid container justify="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <PaddedPaper>
                        <Typography variant="h4">
                            Profile
                        </Typography>
                        <Formik
                            initialValues={{
                                email: Meteor.user().emails[0].address,
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                try {
                                    Meteor.users.update({ _id: Meteor.userId() }, {
                                        $set: {
                                            "emails.0.address": values.email
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
                                        name="email"
                                        type="email"
                                        component={TextField}
                                        fullWidth
                                        margin="normal"
                                        label="Email"
                                        helperText={errors.email && touched.email ? errors.email : null}
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
