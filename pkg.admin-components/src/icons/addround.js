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
<path d="M12 6L12 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M18 12L6 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
