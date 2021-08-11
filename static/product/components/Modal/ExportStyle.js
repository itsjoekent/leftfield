import React from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { exportStyle, setMetaValue } from '@product/features/assembly';
import { closeModal } from '@product/features/modal';

export default function ExportStyleModal(props) {
  const {
    route,
    componentId,
    styleId,
    styleType,
  } = props;

  const dispatch = useDispatch();

  const [styleName, setStyleName] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  function onChange(event) {
    const { target: { value } } = event;
    setStyleName(event.target.value);

    if (showError && value.length) {
      setShowError(false);
    }
  }

  function onAddStyle() {
    if (!styleName.length) {
      setShowError(true);
      return;
    }

    dispatch(closeModal());

    const presetId = uuid();

    dispatch(exportStyle({
      route,
      componentId,
      presetId,
      styleId,
      styleType,
      styleName,
    }));

    dispatch(setMetaValue({
      item: presetId,
      op: '$PUSH',
      path: `presetSortOrder.${styleType}`,
    }));
  }

  return (
    <ModalDefaultLayout title="Export A Style" width="400px">
      <Flex.Column
        gridGap="32px"
        padding="12px"
        bg={(colors) => colors.mono[100]}
      >
        <Flex.Column gridGap="16px">
          <Flex.Column gridGap="4px">
            <Typography
              fontStyle="medium"
              fontSize="18px"
              fg={(colors) => colors.mono[900]}
              lineHeight="1.3"
            >
              Export a new style
            </Typography>
            <Typography
              fontStyle="regular"
              fontSize="14px"
              fg={(colors) => colors.mono[600]}
              lineHeight="1.3"
            >
              Use a clear, descriptive name so it's easy to understand what this style is meant for (eg: "Red Donate Button").
            </Typography>
          </Flex.Column>
          <Flex.Column gridGap="2px">
            <Typography
              fontStyle="bold"
              fontSize="14px"
              letterSpacing="2%"
              fg={(colors) => colors.mono[700]}
              htmlFor="style-name-input"
              as="label"
            >
              Style name
            </Typography>
            <Inputs.DefaultText
              id="style-name-input"
              value={styleName}
              onChange={onChange}
            />
            {showError && (
              <Typography
                fontStyle="regular"
                fontSize="14px"
                fg={(colors) => colors.red[500]}
              >
                Style name is required
              </Typography>
            )}
          </Flex.Column>
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
              Cancel
            </Typography>
          </Buttons.Text>
          <Buttons.Filled
            paddingVertical="4px"
            paddingHorizontal="8px"
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => colors.blue[500]}
            hoverButtonBg={(colors) => colors.blue[700]}
            onClick={onAddStyle}
          >
            <Typography
              fontStyle="bold"
              fontSize="16px"
            >
              Add Style
            </Typography>
          </Buttons.Filled>
        </Flex.Row>
      </Flex.Column>
    </ModalDefaultLayout>
  )
}
