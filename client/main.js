import React from 'react';
import { render } from 'react-dom';
import '../imports/api/users';
import App from '../imports/ui/entry_points/ClientEntryPoint';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'))
});