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
<path d="M9.46095 7.60198C10.1359 7.9557 11.1965 8.53153 12.1589 9.13874C12.6468 9.4466 13.1012 9.75734 13.4644 10.047C13.8411 10.3474 14.0717 10.5881 14.1651 10.7499C14.2586 10.9117 14.3517 11.2318 14.4235 11.7081C14.4927 12.1675 14.5346 12.7164 14.5573 13.2929C14.602 14.4299 14.5703 15.6363 14.5392 16.3978C13.8642 16.044 12.8036 15.4682 11.8412 14.861C11.3533 14.5531 10.8989 14.2424 10.5357 13.9527C10.1591 13.6524 9.92842 13.4117 9.835 13.2499C9.74159 13.0881 9.64846 12.768 9.57666 12.2916C9.50743 11.8322 9.4655 11.2833 9.44284 10.7069C9.39816 9.56982 9.42979 8.36339 9.46095 7.60198Z" stroke={color}/>
<circle cx="12" cy="12" r="9" stroke={color}/>
</svg>
  );
}

export default withTheme(Icon);
