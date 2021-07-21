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
<path d="M16 20L15.2929 20.7071L16 21.4142L16.7071 20.7071L16 20ZM4 15C4 15.5523 4.44772 16 5 16C5.55228 16 6 15.5523 6 15L4 15ZM10.2929 15.7071L15.2929 20.7071L16.7071 19.2929L11.7071 14.2929L10.2929 15.7071ZM16.7071 20.7071L21.7071 15.7071L20.2929 14.2929L15.2929 19.2929L16.7071 20.7071ZM17 20L17 9.5L15 9.5L15 20L17 20ZM4 9.5L4 15L6 15L6 9.5L4 9.5ZM10.5 3C6.91015 3 4 5.91015 4 9.5L6 9.5C6 7.01472 8.01472 5 10.5 5L10.5 3ZM17 9.5C17 5.91015 14.0899 3 10.5 3L10.5 5C12.9853 5 15 7.01472 15 9.5L17 9.5Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);