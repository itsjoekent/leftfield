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
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2C8.34315 2 7 3.34315 7 5V5.00068C5.92115 5.00539 5.32954 5.04261 4.88886 5.33706C4.67048 5.48298 4.48298 5.67048 4.33706 5.88886C4 6.39331 4 7.09554 4 8.5V18C4 19.8856 4 20.8284 4.58579 21.4142C5.17157 22 6.11438 22 8 22H16C17.8856 22 18.8284 22 19.4142 21.4142C20 20.8284 20 19.8856 20 18V8.5C20 7.09554 20 6.39331 19.6629 5.88886C19.517 5.67048 19.3295 5.48298 19.1111 5.33706C18.6705 5.04261 18.0789 5.00539 17 5.00068V5C17 3.34315 15.6569 2 14 2H10ZM10 5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5C14 5.55228 13.5523 6 13 6H11C10.4477 6 10 5.55228 10 5ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9ZM9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H13C13.5523 17 14 16.5523 14 16C14 15.4477 13.5523 15 13 15H9Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);