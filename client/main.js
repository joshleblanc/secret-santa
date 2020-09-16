import React from 'react';
import { render } from 'react-dom';
import '../imports/api/users';
import App from './ui/App';
import 'meteor/cereal:accounts-fitbit';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'))
});
