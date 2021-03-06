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
<circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
<path d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
