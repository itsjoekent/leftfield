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
<path fillRule="evenodd" clipRule="evenodd" d="M7.08642 13.0691L5.384 11.7071C5.13517 12.4253 5 13.1967 5 13.9995C5 17.8655 8.13401 20.9995 12 20.9995C15.866 20.9995 19 17.8655 19 13.9995C19 13.1967 18.8648 12.4254 18.616 11.7071L16.9136 13.0691C16.9703 13.3705 17 13.6816 17 13.9995C17 16.761 14.7614 18.9995 12 18.9995C9.23858 18.9995 7 16.761 7 13.9995C7 13.6816 7.02968 13.3705 7.08642 13.0691Z" fill={color}/>
<path d="M12 4L11.3753 3.21913L12 2.71937L12.6247 3.21913L12 4ZM13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13L13 13ZM6.37531 7.21913L11.3753 3.21913L12.6247 4.78087L7.6247 8.78087L6.37531 7.21913ZM12.6247 3.21913L17.6247 7.21913L16.3753 8.78087L11.3753 4.78087L12.6247 3.21913ZM13 4L13 13L11 13L11 4L13 4Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);