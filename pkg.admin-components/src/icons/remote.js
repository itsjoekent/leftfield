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
<path d="M11 9L11.7809 8.37531L12.2806 9L11.7809 9.62469L11 9ZM7.78087 3.3753L11.7809 8.37531L10.2191 9.62469L6.21913 4.6247L7.78087 3.3753ZM11.7809 9.62469L7.78087 14.6247L6.21913 13.3753L10.2191 8.37531L11.7809 9.62469Z" fill={color}/>
<path d="M13 15L12.2191 14.3753L11.7194 15L12.2191 15.6247L13 15ZM16.2191 9.3753L12.2191 14.3753L13.7809 15.6247L17.7809 10.6247L16.2191 9.3753ZM12.2191 15.6247L16.2191 20.6247L17.7809 19.3753L13.7809 14.3753L12.2191 15.6247Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
