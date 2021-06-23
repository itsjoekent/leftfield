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
<path d="M15 12L15.7071 11.2929L16.4142 12L15.7071 12.7071L15 12ZM9.70711 5.29289L15.7071 11.2929L14.2929 12.7071L8.29289 6.70711L9.70711 5.29289ZM15.7071 12.7071L9.70711 18.7071L8.29289 17.2929L14.2929 11.2929L15.7071 12.7071Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
