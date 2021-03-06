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
<rect x="3" y="6" width="18" height="13" rx="2" stroke={color}/>
<path d="M7 15H7.01" stroke={color} strokeLinecap="round"/>
<path d="M4 11H21" stroke={color} strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
