import React from 'react';
import { Flex } from 'pkg.admin-components';

export default function FieldList(props) {
  const { children } = props;

  return (
    <Flex.Column gridGap="16px">
      {children}
    </Flex.Column>
  );
}
