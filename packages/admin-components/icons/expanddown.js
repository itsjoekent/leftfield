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
<path d="M12 15L12.7071 15.7071L12 16.4142L11.2929 15.7071L12 15ZM18.7071 9.70711L12.7071 15.7071L11.2929 14.2929L17.2929 8.29289L18.7071 9.70711ZM11.2929 15.7071L5.29289 9.70711L6.70711 8.29289L12.7071 14.2929L11.2929 15.7071Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
