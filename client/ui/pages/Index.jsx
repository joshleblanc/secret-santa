import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from "../components/Container";

export default class extends React.Component {
    render() {
        return(
          <>
            <Container>
              <Typography variant={"h4"}>Hello!</Typography>
              <Typography>
                Login to get started
              </Typography>
            </Container>
            <Container>
              <Typography variant="h4">Approaching Deadlines</Typography>
              <br />
              <Typography variant="h5">Sign Ups Ending</Typography>
              <Typography variant="h5">Shipping Deadlines Ending</Typography>
            </Container>
          </>
        )
    }
}
