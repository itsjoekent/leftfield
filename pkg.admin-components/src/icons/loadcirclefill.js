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
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.08642 13.0691L5.384 11.7071C5.13517 12.4253 5 13.1967 5 13.9995C5 17.8655 8.13401 20.9995 12 20.9995C15.866 20.9995 19 17.8655 19 13.9995C19 13.1967 18.8648 12.4254 18.616 11.7071L16.9136 13.0691C16.9703 13.3705 17 13.6816 17 13.9995C17 16.761 14.7614 18.9995 12 18.9995C9.23858 18.9995 7 16.761 7 13.9995C7 13.6816 7.02968 13.3705 7.08642 13.0691Z" fill={color}/>
<path d="M12 13L11.3753 13.7809L12 14.2806L12.6247 13.7809L12 13ZM13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L13 4ZM6.37531 9.78087L11.3753 13.7809L12.6247 12.2191L7.6247 8.21913L6.37531 9.78087ZM12.6247 13.7809L17.6247 9.78087L16.3753 8.21913L11.3753 12.2191L12.6247 13.7809ZM13 13L13 4L11 4L11 13L13 13Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
