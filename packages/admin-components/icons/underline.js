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
<rect x="7" y="17" width="10" height="2" fill={color}/>
<path d="M16.954 5.00003H14.488C14.308 5.00003 14.2 5.10803 14.2 5.28803V10.694C14.2 11.954 13.75 12.98 12.112 12.98C10.474 12.98 10.042 11.954 10.042 10.694V5.28803C10.042 5.10803 9.952 5.00003 9.754 5.00003H7.288C7.108 5.00003 7 5.10803 7 5.28803V10.802C7 13.646 8.584 15.788 12.112 15.788C15.658 15.788 17.242 13.484 17.242 10.802V5.28803C17.242 5.10803 17.152 5.00003 16.954 5.00003Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
