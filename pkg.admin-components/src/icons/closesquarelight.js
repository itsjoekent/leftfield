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
<path d="M18 6L6 18" stroke={color} stroke-linecap="square" stroke-linejoin="round"/>
<path d="M6 6L18 18" stroke={color} stroke-linecap="square" stroke-linejoin="round"/>
</svg>
  );
}

export default withTheme(Icon);
