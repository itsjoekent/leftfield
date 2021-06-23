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
<rect x="5" y="5" width="14" height="14" rx="3" stroke={color} stroke-width="2"/>
<path d="M6 10H18" stroke={color} stroke-width="2" stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);