import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { Link } from 'wouter';
import { Typography } from 'pkg.admin-components';
import CfImageUrl from 'pkg.cf-image-url';

export default function Avatar(props) {
  const {
    avatarSrc = '',
    children = null,
    containerProps = {},
    highlight = false,
    imageOnly = true,
    name = '',
    size = 32,
  } = props;

  const hasAvatar = !!avatarSrc;

  function getInitial(index) {
    return (name.split(' ')[index] || '').charAt(0);
  }

  return (
    <AvatarContainer
      size={size}
      hasAvatar={hasAvatar}
      highlight={highlight}
      imageOnly={imageOnly}
      {...containerProps}
    >
      {hasAvatar && (
        <img
          src={CfImageUrl(avatarSrc, { width: `${size}px` })}
          alt={`${name} account avatar`}
        />
      )}
      {!hasAvatar && (
        <Typography
          as="span"
          fontStyle="medium"
          fontSize="14px"
          fg={(colors) => colors.blue[800]}
        >
          {getInitial(0)}{getInitial(1)}
        </Typography>
      )}
      {children}
    </AvatarContainer>
  );
}

const AvatarContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.mono[100]};
  border: 2px solid ${(props) => props.theme.colors.mono[100]};
  position: relative;

  ${(props) => !props.hasAvatar && css`
    background-color: ${(props) => props.theme.colors.blue[200]};
  `}

  ${(props) => !props.imageOnly && css`
    cursor: pointer;

    &:hover {
      border: 2px solid ${(props) => props.theme.colors.blue[500]};
    }
  `}

  ${(props) => props.highlight && css`
    border: 2px solid ${(props) => props.theme.colors.blue[500]};
  `}

  img {
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    max-width: none;
    object-fit: cover;
    border-radius: 50%;
  }
`;
