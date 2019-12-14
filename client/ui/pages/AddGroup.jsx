import React from 'react';
import PaddedPaper from "../components/PaddedPaper";
import Typography from "@material-ui/core/Typography";
import {Select, TextField} from "formik-material-ui";
import {Field, Form, Formik} from "formik";
import Button from "@material-ui/core/Button";
import {DatePicker} from "@material-ui/pickers";
import {insertSchema} from '/imports/api/groups';
import moment from "moment";
import {withSnackbar} from 'notistack';
import {Meteor} from "meteor/meteor";
import {autorun} from 'meteor/cereal:reactive-render';
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";

@withSnackbar
@autorun
export default class extends React.Component {
  render() {
    const {enqueueSnackbar} = this.props;
    const user = Meteor.user();
    if (!user) {
      return null;
    }
    return (
      <Container>
        <PaddedPaper>
          <Typography variant={"h4"}>Create Secret Santa</Typography>
          <Formik
            initialValues={{
              name: "",
              startDate: moment().toISOString(),
              endDate: moment().toISOString(),
              server: user.guilds[0].id
            }}
            validationSchema={insertSchema}
            onSubmit={(values, {setSubmitting}) => {
              Meteor.call('groups.create', values, (err, res) => {
                if (err) {
                  console.error(err);
                  enqueueSnackbar("Something went wrong, please try again", {variant: "error"})
                  setSubmitting(false);
                } else {
                  enqueueSnackbar("Secret Santa created!", {variant: "success"});
                  this.props.history.push(`/groups/${res.toHexString()}`);
                }
              });
            }}
          >
            {({errors, touched, values}) => (
              <Form>
                <Field
                  name="name"
                  component={TextField}
                  fullWidth
                  margin="normal"
                  label="Name"
                  helperText={errors.name && touched.name ? errors.name : null}
                />
                <FormControl fullWidth>
                  <InputLabel shrink={true} htmlFor="server">
                    Server
                  </InputLabel>
                  <Field
                    name="server"
                    component={Select}
                    inputProps={{name: 'server', id: 'server'}}
                  >
                    {
                      user.guilds.map(g => {
                        return (
                          <MenuItem value={g.id} key={g.id}>{g.name}</MenuItem>
                        )
                      })
                    }
                  </Field>
                </FormControl>

                <Field
                  name="startDate"
                  component={({field, form, ...props}) => {
                    return <DatePicker
                      fullWidth
                      label="Signups Close"
                      margin="normal"
                      helperText={errors.startDate && touched.startDate ? errors.startDate : null}
                      value={moment(field.value)}
                      onChange={v => form.setFieldValue('startDate', v.toISOString())}
                    />
                  }}
                />
                <Field
                  name="endDate"
                  component={({field, form, ...props}) => {
                    return <DatePicker
                      fullWidth
                      label="Shipping Deadline"
                      margin="normal"
                      helperText={errors.endDate && touched.endDate ? errors.endDate : null}
                      value={moment(field.value)}
                      onChange={v => form.setFieldValue('endDate', v.toISOString())}
                    />
                  }}
                />
                <Typography variant="caption" paragraph>
                  After sign ups close, pairs of people will be matched together to exchange gifts.
                </Typography>
                <Button type="submit">Submit</Button>
              </Form>
            )}
          </Formik>
        </PaddedPaper>
      </Container>
    )
  }
}
