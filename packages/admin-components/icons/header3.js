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
<path d="M6.682 5H4.288C4.108 5 4 5.108 4 5.288V18.482C4 18.662 4.108 18.77 4.288 18.77H6.682C6.826 18.77 6.952 18.662 6.952 18.482V12.776C7.222 11.84 7.834 11.282 8.608 11.282C9.364 11.282 9.742 11.804 9.742 12.632L9.76 18.482C9.76 18.662 9.868 18.77 10.048 18.77H12.424C12.55 18.77 12.694 18.734 12.694 18.482L12.712 12.128C12.712 10.022 11.65 8.6 9.778 8.6C8.428 8.6 7.51 9.356 6.952 10.166V5.288C6.952 5.108 6.844 5 6.682 5Z" fill={color}/>
<path d="M17.3135 11.33C15.9435 11.33 15.2135 11.89 14.8235 12.78C14.7735 12.9 14.8035 12.98 14.8835 13.02L15.9335 13.57C16.0635 13.64 16.1435 13.61 16.1935 13.49C16.3935 13.02 16.6935 12.81 17.2035 12.81C17.7635 12.81 18.1235 13.05 18.1235 13.52V13.59C18.1235 14.05 17.8035 14.3 17.1935 14.3H16.5535C16.4535 14.3 16.3935 14.36 16.3935 14.46V15.58C16.3935 15.69 16.4535 15.74 16.5535 15.74H17.2035C17.9535 15.74 18.2435 16.01 18.2435 16.53V16.63C18.2435 17.06 17.8935 17.4 17.2835 17.4C16.6835 17.4 16.3435 17.09 16.1235 16.53C16.0735 16.4 15.9735 16.36 15.8435 16.41L14.7435 16.79C14.6235 16.84 14.5935 16.94 14.6235 17.05C14.8935 18.02 15.7235 18.89 17.2535 18.89C18.8335 18.89 19.9335 18.06 19.9335 16.7V16.59C19.9335 15.76 19.4335 15.13 18.6835 14.96C19.4035 14.71 19.7835 14.12 19.7835 13.42V13.32C19.7835 12.2 18.9435 11.33 17.3135 11.33Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);