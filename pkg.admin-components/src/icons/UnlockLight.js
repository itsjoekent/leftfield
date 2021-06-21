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
<path d="M4 13.0002C4 11.1146 4 10.1718 4.58579 9.58598C5.17157 9.0002 6.11438 9.0002 8 9.0002H16C17.8856 9.0002 18.8284 9.0002 19.4142 9.58598C20 10.1718 20 11.1146 20 13.0002V15.0002C20 17.8286 20 19.2428 19.1213 20.1215C18.2426 21.0002 16.8284 21.0002 14 21.0002H10C7.17157 21.0002 5.75736 21.0002 4.87868 20.1215C4 19.2428 4 17.8286 4 15.0002V13.0002Z" stroke={color}/>
<path d="M16.4999 9.00001L16.5775 8.37942C16.8364 6.30783 15.9043 4.26745 14.1688 3.10705V3.10705C12.1023 1.72538 9.36726 1.89568 7.48819 3.523L6.66986 4.23169" stroke={color} stroke-linecap="round"/>
<circle cx="12" cy="15" r="2" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);