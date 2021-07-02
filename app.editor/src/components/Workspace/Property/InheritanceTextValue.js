import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import { setComponentInstancePropertyStorage } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function InheritanceTextValue(props) {
  const {
    inheritedFrom,
    inheritFromSetting,
    language,
    propertyId,
    setFieldValue,
  } = props;

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();
  const getSetting = useGetSetting(activePageId);

  const dispatch = useDispatch();

  return (
    <Flex.Row
      fullWidth
      justify="space-between"
      align="center"
      padding="6px"
      gridGap="6px"
      rounded={(radius) => radius.default}
      borderWidth="1px"
      borderColor={(colors) => colors.mono[300]}
      bg={(colors) => colors.mono[200]}
    >
      <Typography
        fontStyle="regular"
        fontSize="16px"
        fg={(colors) => colors.mono[800]}
        whiteSpace="nowrap"
        overflowX="scroll"
      >
        {pullTranslatedValue(
          getSetting(inheritedFrom, inheritFromSetting),
          language,
          '',
        )}
      </Typography>
      <Tooltip copy="Remove settings reference" point={Tooltip.UP_RIGHT_ALIGNED}>
        <Buttons.IconButton
          onClick={() => {
            const value = pullTranslatedValue(
              getSetting(inheritedFrom, inheritFromSetting),
              language,
            );

            dispatch(setComponentInstancePropertyStorage({
              pageId: activePageId,
              componentId: activeComponentId,
              propertyId,
              key: 'inheritedFrom',
              value: null,
              language,
            }));

            setFieldValue(value);
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
