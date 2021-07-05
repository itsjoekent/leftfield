import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import WorkspaceComponentTreeBranch from '@editor/components/Workspace/ComponentTreeBranch';
import {
  selectPageName,
  selectPageRootComponentId,
} from '@editor/features/assembly';
import {
  selectActivePageId,
  selectIsComponentInspecting,
  setIsComponentInspecting,
} from '@editor/features/workspace';

export default function ComponentTree() {
  const dispatch = useDispatch();

  const isComponentInspecting = useSelector(selectIsComponentInspecting);

  const activePageId = useSelector(selectActivePageId);
  const pageName = useSelector(selectPageName(activePageId));
  const rootComponentId = useSelector(selectPageRootComponentId(activePageId));

  return (
    <Flex.Column gridGap="12px" padding="12px" flexGrow fullWidth>
      <Flex.Row align="center" justify="space-between" gridGap="12px">
        <Typography
          fontStyle="extraBold"
          fontSize="12px"
          fg={(colors) => colors.purple[500]}
        >
          {pageName} Components
        </Typography>
        <Tooltip copy="Inspect a component" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Inspect a component"
            onClick={() => dispatch(setIsComponentInspecting(!isComponentInspecting))}
            color={(colors) => isComponentInspecting ? colors.red[300] : colors.purple[500]}
            hoverColor={(colors) => colors.purple[700]}
            IconComponent={Icons.TargetFill}
          />
        </Tooltip>
      </Flex.Row>
      <Flex.Column
        fullWidth
        flexGrow
        overflow="scroll"
        gridGap="6px"
        padding="6px"
        bg={(colors) => colors.mono[200]}
        rounded={(radius) => radius.default}
      >
        <WorkspaceComponentTreeBranch componentId={rootComponentId} />
      </Flex.Column>
    </Flex.Column>
  );
}
