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
<path d="M13 12L13.7071 11.2929L14.4142 12L13.7071 12.7071L13 12ZM7.70711 5.29289L13.7071 11.2929L12.2929 12.7071L6.29289 6.70711L7.70711 5.29289ZM13.7071 12.7071L7.70711 18.7071L6.29289 17.2929L12.2929 11.2929L13.7071 12.7071Z" fill={color}/>
<path d="M18 7V17" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);
