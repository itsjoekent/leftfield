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
<path d="M12 16L11.6464 16.3536L12 16.7071L12.3536 16.3536L12 16ZM12.5 3C12.5 2.72386 12.2761 2.5 12 2.5C11.7239 2.5 11.5 2.72386 11.5 3L12.5 3ZM5.64645 10.3536L11.6464 16.3536L12.3536 15.6464L6.35355 9.64645L5.64645 10.3536ZM12.3536 16.3536L18.3536 10.3536L17.6464 9.64645L11.6464 15.6464L12.3536 16.3536ZM12.5 16L12.5 3L11.5 3L11.5 16L12.5 16Z" fill={color}/>
<path d="M6 21H18" stroke={color} strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
