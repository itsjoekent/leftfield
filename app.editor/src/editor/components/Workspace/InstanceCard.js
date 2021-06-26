import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Icons, useAdminTheme } from 'pkg.admin-components';
import { COMPONENT_INSTANCE } from '@editor/constants/DragTypes';
import {
  selectComponent,
  selectComponentSlot,
  reorderChildComponentInstance,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function InstanceCard(props) {
  const { componentId, slotId } = props;

  const { activeComponentId, activePageId } = useActiveWorkspaceComponent();
  const component = useSelector(selectComponent(activePageId, componentId));

  const slotComponents = useSelector(selectComponentSlot(activePageId, activeComponentId, slotId));
  const instanceIndex = slotComponents.findIndex((compare) => compare === componentId);

  const theme = useAdminTheme();
  const dispatch = useDispatch();

  return (
    <Container
      paddingVertical="6px"
      paddingHorizontal="12px"
      gridGap="4px"
      align="center"
      justify="space-between"
      isDragging={isDragging}
    >
      <Flex.Row flexGrow overflowX="hidden">
        <Label>{get(component, 'name')}</Label>
      </Flex.Row>
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
    opacity: 0;
    cursor: grabbing;

    ${Label}, ${Flex.Row} {
      cursor: grabbing;
    }
  `}

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[200]};
  }
`;

const Label = styled.p`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 16px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.mono[700]};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
