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
<path d="M12 12.5H6V13.5H12V12.5ZM18 12.5H12V13.5H18V12.5ZM20.5 10C20.5 11.3807 19.3807 12.5 18 12.5V13.5C19.933 13.5 21.5 11.933 21.5 10H20.5ZM18 7.5C19.3807 7.5 20.5 8.61929 20.5 10H21.5C21.5 8.067 19.933 6.5 18 6.5V7.5ZM17.0201 5.75007C16.1607 3.83526 14.2368 2.5 12 2.5V3.5C13.8287 3.5 15.4038 4.59089 16.1078 6.15954L17.0201 5.75007ZM12 2.5C9.76317 2.5 7.83928 3.83526 6.97989 5.75007L7.89222 6.15954C8.59624 4.59089 10.1713 3.5 12 3.5V2.5ZM6 6.5C4.067 6.5 2.5 8.067 2.5 10H3.5C3.5 8.61929 4.61929 7.5 6 7.5V6.5ZM2.5 10C2.5 11.933 4.067 13.5 6 13.5V12.5C4.61929 12.5 3.5 11.3807 3.5 10H2.5ZM6.97989 5.75007C6.77146 6.21449 6.38469 6.5 6 6.5V7.5C6.89538 7.5 7.57652 6.86297 7.89222 6.15954L6.97989 5.75007ZM18 6.5C17.6153 6.5 17.2285 6.21449 17.0201 5.75007L16.1078 6.15954C16.4235 6.86297 17.1046 7.5 18 7.5V6.5Z" fill={color}/>
<path d="M12 19V17" stroke={color} strokeLinecap="round"/>
<path d="M17 20V17" stroke={color} strokeLinecap="round"/>
<path d="M7 21V17" stroke={color} strokeLinecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
