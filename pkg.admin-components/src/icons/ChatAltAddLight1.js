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
<path d="M20 12C20 8.22876 20 6.34315 18.8284 5.17157C17.6569 4 15.7712 4 12 4V4C8.22876 4 6.34315 4 5.17157 5.17157C4 6.34315 4 8.22876 4 12V18C4 18.9428 4 19.4142 4.29289 19.7071C4.58579 20 5.05719 20 6 20H12C15.7712 20 17.6569 20 18.8284 18.8284C20 17.6569 20 15.7712 20 12V12Z" stroke={color}/>
<path d="M9 12L15 12" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 9L12 15" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );
}

export default withTheme(Icon);
