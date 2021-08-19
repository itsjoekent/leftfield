import React from 'react';
import { Link, useRoute } from 'wouter';
import { Block, Flex, Typography } from 'pkg.admin-components';

export default function NavigationButton(props) {
  const { label, route } = props;

  const [isActive] = useRoute(route);

  return (
    <Flex.Row gridGap="6px" align="center">
      <Block
        specificWidth="2px"
        specificHeight="80%"
        bg={(colors) => isActive ? colors.blue[500] : colors.mono[100]}
        transitions={['background-color']}
      />
      <Link href={route}>
        <Typography
          as="a"
          fontStyle="medium"
          fontSize="16px"
          textDecoration="none"
          fg={(colors) => isActive ? colors.blue[500] : colors.mono[400]}
          hoverFg={(colors) => colors.blue[500]}
          cursor="pointer"
          transitions={['color']}
        >
          {label}
        </Typography>
      </Link>
    </Flex.Row>
  );
}
