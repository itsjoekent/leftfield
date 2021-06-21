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
<circle cx="12" cy="12" r="2.5" stroke={color}/>
<path d="M12 9V6M12 3V6M12 6L9 4M12 6L15 4" stroke={color} stroke-linecap="round"/>
<path d="M15 12L18 12M21 12L18 12M18 12L20 9M18 12L20 15" stroke={color} stroke-linecap="round"/>
<path d="M12 15V18M12 21V18M12 18L9 20M12 18L15 20" stroke={color} stroke-linecap="round"/>
<path d="M9 12L6 12M3 12L6 12M6 12L4 9M6 12L4 15" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);