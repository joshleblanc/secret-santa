import React from 'react';
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import PaddedPaper from "../components/PaddedPaper";
import {withSnackbar} from "notistack";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const initialValues = {
    name: ""
};

@withSnackbar
export default class AddWeightGroup extends React.Component {
    handleSubmit = (values, {setSubmitting}) => {
        const {enqueueSnackbar} = this.props;
        setSubmitting(true);
        Meteor.call('weight_groups.create', values.name, (err, res) => {
            if (err) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
            } else {
                enqueueSnackbar("Weight group created", { variant: "success" });
                this.props.history.push(`/weight_groups/${res.toHexString()}`);
            }
            setSubmitting(false);
        })
    };

    render() {
        return (
            <PaddedPaper>
                <Typography variant={"h4"}>Create Weight Loss Group</Typography>
                <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
                    <Form>
                        <Field
                            name={"name"}
                            fullWidth
                            label={"Name"}
                            margin={"normal"}
                            component={TextField}
                        />
                        <Button type={"submit"} variant={"contained"} color={"primary"}>Submit</Button>
                    </Form>
                </Formik>
            </PaddedPaper>
        )


    }
}