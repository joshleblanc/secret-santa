import React from 'react';
import moment from "moment";

const ExpiresIn = ({ item }) => {
  if(item.noData) {
    return <>No turnip price submitted</>;
  }
  const date = moment();
  return <>Expires in {moment.duration(date.diff(item.expiresAt)).humanize()}</>
}

export default ExpiresIn;
