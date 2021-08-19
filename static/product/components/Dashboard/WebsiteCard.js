import React from 'react';
import { get, isEmpty, isObject } from 'lodash';
import { Link } from 'wouter';
import ago from 's-ago';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import Avatar from '@product/components/Avatar';
import { EDITOR_ROUTE } from '@product/routes/Editor';

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

  const draftCreatedBy = get(draftSnapshot, 'createdBy', null);
  const hasDraftCreatedBy = !!draftCreatedBy
    && isObject(draftCreatedBy)
    && !isEmpty(draftCreatedBy);

  const hasLastPublishedBy = isObject(lastPublishedBy)
    && !isEmpty(lastPublishedBy);

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
        <Link href={`${EDITOR_ROUTE}?id=${id}`}>
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
        {!!hasDraftCreatedBy && (
          <Flex.Row gridGap="4px" align="center">
            <Avatar
              avatarSrc={get(draftCreatedBy, 'avatar')}
              name={get(draftCreatedBy, 'name')}
              size={16}
            />
            <Typography fontSize="14px" fg={(colors) => colors.mono[600]}>
              Last updated by {get(draftCreatedBy, 'name')} {ago(new Date(get(draftSnapshot, 'createdAt')))}
            </Typography>
          </Flex.Row>
        )}
        {!!hasLastPublishedBy && (
          <Flex.Row gridGap="4px" align="center">
            <Avatar
              avatarSrc={get(lastPublishedBy, 'avatar')}
              name={get(lastPublishedBy, 'name')}
              size={16}
            />
            <Typography fontSize="14px" fg={(colors) => colors.mono[600]}>
              Last published by {get(lastPublishedBy, 'name')} {ago(new Date(lastPublishedAt))}
            </Typography>
          </Flex.Row>
        )}
        {!hasDraftCreatedBy && !hasLastPublishedBy && (
          <Typography fontSize="14px" fg={(colors) => colors.mono[600]}>
            Created {ago(new Date(createdAt))}
          </Typography>
        )}
      </Flex.Column>
    </Flex.Column>
  );
}
