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
<path d="M9.5 10.0003C9.5 9.20875 8.44722 8.99895 8.16791 9.73957C7.49228 11.5311 7 13.1337 7 14.0002C7 16.7616 9.23858 19.0002 12 19.0002C14.7614 19.0002 17 16.7616 17 14.0002C17 13.0693 16.4318 11.2887 15.6784 9.33698C14.7026 6.80879 14.2146 5.54469 13.6123 5.4766C13.4196 5.45482 13.2093 5.49399 13.0374 5.58371C12.5 5.86413 12.5 7.24285 12.5 10.0003C12.5 10.8287 11.8284 11.5003 11 11.5003C10.1716 11.5003 9.5 10.8287 9.5 10.0003Z" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);