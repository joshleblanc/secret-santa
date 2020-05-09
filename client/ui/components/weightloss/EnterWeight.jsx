import React from 'react';
import PaddedPaper from "../PaddedPaper";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import {autorun} from 'meteor/cereal:reactive-render';
import MenuItem from "@material-ui/core/MenuItem";
import {addWeightSchema} from "../../../../imports/api/users";
import {withSnackbar} from "notistack";
import EntriesDialog from "./EntriesDialog";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {BaseAccessButton} from "../groups/BaseAccessButton";

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
    }
});

@withStyles(styles)
@withSnackbar
@autorun
export default class EnterWeight extends React.Component {
    state = {
        entriesDialogOpen: false
    };

    handleSubmit = (values, {setSubmitting}) => {
        const {enqueueSnackbar} = this.props;
        setSubmitting(true);
        Meteor.call('user.addWeight', parseFloat(values.weight), values.measurement, err => {
            if (err) {
                enqueueSnackbar("Something went wrong D:", {variant: "error"});
            } else {
                enqueueSnackbar("WeightGroup added!", {variant: "success"});
            }
            setSubmitting(false);
        });
    };

    openEntriesDialog = () => {
        this.setState({entriesDialogOpen: true});
    };

    closeEntriesDialog = () => {
        this.setState({entriesDialogOpen: false});
    };

    render() {
        const { group } = this.props;
        return (
            <PaddedPaper>
                <Typography variant={"h4"}>Check-in</Typography>
                <EntriesDialog open={this.state.entriesDialogOpen} onClose={this.closeEntriesDialog}/>
                <Formik initialValues={initialValues} validationSchema={addWeightSchema} onSubmit={this.handleSubmit}>
                    {({ isValid }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Field
                                        label={"Current weight"}
                                        name={"weight"}
                                        component={TextField}
                                        margin={"normal"}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Field
                                        label={"Measurement"}
                                        name={"measurement"}
                                        component={TextField}
                                        margin={"normal"}
                                        fullWidth
                                        select
                                    >
                                        <MenuItem value={"kg"}>Kilograms</MenuItem>
                                        <MenuItem value={"lbs"}>Pounds</MenuItem>
                                        <MenuItem value={'stone'}>Stones</MenuItem>
                                    </Field>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth type={"submit"} color="primary" disabled={!isValid}
                                            variant={"contained"}>Submit</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button color="secondary" variant={"contained"} fullWidth
                                            onClick={this.openEntriesDialog}>Manage Entries</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <BaseAccessButton
                                        group={group}
                                        collectionName={"weight_groups"}
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
