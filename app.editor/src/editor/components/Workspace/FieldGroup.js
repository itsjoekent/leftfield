import React from 'react';
import { Flex } from 'pkg.admin-components';

export default function FieldGroup(props) {
  const { children } = props;

  return (
    <Flex.Column gridGap="6px">
      {children}
    </Flex.Column>
  );
}
