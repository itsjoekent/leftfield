import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import {
  deleteComponentAndDescendants,
  selectComponentName,
  selectPageRootComponentId,
} from '@product/features/assembly';
import { setModal, CONFIRM_MODAL } from '@product/features/modal';
import {
  selectIsComponentTreeOpen,
  selectHasPast,
  selectHasFuture,
  setIsComponentTreeOpen,
  navigateToPast,
  navigateToFuture,
} from '@product/features/workspace';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function WorkspaceComponentToolbar() {
  const {
    activePageRoute,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const activeComponentName = useSelector(
    selectComponentName(activePageRoute, activeComponentId)
  );

  const activePageRootComponentId = useSelector(
    selectPageRootComponentId(activePageRoute)
  );

  const isComponentTreeOpen = useSelector(selectIsComponentTreeOpen);
  const componentTreeLabel = `${isComponentTreeOpen ? 'Close' : 'Open'} Component tree`;

  const canNavigateBackwards = useSelector(selectHasPast);
  const canNavigateForwards = useSelector(selectHasFuture);

  const dispatch = useDispatch();

  const isRootComponent = activePageRootComponentId === activeComponentId;

  return (
    <Flex.Row
      align="center"
      justify="space-between"
      padding="12px"
      gridGap="6px"
      bg={(colors) => colors.purple[100]}
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
      {!isRootComponent && (
        <Tooltip copy="Remove component" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.Trash}
            color={(colors) => colors.purple[500]}
            hoverColor={(colors) => colors.red[600]}
            aria-label="Remove component"
            onClick={() => dispatch(setModal({
              type: CONFIRM_MODAL,
              props: {
                title: 'Confirm deletion',
                header: 'Are you sure you want to delete this component?',
                confirmButtonLabel: 'Delete component',
                confirmButtonIconName: 'Trash',
                isDangerous: true,
                onConfirm: () => dispatch(deleteComponentAndDescendants({
                  route: activePageRoute,
                  componentId: activeComponentId,
                })),
              },
            }))}
          />
        </Tooltip>
      )}
    </Flex.Row>
  );
}
