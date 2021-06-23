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
<path d="M8 3V4C8 5.88562 8 6.82843 7.41421 7.41421C6.82843 8 5.88562 8 4 8H3" stroke={color} stroke-width="2" stroke-linejoin="round"/>
<path d="M16 3V4C16 5.88562 16 6.82843 16.5858 7.41421C17.1716 8 18.1144 8 20 8H21" stroke={color} stroke-width="2" stroke-linejoin="round"/>
<path d="M8 21V20C8 18.1144 8 17.1716 7.41421 16.5858C6.82843 16 5.88562 16 4 16H3" stroke={color} stroke-width="2" stroke-linejoin="round"/>
<path d="M16 21V20C16 18.1144 16 17.1716 16.5858 16.5858C17.1716 16 18.1144 16 20 16H21" stroke={color} stroke-width="2" stroke-linejoin="round"/>
</svg>
  );
}

export default withTheme(Icon);