import React from 'react';
import { render } from 'react-dom';
import '../imports/api/users';
import App from './ui/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'))
});
