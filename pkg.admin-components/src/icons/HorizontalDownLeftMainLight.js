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
<path d="M22 8L22.3536 7.64645L22.7071 8L22.3536 8.35355L22 8ZM12 8.5C11.7239 8.5 11.5 8.27614 11.5 8C11.5 7.72386 11.7239 7.5 12 7.5V8.5ZM18.3536 3.64645L22.3536 7.64645L21.6464 8.35355L17.6464 4.35355L18.3536 3.64645ZM22.3536 8.35355L18.3536 12.3536L17.6464 11.6464L21.6464 7.64645L22.3536 8.35355ZM22 8.5H12V7.5H22V8.5Z" fill={color}/>
<path d="M2 16L1.64645 15.6464L1.29289 16L1.64645 16.3536L2 16ZM21 16.5C21.2761 16.5 21.5 16.2761 21.5 16C21.5 15.7239 21.2761 15.5 21 15.5L21 16.5ZM5.64645 11.6464L1.64645 15.6464L2.35355 16.3536L6.35355 12.3536L5.64645 11.6464ZM1.64645 16.3536L5.64645 20.3536L6.35355 19.6464L2.35355 15.6464L1.64645 16.3536ZM2 16.5L21 16.5L21 15.5L2 15.5L2 16.5Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);