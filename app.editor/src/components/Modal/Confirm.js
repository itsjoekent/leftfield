import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import ModalDefaultLayout from '@editor/components/Modal/DefaultLayout';
import { closeModal } from '@editor/features/modal';

export default function ConfirmModal(props) {
  const {
    title = 'Confirmation',
    header = 'Are you sure?',
    confirmButtonLabel = 'Confirm',
    cancelButtonLabel = 'Cancel',
    confirmButtonIconName = null,
    isDangerous = false,
    onConfirm = () => {},
  } = props;

  const dispatch = useDispatch();

  function onConfirmWrapper() {
    dispatch(closeModal());
    onConfirm();
  }

  return (
    <ModalDefaultLayout title={title} width="400px">
      <Flex.Column
        gridGap="32px"
        padding="12px"
        bg={(colors) => colors.mono[100]}
      >
        <Typography
          fontStyle="regular"
          fontSize="18px"
          fg={(colors) => colors.mono[700]}
          lineHeight="1.3"
        >
          {header}
        </Typography>
        <Flex.Row
          fullWidth
          align="center"
          justify="flex-end"
          gridGap="6px"
        >
          <Buttons.Text
            paddingVertical="4px"
            paddingHorizontal="8px"
            buttonFg={(colors) => colors.mono[500]}
            hoverButtonFg={(colors) => colors.mono[900]}
            onClick={() => dispatch(closeModal())}
          >
            <Typography
              fontStyle="bold"
              fontSize="16px"
            >
              {cancelButtonLabel}
            </Typography>
          </Buttons.Text>
          <Buttons.Filled
            IconComponent={confirmButtonIconName && Icons[confirmButtonIconName]}
            gridGap="4px"
            paddingVertical="4px"
            paddingHorizontal="8px"
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => isDangerous ? colors.red[500] : colors.blue[500]}
            borderWidth="2px"
            onClick={onConfirmWrapper}
          >
            <Typography
              fontStyle="bold"
              fontSize="16px"
            >
              {confirmButtonLabel}
            </Typography>
          </Buttons.Filled>
        </Flex.Row>
      </Flex.Column>
    </ModalDefaultLayout>
  )
}
