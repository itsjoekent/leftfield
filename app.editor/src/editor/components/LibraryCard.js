import React from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import { useDrag } from 'react-dnd';
import { Typography } from 'pkg.admin-components';

/**
 * @param {ComponentMeta} props.campaignComponentMeta [required]
 */
export default function LibraryCard(props) {
  const { campaignComponentMeta } = props;
  const [dragStyle, dragRef] = useDrag(
    () => ({
      type: 'test',
      item: { tag: campaignComponentMeta.tag },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
  );

  return (
    <Card ref={dragRef} style={dragStyle}>
      <Typography.LargeLabel>
        {get(campaignComponentMeta, 'name')}
      </Typography.LargeLabel>
    </Card>
  );
}

const Card = styled.div`
  display: block;
  width: 100%;
  height: fit-content;
  background-color: ${(props) => props.theme.colors.mono[100]};
  padding: 6px;
  cursor: move;
  text-overflow: ellipsis;
`;
