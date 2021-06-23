/**
 * @WARNING
 * This code is autogenerated by ${root}/icon-helper/transform.js
 */

import React from 'react';
import { withTheme } from 'styled-components';

function Icon(props) {
  const {
    width = 24,
    height = 24,
    color = props.theme.colors.mono[100],
  } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.9809 9.25283C18.2198 7.32031 16.6794 5.77999 14.7469 5.01897C14.5229 5.27358 14.3413 5.56647 14.2133 5.88656C16.0226 6.54172 17.4581 7.97718 18.1133 9.7864C18.4334 9.6584 18.7263 9.47685 18.9809 9.25283ZM12.2276 5.50391C12.1521 5.50131 12.0762 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 11.9237 18.4987 11.8478 18.4961 11.7721C18.8387 11.6648 19.1655 11.5216 19.472 11.347C19.4905 11.5622 19.5 11.78 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C12.2199 4.5 12.4376 4.50946 12.6527 4.52801C12.4781 4.83451 12.3349 5.16128 12.2276 5.50391Z" fill={color}/>
<circle cx="17" cy="7" r="3" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);