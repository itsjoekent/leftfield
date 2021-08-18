import React from 'react';
import { Flex, Typography } from 'pkg.admin-components';

export default function VaultLayout(props) {
  const {
    title,
    subtitle,
    children,
  } = props;

  return (
    <Flex.Column
      fullWidth
      fullViewportHeight
      bg={(colors) => colors.mono[200]}
      justify="center"
      align="center"
      padding="24px"
    >
      <Flex.Column
        gridGap="24px"
        fullWidth
        maxWidth="400px"
        padding="24px"
        bg={(colors) => colors.mono[100]}
        rounded={(radius) => radius.default}
        shadow={(shadows) => shadows.light}
      >
        <Flex.Column gridGap="2px">
          <Typography
            as="h1"
            fontStyle="bold"
            fontSize="22px"
            fg={(colors) => colors.blue[600]}
            textAlign="center"
          >
            {title}
          </Typography>
          {!!subtitle && (
            <Typography
              as="p"
              fontStyle="medium"
              fontSize="16px"
              fg={(colors) => colors.mono[500]}
              textAlign="center"
            >
              {subtitle}
            </Typography>
          )}
        </Flex.Column>
        {children}
      </Flex.Column>
    </Flex.Column>
  );
}
