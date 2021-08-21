import React from 'react';
import { useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import SnackItem from '@product/components/Snacks/Item';
import { selectSnacks } from '@product/features/snacks';

export default function Snacks() {
  const items = useSelector(selectSnacks);
  const sortedItems = items.slice().sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Flex.Column
      position="absolute"
      zIndex={(indexes) => indexes.snacks}
      bottom="0"
      left="32px"
      specificWidth="0px"
      specificHeight="0px"
    >
      {sortedItems.map((item, index) => (
        <SnackItem key={item.id} id={item.id} index={index} />
      ))}
    </Flex.Column>
  );
}
