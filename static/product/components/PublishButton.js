import React from 'react';
import { Buttons, Typography } from 'pkg.admin-components';

export default function PublishButton() {
  return (
    <Buttons.Filled
      paddingVertical="4px"
      paddingHorizontal="8px"
      buttonFg={(colors) => colors.mono[700]}
      buttonBg={(colors) => colors.yellow[600]}
      hoverButtonBg={(colors) => colors.yellow[700]}
    >
      <Typography
        fontStyle="bold"
        fontSize="16px"
      >
        Publish
      </Typography>
    </Buttons.Filled>
  );
}
