import React from 'react';
import Grid from "@material-ui/core/Grid";
import PaddedPaper from "../components/PaddedPaper";
import Typography from "@material-ui/core/Typography";
import {TextField} from "formik-material-ui";
import {Field, Form, Formik} from "formik";
import Button from "@material-ui/core/Button";
import {DatePicker} from "@material-ui/pickers";

export default class extends React.Component {
    render() {
        return(
            <Grid container spacing={2} justify={"center"}>
                <Grid item xs={12} md={6}>
                    <PaddedPaper>
                        <Typography variant={"h4"}>Create Secret Santa</Typography>
                        <Formik
                            initialValues={{
                                name: "",
                                startDate: new Date(),
                                endDate: new Date()
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                            }}
                        >
                            {({ errors, touched }) => (
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
                                        component={({field, form, ...props}) => {
                                            return <DatePicker
                                                name="startDate"
                                                fullWidth
                                                label="Start Date"
                                                margin="normal"
                                                helperText={errors.startDate && touched.startDate ? errors.startDate : null}
                                                value={field.value}
                                                onChange={v => form.setFieldValue('startDate', v)}
                                            />
                                        }}
                                    />
                                    <Field
                                        component={({field, form, ...props}) => {
                                            return <DatePicker
                                                onChange={v => form.setFieldValue('endDate', v)}
                                                name="endDate"
                                                fullWidth
                                                value={field.value}
                                                margin="normal"
                                                label="End Date"
                                                helperText={errors.endDate && touched.endDate ? errors.endDate : null}
                                            />
                                        }}
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
