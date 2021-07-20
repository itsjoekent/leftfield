import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  Flex,
  Typography,
} from 'pkg.admin-components';
import {
  selectComponentName,
  selectComponentTag,
  selectComponentSlots,
} from '@editor/features/assembly';
import {
  setActiveComponentId,
  setIsComponentTreeOpen,
} from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function ComponentTreeBranch(props) {
  const { componentId, indent = 0 } = props;

  const dispatch = useDispatch();

  const {
    activeComponentId,
    activePageId,
  } = useActiveWorkspaceComponent();

  const name = useSelector(selectComponentName(activePageId, componentId));
  const tag = useSelector(selectComponentTag(activePageId, componentId));
  const slots = useSelector(selectComponentSlots(activePageId, componentId));

  const meta = ComponentMeta[tag];

  const isActiveBranch = componentId === activeComponentId;
  const hasSlots = !!get(meta, `slots.length`, 0);

  function onClick(targetComponentId) {
    dispatch(setActiveComponentId({ componentId: targetComponentId }));
    dispatch(setIsComponentTreeOpen(false));
  }

  const displaySlots = hasSlots
    && meta.slots.filter((slotMeta) => !!get(slots, `${slotMeta.id}.length`, 0));

  return (
    <Flex.Column
      gridGap="6px"
      marginLeft={`${indent}px`}
      padding="4px"
      rounded={(radius) => radius.default}
    >
      <Typography
        fontStyle="regular"
        fontSize="16px"
        cursor="pointer"
        fitWidth
        role="button"
        tabIndex={0}
        aria-label={`Edit ${name}`}
        fg={(colors) => isActiveBranch ? colors.purple[800] : colors.mono[600]}
        hoverFg={(colors) => colors.purple[500]}
        onClick={() => onClick(componentId)}
      >
        {name}
      </Typography>
      {hasSlots && displaySlots.map((slotMeta) => (
        <Flex.Column key={slotMeta.id}>
          <Typography
            fontStyle="medium"
            fontSize="12px"
            fg={(colors) => colors.mono[500]}
          >
            {slotMeta.label}
          </Typography>
          {slots[slotMeta.id].map((childId) => (
            <ComponentTreeBranch
              key={childId}
              componentId={childId}
              indent={indent + 6}
            />
          ))}
        </Flex.Column>
      ))}
    </Flex.Column>
  );
}
