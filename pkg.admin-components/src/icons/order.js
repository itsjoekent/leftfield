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
<rect x="5" y="4" width="14" height="17" rx="2" stroke={color} strokeWidth="2"/>
<path d="M9 9H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M9 13H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M9 17H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
