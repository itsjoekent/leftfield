import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import { selectComponentName } from '@editor/features/assembly';
import {
  selectIsComponentTreeOpen,
  selectHasPast,
  selectHasFuture,
  setIsComponentTreeOpen,
  navigateToPast,
  navigateToFuture,
} from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function WorkspaceComponentToolbar() {
  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const activeComponentName = useSelector(
    selectComponentName(activePageId, activeComponentId)
  );

  const isComponentTreeOpen = useSelector(selectIsComponentTreeOpen);
  const componentTreeLabel = `${isComponentTreeOpen ? 'Close' : 'Open'} Component tree`;

  const canNavigateBackwards = useSelector(selectHasPast);
  const canNavigateForwards = useSelector(selectHasFuture);

  const dispatch = useDispatch();

  return (
    <Flex.Row
      align="center"
      justify="space-between"
      bg={(colors) => colors.purple[100]}
      paddingVertical="6px"
      paddingHorizontal="12px"
    >
      <Flex.Row align="center" gridGap="6px" minWidth="0" paddingRight="12px">
        <Tooltip copy="Go back" point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.ArrowLeft}
            color={(colors) => colors.purple[canNavigateBackwards ? 500 : 200]}
            hoverColor={(colors) => colors.purple[canNavigateBackwards ? 800 : 200]}
            aria-label="Go back"
            disabled={!canNavigateBackwards}
            onClick={() => canNavigateBackwards && dispatch(navigateToPast())}
          />
        </Tooltip>
        <Tooltip copy="Go forward" point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.ArrowRight}
            color={(colors) => colors.purple[canNavigateForwards ? 500 : 200]}
            hoverColor={(colors) => colors.purple[canNavigateForwards ? 800 : 200]}
            aria-label="Go forward"
            disabled={!canNavigateForwards}
            onClick={() => canNavigateForwards && dispatch(navigateToFuture())}
          />
        </Tooltip>
        <Tooltip copy={componentTreeLabel} point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.Layers}
            color={(colors) => colors.purple[500]}
            hoverColor={(colors) => colors.purple[800]}
            aria-label={componentTreeLabel}
            onClick={() => dispatch(setIsComponentTreeOpen(!isComponentTreeOpen))}
          />
        </Tooltip>
        <Typography
          fontStyle="bold"
          fontSize="16px"
          fg={(colors) => colors.purple[700]}
          letterSpacing="2%"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {activeComponentName}
        </Typography>
        <Tooltip copy="Edit component name" point={Tooltip.UP}>
          <Buttons.IconButton
            IconComponent={Icons.EditFill}
            width={16}
            height={16}
            color={(colors) => colors.purple[700]}
            hoverColor={(colors) => colors.purple[500]}
            aria-label="Edit component name"
          />
        </Tooltip>
      </Flex.Row>
      <Flex.Row align="center" gridGap="6px">
        <Tooltip copy="Copy component" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.Copy}
            color={(colors) => colors.purple[500]}
            hoverColor={(colors) => colors.mono[900]}
            aria-label="Copy component"
          />
        </Tooltip>
        <Tooltip copy="Paste component" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.DeskAlt}
            color={(colors) => colors.purple[500]}
            hoverColor={(colors) => colors.mono[900]}
            aria-label="Paste component"
          />
        </Tooltip>
        <Tooltip copy="Remove component" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.Trash}
            color={(colors) => colors.purple[500]}
            hoverColor={(colors) => colors.red[600]}
            aria-label="Remove component"
          />
        </Tooltip>
      </Flex.Row>
    </Flex.Row>
  );
}
