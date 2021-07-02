import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Tooltip,
} from 'pkg.admin-components';
import {
  selectComponentPropertyStorage,
  setComponentInstancePropertyStorage,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function Toggle(props) {
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
    setFieldValue,
    value,
  } = field;

  const toggleProps = {
    labelledby: `${propertyId}-${Languages.US_ENGLISH_LANG}`,
    value: value,
    setValue: setFieldValue,
    isDisabled: !!inheritedFrom,
  };

  if (!!inheritedFrom) {
    return (
      <Flex.Row
        align="center"
        justify="space-between"
        gridGap="6px"
      >
        <Inputs.Toggle {...toggleProps} />
        <Tooltip copy="Remove settings reference" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            onClick={() => {
              const value = pullTranslatedValue(
                getSetting(inheritedFrom, get(property, 'inheritFromSetting')),
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

  return (
    <Inputs.Toggle {...toggleProps} />
  );
}
