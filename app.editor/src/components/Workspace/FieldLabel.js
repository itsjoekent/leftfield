import React from 'react';
import {
  Flex,
  Typography,
} from 'pkg.admin-components';

export default function FieldLabel(props) {
  const {
    labelProps,
    isRequired,
    hideRequiredStatus = false,
    help,
  } = props;

  return (
    <Flex.Column fullWidth gridGap="2px">
      <Flex.Row
        flexGrow
        gridGap="4px"
        align="center"
        overflowX="hidden"
      >
        <Typography
          as="label"
          fontStyle="bold"
          fontSize="14px"
          letterSpacing="2%"
          fg={(colors) => colors.mono[700]}
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          {...labelProps}
        />
        {!hideRequiredStatus && (
          <Typography
            as="span"
            fontStyle="light"
            fontSize="14px"
            letterSpacing="2%"
            fg={(colors) => colors.mono[500]}
          >
            {isRequired ? '(required)' : '(optional)'}
          </Typography>
        )}
      </Flex.Row>
      {!!help && (
        <Typography
          as="p"
          fontStyle="light"
          fontSize="12px"
          fg={(colors) => colors.mono[600]}
        >
          {help}
        </Typography>
      )}
    </Flex.Column>
  );
}
