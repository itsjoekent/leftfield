import React from 'react';
import { get } from 'lodash';
import { Link } from 'wouter';
import ago from 's-ago';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';

export default function WebsiteCard(props) {
  const {
    id,
    name,
    domain,
    lastPublishedAt,
    lastPublishedBy,
    draftSnapshot,
    createdAt,
  } = props;

  return (
    <Flex.Column
      bg={(colors) => colors.mono[100]}
      rounded={(radius) => radius.extra}
      borderWidth="1px"
      borderColor={(colors) => colors.mono[700]}
      overflow="hidden"
    >
      <Flex.Row
        align="center"
        justify="space-between"
        padding="12px"
      >
        <Flex.Column gridGap="6px">
          <Typography
            as="h3"
            fontStyle="bold"
            fontSize="18px"
            fg={(colors) => colors.mono[700]}
          >
            {name}
          </Typography>
          <Typography
            fontStyle="light"
            fontSize="14px"
            fg={(colors) => colors.mono[600]}
          >
            {domain || 'No domain configured'}
          </Typography>
        </Flex.Column>
        <Link href="/dashboard">
          <Buttons.Filled
            as="a"
            IconComponent={Icons.EditFill}
            iconSize={20}
            gridGap="4px"
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => colors.blue[500]}
            hoverButtonBg={(colors) => colors.blue[700]}
            paddingVertical="4px"
            paddingHorizontal="8px"
          >
            <Typography fontStyle="medium" fontSize="14px">
              Edit website
            </Typography>
          </Buttons.Filled>
        </Link>
      </Flex.Row>
      <Block
        fullWidth
        specificHeight="1px"
        bg={(colors) => colors.mono[700]}
      />
      <Flex.Column
        fullWidth
        padding="12px"
        bg={(colors) => colors.mono[200]}
        gridGap="6px"
      >
        {!draftSnapshot && !lastPublishedBy && (
          <Typography fontSize="14px" fg={(colors) => colors.mono[600]}>
            Created {ago(new Date(createdAt))}
          </Typography>
        )}
      </Flex.Column>
    </Flex.Column>
  );
}
