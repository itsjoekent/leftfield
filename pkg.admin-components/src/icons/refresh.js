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
<path d="M10 19L9.29289 18.2929L8.58579 19L9.29289 19.7071L10 19ZM13.2929 14.2929L9.29289 18.2929L10.7071 19.7071L14.7071 15.7071L13.2929 14.2929ZM9.29289 19.7071L13.2929 23.7071L14.7071 22.2929L10.7071 18.2929L9.29289 19.7071Z" fill={color}/>
<path d="M5.93782 15.5C5.16735 14.1655 4.85875 12.6141 5.05989 11.0863C5.26102 9.55856 5.96064 8.13986 7.05025 7.05025C8.13986 5.96064 9.55856 5.26102 11.0863 5.05989C12.6141 4.85875 14.1655 5.16735 15.5 5.93782C16.8345 6.70829 17.8775 7.89757 18.4672 9.32122C19.0568 10.7449 19.1603 12.3233 18.7615 13.8117C18.3627 15.3002 17.4838 16.6154 16.2613 17.5535C15.0388 18.4915 13.5409 19 12 19" stroke={color} stroke-width="2" stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
