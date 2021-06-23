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
<circle cx="9" cy="14" r="4" stroke={color}/>
<path d="M12 11L15.5 7.5M17 6L15.5 7.5M15.5 7.5L18 10" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
