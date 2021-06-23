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
<rect x="18" y="9" width="4" height="4" rx="2" transform="rotate(90 18 9)" stroke={color} stroke-width="2"/>
<rect x="18" y="17" width="4" height="4" rx="2" transform="rotate(90 18 17)" stroke={color} stroke-width="2"/>
<rect x="3" y="7" width="4" height="4" rx="2" transform="rotate(-90 3 7)" stroke={color} stroke-width="2"/>
<path d="M5 8V15C5 16.8856 5 17.8284 5.58579 18.4142C6.17157 19 7.11438 19 9 19H14" stroke={color} stroke-width="2"/>
<path d="M5 7V7C5 8.88562 5 9.82843 5.58579 10.4142C6.17157 11 7.11438 11 9 11H14" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);