import React from 'react';
import { get } from 'lodash';
import { Flex, Typography } from 'pkg.admin-components';

export default function Label(props) {
  const { styleId, attribute } = props;

  const help = get(attribute, 'help');

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
      {!!help && (
        <Typography
          fontStyle="thin"
          fontSize="12px"
          fg={(colors) => colors.mono[600]}
        >
          {help}
        </Typography>
      )}
    </Flex.Column>
  );
}
