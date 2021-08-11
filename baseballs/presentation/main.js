import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { hydrate } from 'react-dom';
import get from 'lodash/get';
import render from './render';

%%COMPONENT_IMPORTS%%

import 'pkg.campaign-components/css/reset.css';

try {
  const page = get(window, 'page');
  if (!page) {
    throw new Error('No page data set');
  }

  hydrate(render(page), document.getElementById('root'));
} catch (error) {
  console.error(error);
  // TODO: Render error, report error
}
