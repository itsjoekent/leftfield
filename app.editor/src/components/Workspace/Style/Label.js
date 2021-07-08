import React from 'react';
import { get } from 'lodash';
import { Flex, Typography } from 'pkg.admin-components';

export default function Label(props) {
  const { styleId, attribute } = props;

  return (
    <Flex.Column gridGap="2px">
      <Typography
        id={`${styleId}-${get(attribute, 'id')}`}
        as="label"
        fontStyle="medium"
        fontSize="16px"
        fg={(colors) => colors.mono[900]}
      >
        {get(attribute, 'label', '')}
      </Typography>
      {/* TODO: help text */}
    </Flex.Column>
  );
}
