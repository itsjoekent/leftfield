import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { find, get } from 'lodash';
import {
  Flex,
  Icons,
  useAdminTheme,
} from 'pkg.admin-components';
import WorkspaceSlotInstanceList from '@product/components/Workspace/SlotInstanceList';
import { selectComponentSlot } from '@product/features/assembly';
import { setModal, ELEMENT_LIBRARY_MODAL } from '@product/features/modal';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

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
  // const minListSize = get(slotMeta, 'min', 0);
  const maxListSize = get(slotMeta, 'max', 0);

  const slotComponents = useSelector(selectComponentSlot(activePageId, activeComponentId, slotId));
  const totalComponentsInSlot = slotComponents.length;

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
              type: ELEMENT_LIBRARY_MODAL,
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
