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
<path d="M9.20452 7.81433C8.60786 5.92488 10.0186 4 12 4V4C13.9814 4 15.3921 5.92489 14.7955 7.81433L13.3011 12.5464C13.2243 12.7898 13.1858 12.9115 13.1267 13.011C12.9879 13.2445 12.76 13.4115 12.4956 13.4736C12.3829 13.5 12.2553 13.5 12 13.5V13.5C11.7447 13.5 11.6171 13.5 11.5044 13.4736C11.24 13.4115 11.0121 13.2445 10.8733 13.011C10.8142 12.9115 10.7757 12.7898 10.6989 12.5464L9.20452 7.81433Z" fill={color} stroke={color} strokeWidth="2"/>
<circle cx="12" cy="19" r="2" fill={color} stroke={color} strokeWidth="2"/>
</svg>
  );
}

export default withTheme(Icon);
