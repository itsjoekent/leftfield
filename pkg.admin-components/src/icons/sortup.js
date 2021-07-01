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
<path d="M5 17H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M5 12H11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M5 7H9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M19 6L22 9M19 6L16 9M19 6L19 18" stroke={color} strokeWidth="2"/>
</svg>
  );
}

export default withTheme(Icon);
