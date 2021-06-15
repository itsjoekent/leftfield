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
<path d="M9.73666 16.1317L9.96027 16.5789L9.73666 16.1317ZM9.96026 7.42111L16.4348 10.6584L15.9875 11.5528L9.51305 8.31554L9.96026 7.42111ZM16.4348 13.3416L9.96027 16.5789L9.51305 15.6845L15.9875 12.4472L16.4348 13.3416ZM8.5 8.94164V15.0584H7.5V8.94164H8.5ZM9.96027 16.5789C8.82993 17.144 7.5 16.3221 7.5 15.0584H8.5C8.5 15.5787 9.04762 15.9172 9.51305 15.6845L9.96027 16.5789ZM16.4348 10.6584C17.5403 11.2111 17.5403 12.7889 16.4348 13.3416L15.9875 12.4472C16.3561 12.263 16.3561 11.737 15.9875 11.5528L16.4348 10.6584ZM9.51305 8.31554C9.04762 8.08283 8.5 8.42127 8.5 8.94164H7.5C7.5 7.67789 8.82993 6.85595 9.96026 7.42111L9.51305 8.31554Z" fill={color}/>
<circle cx="12" cy="12" r="9" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);
