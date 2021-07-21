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
<path d="M16 21V19C16 17.1144 16 16.1716 15.4142 15.5858C14.8284 15 13.8856 15 12 15H11C9.11438 15 8.17157 15 7.58579 15.5858C7 16.1716 7 17.1144 7 19V21" stroke={color}/>
<path d="M7 8H12" stroke={color} strokeLinecap="round"/>
<path d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H16.1716C16.5803 3 16.7847 3 16.9685 3.07612C17.1522 3.15224 17.2968 3.29676 17.5858 3.58579L20.4142 6.41421C20.7032 6.70324 20.8478 6.84776 20.9239 7.03153C21 7.2153 21 7.41968 21 7.82843V15C21 17.8284 21 19.2426 20.1213 20.1213C19.2426 21 17.8284 21 15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15V9Z" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);