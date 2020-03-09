import React from 'react';
import PaddedPaper from "../PaddedPaper";
import * as yup from 'yup';
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import { autorun } from 'meteor/cereal:reactive-render';
import MenuItem from "@material-ui/core/MenuItem";
import {addWeightSchema} from "../../../../imports/api/users";
import {withSnackbar} from "notistack";

const initialValues = {
    weight: "",
    measurement: "lbs"
};

const styles = theme => ({
    container: {
        display: 'flex'
    },
    button: {
      margin: theme.spacing(1),
      alignSelf: "flex-end"
    },
    input: {
        margin: theme.spacing(1)
    }
});

@withStyles(styles)
@withSnackbar
@autorun
export default class EnterWeight extends React.Component {
    handleSubmit = (values, { setSubmitting }) => {
        const { enqueueSnackbar } = this.props;
        setSubmitting(true);
        Meteor.call('user.addWeight', values.weight, values.measurement, err => {
           if(err) {
               enqueueSnackbar("Something went wrong D:", {variant: "error"});
           } else {
               enqueueSnackbar("Weight added!", {variant: "success"});
           }
           setSubmitting(false);
        });
    };

    render() {
        const { classes } = this.props;
        return(
            <PaddedPaper>
                <Formik initialValues={initialValues} validationSchema={addWeightSchema} onSubmit={this.handleSubmit}>
                    <Form className={classes.container}>
                        <Field
                            label={"Enter your current weight"}
                            name={"weight"}
                            component={TextField}
                            className={classes.input}
                        />
                        <Field
                            label={"Measurement"}
                            name={"measurement"}
                            component={TextField}
                            select
                            className={classes.input}
                        >
                            <MenuItem value={"kg"}>Kilograms</MenuItem>
                            <MenuItem value={"lbs"}>Pounds</MenuItem>
                        </Field>
                        <Button className={classes.button} type={"submit"} color="primary" variant={"contained"}>Submit</Button>
                    </Form>
                </Formik>
            </PaddedPaper>
        )
    }
}