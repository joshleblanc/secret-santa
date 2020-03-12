import React from 'react';
import PaddedPaper from "../PaddedPaper";
import * as yup from 'yup';
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import {autorun} from 'meteor/cereal:reactive-render';
import MenuItem from "@material-ui/core/MenuItem";
import {addWeightSchema} from "../../../../imports/api/users";
import {withSnackbar} from "notistack";
import {LinearProgress, Modal} from "@material-ui/core";
import EntriesDialog from "./EntriesDialog";
import {WeightGroups} from "../../../../imports/api/weight_groups";
import Grid from "@material-ui/core/Grid";

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
        const {enqueueSnackbar, groupId} = this.props;
        setSubmitting(true);
        Meteor.call('user.addWeight', groupId, values.weight, values.measurement, err => {
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

    join = () => {
        Meteor.call("weight_groups.join", this.props.groupId);
    };

    leave = () => {
        Meteor.call("weight_groups.leave", this.props.groupId);
    };

    render() {
        const { groupId } = this.props;
        const ready = Meteor.subscribe('weight_group', groupId).ready();
        if (!ready) {
            return <LinearProgress/>
        }
        const group = WeightGroups.findOne(new Mongo.ObjectID(groupId));
        const isMember = group.userIds.includes(Meteor.userId());

        return (
            <PaddedPaper>
                <EntriesDialog open={this.state.entriesDialogOpen} onClose={this.closeEntriesDialog}/>
                <Formik initialValues={initialValues} validationSchema={addWeightSchema} onSubmit={this.handleSubmit}>
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
                                <Button fullWidth type={"submit"} color="primary"
                                        variant={"contained"}>Submit</Button>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Button color="secondary" variant={"contained"} fullWidth
                                        onClick={this.openEntriesDialog}>Manage Entries</Button>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                {
                                    isMember
                                        ? <Button fullWidth color="secondary" variant={"contained"}
                                                  onClick={this.leave}>Leave</Button>
                                        : <Button fullWidth color="secondary" variant={"contained"}
                                                  onClick={this.join}>Join</Button>
                                }
                            </Grid>
                        </Grid>
                    </Form>
                </Formik>
            </PaddedPaper>
        )
    }
}
