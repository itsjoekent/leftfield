import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { find, get } from 'lodash';
import {
  Buttons,
  Flex, Icons,
  Tooltip,
  useAdminTheme,
} from 'pkg.admin-components';
import WorkspaceSlotInstanceList from '@editor/components/Workspace/SlotInstanceList';
import { COMPONENT_TYPE } from '@editor/constants/DragTypes';
import { selectComponentSlot } from '@editor/features/assembly';
import { setModal, ELEMENT_LIBRARY } from '@editor/features/modal';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

// TODO:
// validations / red bg if doesn't have min

export default function SlotList(props) {
  const { slotId } = props;

  const theme = useAdminTheme();
  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const slotMeta = find(get(activeComponentMeta, 'slots', []), { id: slotId });
  const isList = get(slotMeta, 'isList', false);
  const minListSize = get(slotMeta, 'min', 0);
  const maxListSize = get(slotMeta, 'max', 0);

  const slotComponents = useSelector(selectComponentSlot(activePageId, activeComponentId, slotId));

  const totalComponentsInSlot = slotComponents.length;
  const plural = totalComponentsInSlot !== 1 ? 's' : '';

  const counterCopy = get(slotMeta, 'isList', false) ? (
    maxListSize ? `${totalComponentsInSlot}/${maxListSize} component${plural} used` : `${totalComponentsInSlot} component${plural}`
  ) : `${totalComponentsInSlot}/1 components used`;

  const hasEmptyChannel = isList ? (
    maxListSize ? totalComponentsInSlot < maxListSize : true
  ) : totalComponentsInSlot < 1;

  return (
    <Flex.Column
      bg={(colors) => colors.mono[300]}
      rounded={(radius) => radius.default}
    >
      <WorkspaceSlotInstanceList slotId={slotId} />
      {hasEmptyChannel && (
        <Flex.Row
          fullWidth
          justify="space-between"
          align="center"
          padding="12px"
        >
          <AddButton
            as="button"
            gridGap="6px"
            align="center"
            onClick={() => dispatch(setModal({
              type: ELEMENT_LIBRARY,
              props: {
                pageId: activePageId,
                parentComponentId: activeComponentId,
                slotId,
              },
            }))}
          >
            <Icons.AddRound color={theme.colors.mono[600]} />
            Add new component
          </AddButton>
          <Tooltip copy="Paste component" point={Tooltip.RIGHT}>
            <Buttons.IconButton
              IconComponent={Icons.DeskAlt}
              color={(colors) => colors.mono[600]}
              hoverColor={(colors) => colors.mono[900]}
              aria-label="Paste component"
            />
          </Tooltip>
        </Flex.Row>
      )}
    </Flex.Column>
  );
}

const AddButton = styled(Flex.Row)`
  ${(props) => props.theme.fonts.main.regular};
  font-size: 14px;
  color: ${(props) => props.theme.colors.mono[600]};
  transition: 0.4s color;

  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  margin: 0;

  svg path {
    transition: 0.4s stroke;
  }

  &:hover {
    color: ${(props) => props.theme.colors.mono[900]};

    svg path {
      stroke: ${(props) => props.theme.colors.mono[900]};
    }
  }
`;
