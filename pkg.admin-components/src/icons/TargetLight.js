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
<circle cx="12" cy="12" r="7" stroke={color}/>
<circle cx="12" cy="12" r="2" fill={color} stroke={color}/>
<path d="M7.05026 7.05026L4.00006 4.00031M16.9498 7.05026L20.0001 4.00031M20.0001 20.0003L16.9498 16.9498M4.00006 20.0003L7.05026 16.9498" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
