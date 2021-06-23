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
<path d="M8 4.46105C8 4.03164 8 3.81694 8.06485 3.64576C8.16633 3.37785 8.37785 3.16633 8.64576 3.06485C8.81694 3 9.03164 3 9.46105 3H14.539C14.9684 3 15.1831 3 15.3542 3.06485C15.6222 3.16633 15.8337 3.37785 15.9352 3.64576C16 3.81694 16 4.03164 16 4.46105V4.46105C16 5.56756 16 6.12082 16.0734 6.65886C16.1878 7.49795 16.4348 8.31355 16.805 9.07519C17.0424 9.56357 17.3493 10.0239 17.9631 10.9446L19.3617 13.0426C19.6728 13.5092 19.4277 14.1431 18.8837 14.2791V14.2791C14.3641 15.409 9.6359 15.409 5.11634 14.2791V14.2791C4.57231 14.1431 4.32723 13.5092 4.63829 13.0426L6.03694 10.9446C6.65073 10.0239 6.95762 9.56357 7.19501 9.07519C7.56524 8.31355 7.81218 7.49795 7.92662 6.65886C8 6.12082 8 5.56756 8 4.46105V4.46105Z" stroke={color} stroke-width="2"/>
<path d="M12 20L12 16" stroke={color} stroke-width="2" stroke-linecap="round"/>
<path d="M6 20H18" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);
