import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'wouter';
import { Block, Flex, Typography } from 'pkg.admin-components';
import Avatar from '@product/components/Avatar';
import { selectAuthAccount } from '@product/features/auth';
import useDropper from '@product/hooks/useDropper';
import { DASHBOARD_ACCOUNT_ROUTE } from '@product/routes/Dashboard/Account';
import { LOGOUT_ROUTE } from '@product/routes/Logout';

function DropdownLink(props) {
  const { href, label } = props;

  return (
    <Link href={href}>
      <Typography
        as="a"
        fontStyle="medium"
        fontSize="16px"
        whiteSpace="nowrap"
        textAlign="left"
        textDecoration="none"
        fg={(colors) => colors.mono[700]}
        bg={(colors) => colors.mono[100]}
        hoverBg={(colors) => colors.blue[100]}
        paddingVertical="12px"
        paddingHorizontal="16px"
      >
        {label}
      </Typography>
    </Link>
  );
}

export default function AccountButton(props) {
  const { imageOnly = false, size = 32 } = props;
  const { isOpen, setIsOpen, containerRef } = useDropper();

  const account = useSelector(selectAuthAccount);
  const avatarSrc = get(account, 'avatar', null);

  const hasAvatar = !!avatarSrc;

  function getInitial(index) {
    return (get(account, 'name', '').split(' ')[index] || '').charAt(0);
  }

  return (
    <Avatar
      avatarSrc={avatarSrc}
      containerProps={{
        ref: containerRef,
        'aria-label': 'Open account menu',
        onClick: () => setIsOpen(!isOpen),
      }}
      highlight={isOpen}
      imageOnly={false}
      name={get(account, 'name', '')}
    >
      {isOpen && (
        <Flex.Column
          position="absolute"
          zIndex={(indexes) => indexes.dropdown}
          top="calc(100% + 12px)"
          right="0"
          bg={(colors) => colors.mono[100]}
          shadow={(shadows) => shadows.light}
          rounded={(radius) => radius.default}
        >
          <DropdownLink href={DASHBOARD_ACCOUNT_ROUTE} label="Account settings" />
          <DropdownLink href={LOGOUT_ROUTE} label="Log out" />
        </Flex.Column>
      )}
    </Avatar>
  );
}
