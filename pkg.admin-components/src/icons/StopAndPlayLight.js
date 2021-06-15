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
<path d="M4.59426 16.6699L4.35144 16.2328L4.59426 16.6699ZM4.59426 7.33014L4.35144 7.76722L4.59426 7.33014ZM4.83708 6.89306L11.6693 10.6888L11.1837 11.5629L4.35144 7.76722L4.83708 6.89306ZM11.6693 13.3112L4.83708 17.1069L4.35144 16.2328L11.1837 12.4371L11.6693 13.3112ZM4.5 7.67981V16.3202H3.5V7.67981H4.5ZM4.83708 17.1069C4.2372 17.4402 3.5 17.0064 3.5 16.3202H4.5C4.5 16.2439 4.41809 16.1957 4.35144 16.2328L4.83708 17.1069ZM11.6693 10.6888C12.6981 11.2603 12.6981 12.7397 11.6693 13.3112L11.1837 12.4371C11.5266 12.2466 11.5266 11.7534 11.1837 11.5629L11.6693 10.6888ZM4.35144 7.76722C4.41809 7.80425 4.5 7.75605 4.5 7.67981H3.5C3.5 6.99357 4.2372 6.5598 4.83708 6.89306L4.35144 7.76722Z" fill={color}/>
<path d="M16 17L16 7" stroke={color} stroke-linecap="round"/>
<path d="M20 17L20 7" stroke={color} stroke-linecap="round"/>
</svg>
  );
}

export default withTheme(Icon);
