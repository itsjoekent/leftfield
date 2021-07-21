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
<path d="M4 9.65685C4 8.83935 4 8.4306 4.15224 8.06306C4.30448 7.69552 4.59351 7.40649 5.17157 6.82843L5.82843 6.17157C6.40649 5.59351 6.69552 5.30448 7.06306 5.15224C7.4306 5 7.83935 5 8.65685 5H15.3431C16.1606 5 16.5694 5 16.9369 5.15224C17.3045 5.30448 17.5935 5.59351 18.1716 6.17157L18.8284 6.82843C19.4065 7.40649 19.6955 7.69552 19.8478 8.06306C20 8.4306 20 8.83935 20 9.65685V16C20 17.8856 20 18.8284 19.4142 19.4142C18.8284 20 17.8856 20 16 20H8C6.11438 20 5.17157 20 4.58579 19.4142C4 18.8284 4 17.8856 4 16V9.65685Z" stroke={color}/>
<path d="M4 10H20" stroke={color} strokeLinecap="round"/>
<path d="M14.8332 10L9.1665 10C8.9308 10 8.81295 10 8.73973 10.0732C8.6665 10.1464 8.6665 10.2643 8.6665 10.5L8.6665 13.6667C8.6665 14.4315 8.6665 14.8139 8.76541 15.0194C8.98621 15.4782 9.51649 15.6979 9.99705 15.5296C10.2123 15.4542 10.4827 15.1838 11.0235 14.643C11.274 14.3925 11.3992 14.2673 11.5324 14.1969C11.8248 14.0422 12.1748 14.0422 12.4673 14.1969C12.6004 14.2673 12.7257 14.3925 12.9761 14.643C13.517 15.1838 13.7874 15.4542 14.0026 15.5296C14.4832 15.6979 15.0135 15.4782 15.2343 15.0194C15.3332 14.8139 15.3332 14.4315 15.3332 13.6667V10.5C15.3332 10.2643 15.3332 10.1464 15.2599 10.0732C15.1867 10 15.0689 10 14.8332 10Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);