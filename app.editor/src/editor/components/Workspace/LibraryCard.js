import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { Flex, Icons, useAdminTheme } from 'pkg.admin-components';
import { ComponentMeta } from 'pkg.campaign-components';
import { COMPONENT_TYPE } from '@editor/constants/DragTypes';
import { addChildComponent } from '@editor/features/assembly';

export default function LibraryCard(props) {
  const { tag } = props;
  const meta = ComponentMeta[tag];

  const theme = useAdminTheme();
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: COMPONENT_TYPE,
    item: { tag },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!item || !dropResult) {
        return;
      }

      dispatch(addChildComponent({
        componentTag: item.tag,
        pageId: dropResult.pageId,
        parentComponentId: dropResult.componentId,
        slotId: dropResult.slotId,
        slotPlacementOrder: dropResult.slotPlacementOrder,
      }));
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Container
      paddingVertical="4px"
      paddingHorizontal="6px"
      gridGap="4px"
      align="center"
      justify="space-between"
      isDragging={isDragging}
      ref={dragRef}
    >
      <Flex.Row flexGrow overflowX="hidden">
        <Label>{get(meta, 'name')}</Label>
      </Flex.Row>
      {get(meta, 'shortDescription') && (
        <Icons.InfoLight
          color={theme.colors.mono[400]}
          width={16}
          height={16}
        />
      )}
    </Container>
  );
}

const Container = styled(Flex.Row)`
  height: fit-content;
  background-color: ${(props) => props.theme.colors.mono[100]};
  border-radius: ${(props) => props.theme.rounded.default};
  cursor: grab;
  ${(props) => props.theme.shadow.light}

  ${(props) => props.isDragging && css`
    box-shadow: none;
    cursor: grabbing;
  `}

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[200]};
  }
`;

const Label = styled.p`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 14px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.mono[700]};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
