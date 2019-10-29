import React from 'react';
import PaddedPaper from '../components/PaddedPaper';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {TextField} from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withSnackbar} from 'notistack';
import {Meteor} from 'meteor/meteor';
import {Link} from 'react-router-dom';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required()
});

@withSnackbar
export default class extends React.Component {
    render() {
        const {enqueueSnackbar} = this.props;
        return (
            <Grid container justify="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <PaddedPaper>
                        <Typography variant="h4">Login</Typography>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, {setSubmitting}) => {
                                Meteor.loginWithPassword(values.email, values.password, err => {
                                    if (err) {
                                        console.log(err);
                                        enqueueSnackbar(err.message, {variant: 'error'})
                                    } else {
                                        enqueueSnackbar("You're logged in!", {variant: 'success'})
                                    }
                                    setSubmitting(false);
                                })
                            }}
                        >
                            {({errors, touched}) => (
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
                                    <Field
                                        margin="normal"
                                        name="password"
                                        type="password"
                                        component={TextField}
                                        label="Password"
                                        fullWidth
                                        helperText={errors.password && touched.password ? errors.password : null}
                                    />
                                    <Button type="submit">Submit</Button>
                                </Form>
                            )}
                        </Formik>
                        <Typography>
                            Don't have an account? <Link to="/register">Register now!</Link>
                        </Typography>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}
