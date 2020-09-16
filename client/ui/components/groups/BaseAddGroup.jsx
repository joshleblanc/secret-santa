import React from 'react';
import {useSnackbar} from "notistack";
import { useHistory } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import PaddedPaper from "../PaddedPaper";

const initialValues = {
  name: ""
};

export const BaseAddGroup = ({ method, createUrl, title, schema }) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const handleSubmit = React.useCallback((values, { setSubmitting }) => {
    setSubmitting(true);
    Meteor.call(method, values.name, (err, res) => {
      if(err) {
        enqueueSnackbar("Something went wrong", { variant: "error" })
      } else {
        enqueueSnackbar("Created!", { variant: "success" });
        history.push(createUrl(res));
      }
      setSubmitting(false);
    });
  }, []);

  return(
    <PaddedPaper>
      <Typography variant={"h4"}>{title}</Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={schema}>
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
