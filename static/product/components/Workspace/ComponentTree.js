import React from 'react';
import { useSelector } from 'react-redux';
import {
  Flex,
  Typography,
} from 'pkg.admin-components';
import WorkspaceComponentTreeBranch from '@product/components/Workspace/ComponentTreeBranch';
import {
  selectPageName,
  selectPageRootComponentId,
} from '@product/features/assembly';
import { selectActivePageRoute } from '@product/features/workspace';

export default function ComponentTree() {
  const activePageRoute = useSelector(selectActivePageRoute);
  const pageName = useSelector(selectPageName(activePageRoute));
  const rootComponentId = useSelector(selectPageRootComponentId(activePageRoute));

  return (
    <Flex.Column gridGap="12px" padding="12px" flexGrow fullWidth>
      <Typography
        fontStyle="extraBold"
        fontSize="12px"
        fg={(colors) => colors.purple[500]}
      >
        {pageName} Components
      </Typography>
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
