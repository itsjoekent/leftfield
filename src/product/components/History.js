import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
} from 'pkg.admin-components';
import {
  undo,
  redo,
  selectHasUndo,
  selectHasRedo,
} from '@product/features/assembly';

export default function History() {
  const dispatch = useDispatch();

  const hasUndo = useSelector(selectHasUndo);
  const hasRedo = useSelector(selectHasRedo);

  return (
    <Flex.Row align="center" gridGap="6px">
      <Tooltip copy="Undo" point={Tooltip.UP_RIGHT_ALIGNED}>
        <Buttons.IconButton
          IconComponent={Icons.RefundBack}
          color={(colors) => hasUndo ? colors.mono[500] : colors.mono[400]}
          hoverColor={(colors) => hasUndo ? colors.blue[500] : colors.mono[400]}
          aria-label="Undo"
          onClick={() => hasUndo && dispatch(undo())}
        />
      </Tooltip>
      <Tooltip copy="Redo" point={Tooltip.UP_RIGHT_ALIGNED}>
        <Buttons.IconButton
          IconComponent={Icons.RefundForward}
          color={(colors) => hasRedo ? colors.mono[500] : colors.mono[400]}
          hoverColor={(colors) => hasRedo ? colors.blue[500] : colors.mono[400]}
          aria-label="Redo"
          onClick={() => hasRedo && dispatch(redo())}
        />
      </Tooltip>
    </Flex.Row>
  );
}
