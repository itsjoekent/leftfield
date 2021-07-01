import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Icons,
  Flex,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import {
  selectComponentPropertyStorage,
  setComponentInstancePropertyStorage,
  setComponentInstancePropertyValue,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';

export default function ShortText(props) {
  const {
    inputProps,
    property,
  } = props;

  const propertyId = get(property, 'id');

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();
  const getSetting = useGetSetting(activePageId);

  const inheritedFrom = useSelector(selectComponentPropertyStorage(
    activePageId,
    activeComponentId,
    propertyId,
    'inheritedFrom',
  ));

  const dispatch = useDispatch();

  if (!!inheritedFrom) {
    return (
      <Flex.Row
        fullWidth
        justify="space-between"
        align="center"
        padding="6px"
        rounded={(radius) => radius.default}
        borderWidth="1px"
        borderColor={(colors) => colors.mono[300]}
        bg={(colors) => colors.mono[200]}
      >
        <Typography
          fontStyle="regular"
          fontSize="16px"
          fg={(colors) => colors.mono[800]}
        >
          {getSetting(inheritedFrom, get(property, 'inheritFromSetting'))}
        </Typography>
        <Tooltip copy="Remove settings reference" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            onClick={() => {
              const value = getSetting(inheritedFrom, get(property, 'inheritFromSetting'));

              dispatch(setComponentInstancePropertyStorage({
                pageId: activePageId,
                componentId: activeComponentId,
                propertyId,
                key: 'inheritedFrom',
                value: null,
              }));

              dispatch(setComponentInstancePropertyValue({
                pageId: activePageId,
                componentId: activeComponentId,
                propertyId,
                value,
              }));
            }}
            IconComponent={Icons.RemoveFill}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.mono[900]}
            aria-label="Remove settings reference"
          />
        </Tooltip>
      </Flex.Row>
    );
  }

  return (
    <input {...inputProps} />
  );
}
