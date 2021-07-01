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
<path d="M8 10L8 16" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 12V16" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 8V16" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<rect x="3" y="4" width="18" height="16" rx="2" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);
