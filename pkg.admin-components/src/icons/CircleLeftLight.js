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
<path d="M10 15L9.64645 14.6464L9.29289 15L9.64645 15.3536L10 15ZM13.6464 10.6464L9.64645 14.6464L10.3536 15.3536L14.3536 11.3536L13.6464 10.6464ZM9.64645 15.3536L13.6464 19.3536L14.3536 18.6464L10.3536 14.6464L9.64645 15.3536Z" fill={color}/>
<path d="M4.20577 12.75C3.19027 11.8706 2.79955 10.8452 3.09712 9.84068C3.3947 8.83614 4.36307 7.91146 5.84482 7.21695C7.32657 6.52244 9.23457 6.09894 11.2587 6.01529C13.2828 5.93164 15.3039 6.19277 16.9936 6.75622C18.6833 7.31966 19.9422 8.1523 20.5656 9.11879C21.189 10.0853 21.1402 11.1288 20.4273 12.0796C19.7143 13.0305 18.3791 13.8329 16.6387 14.3563C14.8982 14.8797 12.8548 15.0933 10.8408 14.9625" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
