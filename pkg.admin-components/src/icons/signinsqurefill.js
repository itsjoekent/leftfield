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
<path fillRule="evenodd" clipRule="evenodd" d="M15.621 2.66859L11.9314 2.08881C8.71084 1.58272 7.10055 1.32967 6.05027 2.22779C5 3.12591 5 4.75596 5 8.01607V11H10.9194L8.21913 7.62469L9.78087 6.37531L13.7809 11.3753L14.2806 12L13.7809 12.6247L9.78087 17.6247L8.21913 16.3753L10.9194 13H5V15.9831C5 19.2432 5 20.8733 6.05027 21.7714C7.10055 22.6695 8.71084 22.4165 11.9314 21.9104L15.621 21.3306C17.2337 21.0771 18.04 20.9504 18.52 20.3891C19 19.8279 19 19.0116 19 17.3791V6.6201C19 4.98758 19 4.17132 18.52 3.61003C18.04 3.04874 17.2337 2.92202 15.621 2.66859Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
