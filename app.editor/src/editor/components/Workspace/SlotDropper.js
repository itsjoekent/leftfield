import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useDrop } from 'react-dnd'
import { useSelector } from 'react-redux';
import { find, get } from 'lodash';
import { Flex } from 'pkg.admin-components';
import { COMPONENT_TYPE } from '@editor/constants/DragTypes';
import { selectComponentSlot } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function SlotDropper(props) {
  const { slotId } = props;

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const slotMeta = find(get(activeComponentMeta, 'slots', []), { id: slotId });

  const slotComponentIds = useSelector(selectComponentSlot(slotId));
  const totalComponentsInSlot = slotComponentIds.length;

  const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
    accept: COMPONENT_TYPE,
    drop: () => ({
      pageId: activePageId,
      componentId: activeComponentId,
      slotId,
      slotPlacementOrder: totalComponentsInSlot,
    }),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <DropperContainer
      ref={dropRef}
      justify="center"
      padding="12px"
      gridGap="6px"
      canDrop={canDrop}
      isOver={isOver}
    >
      <DropperNote>Drag component here</DropperNote>
      <DropperNote>•</DropperNote>
      <DropperPaste>Paste clipboard</DropperPaste>
    </DropperContainer>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const DropperContainer = styled(Flex.Row)`
  border: 2px dashed ${(props) => props.theme.colors.mono[500]};
  border-radius: ${(props) => props.theme.rounded.default};

  ${(props) => props.canDrop && css`
    border: 2px dashed ${(props) => props.theme.colors.purple[500]};
  `}

  ${(props) => props.isOver && css`
    background-color: ${(props) => props.theme.colors.purple[100]};

    ${DropperNote}, ${DropperPaste} {
      color: ${(props) => props.theme.colors.mono[700]};
    }
  `}

  &:not(:first-of-type) {
    animation: ${fadeIn} 0.5s ease-in both;
  }
`;

const DropperNote = styled.p`
  ${(props) => props.theme.fonts.main.light};
  font-size: 12px;
  color: ${(props) => props.theme.colors.mono[500]};
`;

const DropperPaste = styled.button`
  ${(props) => props.theme.fonts.main.light};
  font-size: 12px;
  color: ${(props) => props.theme.colors.mono[500]};
  text-decoration: underline;
  cursor: pointer;

  padding: 0;
  background: none;
  border: none;

  &:hover {
    color: ${(props) => props.theme.colors.mono[700]};
  }
`;
