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
<path d="M9.73666 16.1317L10.1839 17.0261L9.73666 16.1317ZM10.1839 6.9739L16.6584 10.2111L15.7639 12L9.28944 8.76276L10.1839 6.9739ZM16.6584 13.7889L10.1839 17.0261L9.28944 15.2372L15.7639 12L16.6584 13.7889ZM9 8.94164V15.0584H7V8.94164H9ZM10.1839 17.0261C8.72109 17.7575 7 16.6938 7 15.0584H9C9 15.207 9.15646 15.3037 9.28944 15.2372L10.1839 17.0261ZM16.6584 10.2111C18.1325 10.9482 18.1325 13.0518 16.6584 13.7889L15.7639 12L15.7639 12L16.6584 10.2111ZM9.28944 8.76276C9.15646 8.69627 9 8.79296 9 8.94164H7C7 7.3062 8.72109 6.24251 10.1839 6.9739L9.28944 8.76276Z" fill={color}/>
<circle cx="12" cy="12" r="9" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);
