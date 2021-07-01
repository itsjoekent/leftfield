import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import {
  Buttons,
  Icons,
  Inputs,
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
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function ShortText(props) {
  const { fieldId, language, property } = props;
  const propertyId = get(property, 'id');

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();
  const getSetting = useGetSetting(activePageId);

  const inheritedFrom = useSelector(selectComponentPropertyStorage(
    activePageId,
    activeComponentId,
    propertyId,
    'inheritedFrom',
    language,
  ));

  const dispatch = useDispatch();

  const field = useFormField(fieldId);

  if (!field) {
    return null;
  }

  const {
    inputProps,
    inputStylingProps,
  } = field;

  if (!!inheritedFrom) {
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
            getSetting(inheritedFrom, get(property, 'inheritFromSetting')),
            language,
            '',
          )}
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
                language,
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

  const finalInputProps = {
    ...inputProps,
  };

  if (language !== Languages.US_ENGLISH_LANG) {
    finalInputProps['aria-labelledby'] = `${propertyId}-${Languages.US_ENGLISH_LANG}`;
  }

  return (
    <Inputs.DefaultText {...finalInputProps} {...inputStylingProps} />
  );
}
