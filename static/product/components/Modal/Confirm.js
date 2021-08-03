import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { closeModal } from '@product/features/modal';

export default function ConfirmModal(props) {
  const {
    title = 'Confirmation',
    header = 'Are you sure?',
    subheader = '',
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
        <Flex.Column gridGap="6px">
          <Typography
            fontStyle="regular"
            fontSize="18px"
            fg={(colors) => colors.mono[700]}
            lineHeight="1.3"
          >
            {header}
          </Typography>
          {subheader && (
            <Typography
              fontStyle="regular"
              fontSize="16px"
              fg={(colors) => colors.mono[600]}
            >
              {subheader}
            </Typography>
          )}
        </Flex.Column>
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
            hoverButtonBg={(colors) => isDangerous ? colors.red[700] : colors.blue[700]}
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
