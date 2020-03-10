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
import {Modal} from "@material-ui/core";
import EntriesDialog from "./EntriesDialog";

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
    state = {
        entriesDialogOpen: false
    };

    handleSubmit = (values, { setSubmitting }) => {
        const { enqueueSnackbar, groupId } = this.props;
        setSubmitting(true);
        Meteor.call('user.addWeight', groupId, values.weight, values.measurement, err => {
           if(err) {
               enqueueSnackbar("Something went wrong D:", {variant: "error"});
           } else {
               enqueueSnackbar("WeightGroup added!", {variant: "success"});
           }
           setSubmitting(false);
        });
    };

    openEntriesDialog = () => {
        this.setState({ entriesDialogOpen: true });
    };

    closeEntriesDialog = () => {
        this.setState({ entriesDialogOpen: false });
    };

    render() {
        const { classes } = this.props;
        return(
            <PaddedPaper>
                <EntriesDialog open={this.state.entriesDialogOpen} onClose={this.closeEntriesDialog}/>
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
                        <Button className={classes.button} color="secondary" variant={"contained"} onClick={this.openEntriesDialog}>Manage Entries</Button>
                    </Form>
                </Formik>
            </PaddedPaper>
        )
    }
}