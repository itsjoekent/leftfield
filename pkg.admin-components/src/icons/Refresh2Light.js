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
<path d="M10 19L9.64645 18.6464L9.29289 19L9.64645 19.3536L10 19ZM13.6464 14.6464L9.64645 18.6464L10.3536 19.3536L14.3536 15.3536L13.6464 14.6464ZM9.64645 19.3536L13.6464 23.3536L14.3536 22.6464L10.3536 18.6464L9.64645 19.3536Z" fill={color}/>
<path d="M18.0622 8.5C18.7138 9.62862 19.0374 10.9167 18.9966 12.2193C18.9557 13.5219 18.5521 14.7872 17.8311 15.8728C17.11 16.9584 16.1003 17.8212 14.9155 18.364C13.7307 18.9067 12.4179 19.108 11.1249 18.9451" stroke={color} stroke-linecap="round"/>
<path d="M14 5L14.3536 5.35355L14.7071 5L14.3536 4.64645L14 5ZM10.3536 9.35355L14.3536 5.35355L13.6464 4.64645L9.64645 8.64645L10.3536 9.35355ZM14.3536 4.64645L10.3536 0.646446L9.64645 1.35355L13.6464 5.35355L14.3536 4.64645Z" fill={color}/>
<path d="M5.93782 15.5C5.27676 14.355 4.95347 13.0462 5.0054 11.7251C5.05733 10.404 5.48234 9.12457 6.23124 8.03498C6.98013 6.9454 8.02229 6.09019 9.23708 5.56834C10.4519 5.04649 11.7896 4.87934 13.0955 5.08625" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
