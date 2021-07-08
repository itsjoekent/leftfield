import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Flex, Typography } from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
import {
  selectComponentStyleAttributeForDeviceCascading,
  setComponentInstanceCustomStyle,
} from '@editor/features/assembly';
import { selectDeviceSize } from '@editor/features/previewMode';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function NumberRange(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const device = useSelector(selectDeviceSize);

  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const customValue = get(attributeValue, 'custom', 0);

  function onChange(event) {
    const { target: { value } } = event;

    dispatch(setComponentInstanceCustomStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value: parseFloat(value),
    }));
  }

  return (
    <NumberRangeWrapper align="center" gridGap="6px" fullWidth>
      <input
        type="range"
        min={get(attribute, 'min', 0)}
        max={get(attribute, 'max', 1)}
        value={customValue}
        step={get(attribute, 'incrementBy', 1)}
        onChange={onChange}
      />
      <ValueColumn>
        <Typography
          fontStyle="regular"
          fontSize="12px"
          fg={(colors) => colors.mono[700]}
        >
          {customValue}
        </Typography>
      </ValueColumn>
    </NumberRangeWrapper>
  );
}

const NumberRangeWrapper = styled(Flex.Row)`
  input {
    flex-grow: 1;
  }
`;

const ValueColumn = styled.div`
  flex: 0 0 10%;
`;
