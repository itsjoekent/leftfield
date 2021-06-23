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
<path d="M12 11L12.3536 10.6464L12 10.2929L11.6464 10.6464L12 11ZM18.3536 16.6464L12.3536 10.6464L11.6464 11.3536L17.6464 17.3536L18.3536 16.6464ZM11.6464 10.6464L5.64645 16.6464L6.35355 17.3536L12.3536 11.3536L11.6464 10.6464Z" fill={color}/>
<path d="M7 6L17 6" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);
