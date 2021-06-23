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
<path d="M12 18L12.7071 18.7071L12 19.4142L11.2929 18.7071L12 18ZM18.7071 12.7071L12.7071 18.7071L11.2929 17.2929L17.2929 11.2929L18.7071 12.7071ZM11.2929 18.7071L5.29289 12.7071L6.70711 11.2929L12.7071 17.2929L11.2929 18.7071Z" fill={color}/>
<path d="M12 12L12.7071 12.7071L12 13.4142L11.2929 12.7071L12 12ZM18.7071 6.70711L12.7071 12.7071L11.2929 11.2929L17.2929 5.29289L18.7071 6.70711ZM11.2929 12.7071L5.29289 6.70711L6.70711 5.29289L12.7071 11.2929L11.2929 12.7071Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
