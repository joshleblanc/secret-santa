import React from 'react';
import { hydrate } from 'react-dom';
import { FastRender } from 'meteor/staringatlights:fast-render';
import App from '../imports/ui/entry_points/ClientEntryPoint';

FastRender.onPageLoad(async sink => {
  const App = (await import('../imports/ui/entry_points/ClientEntryPoint')).default;
  hydrate(<App />, document.getElementById('react-target'))
});
