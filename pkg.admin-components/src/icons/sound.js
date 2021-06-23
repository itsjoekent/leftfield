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
<path d="M13 14H8.81763C7.20089 14 5.83017 15.1888 5.60153 16.7893V16.7893C5.29858 18.9099 7.09499 20.7381 9.22059 20.4724L9.77821 20.4027C11.6188 20.1727 13 18.608 13 16.7531V7.38851C13 5.77017 13 4.961 13.474 4.4015C13.9479 3.84201 14.7461 3.70899 16.3424 3.44293L18.6991 3.05015C18.8349 3.02751 18.9028 3.01619 18.9395 3.05588C18.9761 3.09557 18.9594 3.16236 18.926 3.29593L18.0307 6.87721C18.0158 6.93689 18.0083 6.96672 17.9873 6.98673C17.9664 7.00673 17.9362 7.01276 17.8759 7.02482L13 8" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);
