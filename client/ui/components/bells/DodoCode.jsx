import React from 'react';
import PropTypes from 'prop-types';

const DodoCode = ({code}) => {
  if(!code || code.length === 0) {
    return <strong>No dodo code</strong>
  } else {
    return <strong>{code}</strong>
  }
}

export default DodoCode;

DodoCode.propTypes = {
  code: PropTypes.string
}
