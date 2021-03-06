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
<path d="M10 8L20 8" stroke={color} strokeLinecap="round"/>
<path d="M4 16L14 16" stroke={color} strokeLinecap="round"/>
<ellipse cx="7" cy="8" rx="3" ry="3" transform="rotate(90 7 8)" stroke={color} strokeLinecap="round"/>
<ellipse cx="17" cy="16" rx="3" ry="3" transform="rotate(90 17 16)" stroke={color} strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
