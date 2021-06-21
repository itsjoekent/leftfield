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
<path d="M7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5V11.5ZM21 12.5C21.2761 12.5 21.5 12.2761 21.5 12C21.5 11.7239 21.2761 11.5 21 11.5V12.5ZM7 12.5H21V11.5H7V12.5Z" fill={color}/>
<path d="M2.35729 11.7856L5.7884 9.72696C6.32162 9.40703 7 9.79112 7 10.413V13.587C7 14.2089 6.32162 14.593 5.7884 14.273L2.35729 12.2144C2.19545 12.1173 2.19545 11.8827 2.35729 11.7856Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);