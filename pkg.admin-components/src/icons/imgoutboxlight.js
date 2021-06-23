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
<path d="M21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H12" stroke={color}/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.9976 14.2904L18.4033 13.6961L18.3931 13.6858L18.393 13.6858C18.3245 13.6173 18.2785 13.5712 18.2394 13.5353C17.0477 12.4403 15.1454 12.749 14.3611 14.1647C14.3354 14.2111 14.3062 14.2694 14.2629 14.3561L14.2564 14.369C14.227 14.4278 14.22 14.4416 14.2161 14.4486C14.0513 14.7448 13.6458 14.7947 13.4142 14.5474C13.4087 14.5415 13.3985 14.5298 13.3557 14.4799L8.37964 8.67448C8.19993 8.46482 7.88428 8.44054 7.67461 8.62025C7.46495 8.79996 7.44067 9.11561 7.62038 9.32527L12.5965 15.1307L12.6038 15.1392L12.6038 15.1393C12.6352 15.1759 12.6614 15.2065 12.6843 15.2309C13.3793 15.9731 14.5957 15.8233 15.09 14.9347C15.1062 14.9056 15.1242 14.8695 15.1458 14.8263L15.1508 14.8162C15.203 14.712 15.2218 14.6746 15.2358 14.6493C15.7064 13.7999 16.8478 13.6147 17.5628 14.2717C17.5841 14.2912 17.6138 14.3207 17.6962 14.4032L18.9756 15.6825C18.9887 15.2721 18.9948 14.812 18.9976 14.2904Z" fill={color}/>
<path d="M21 3V2.5H21.5V3H21ZM16.3123 7.39043C16.0967 7.56294 15.7821 7.52798 15.6096 7.31235C15.4371 7.09672 15.472 6.78207 15.6877 6.60957L16.3123 7.39043ZM20.5 8V3H21.5V8H20.5ZM21 3.5H16V2.5H21V3.5ZM21.3123 3.39043L16.3123 7.39043L15.6877 6.60957L20.6877 2.60957L21.3123 3.39043Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
