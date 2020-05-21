import React from 'react';
import Chart from 'react-apexcharts';
import {useTheme} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from 'prop-types';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const BellHistory = ({ bells, onClose, open }) => {
  if(!bells) return null;

  const theme = useTheme();
  const beforeNoon = bells.filter(b => b.beforeNoon).map(b => ({ x: b.addedAt, y: b.price }));
  const afterNoon = bells.filter(b => !b.beforeNoon).map(b => ({ x: b.addedAt, y: b.price }));
  const series = [{
    name: "Before noon",
    data: beforeNoon
  }, {
    name: "After noon",
    data: afterNoon
  }];

  const options = {
    yaxis: {
      labels: {
        formatter: value => {
          if(value) {
            return `${value} bells`;
          }
        }
      }
    },
    xaxis: {
      type: 'datetime'
    },
    theme: {
      mode: theme.palette.type
    }
  }
  return(
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth>
      <DialogTitle>
        Turnip Price History
      </DialogTitle>
      <DialogContent>
        <Chart series={series} type={"line"} options={options} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default BellHistory;

BellHistory.propTypes = {
  bells: PropTypes.arrayOf(PropTypes.shape({
    price: PropTypes.num,
    expiresAt: PropTypes.instanceOf(Date),
    beforeNoon: PropTypes.bool
  })),
  open: PropTypes.bool,
  onOpen: PropTypes.func
}
