import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import {
  PAGE_SETTINGS,
  SETTING_LABELS,
  SITE_SETTINGS,
} from '@product/constants/inheritance';
import {
  selectComponentPropertyInheritedFromForLanguage,
  setComponentInheritedFrom,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import useGetSetting from '@product/hooks/useGetSetting';
import isDefined from '@product/utils/isDefined';
import pullTranslatedValue from '@product/utils/pullTranslatedValue';

export default function PropertyInheritance(props) {
  const { language, property, fieldId } = props;

  const propertyId = get(property, 'id');
  const isTranslatable = get(property, 'isTranslatable', false);

  const dispatch = useDispatch();
  const { setFieldValue } = useFormField(fieldId);

  const { activePageRoute, activeComponentId } = useActiveWorkspaceComponent();

  const inheritedFrom = useSelector(selectComponentPropertyInheritedFromForLanguage(
    activePageRoute,
    activeComponentId,
    propertyId,
    language,
  ));

  const getPropertyValue = useGetPropertyValue(activePageRoute, activeComponentId);
  const getSetting = useGetSetting(activePageRoute);

  const inheritFromSetting = get(property, 'inheritFromSetting', null);

  function isSettingDefined(level) {
    const setting = getSetting(level, inheritFromSetting, null);
    return isDefined(isTranslatable ? pullTranslatedValue(setting, language) : setting);
  }

  // TODO: Deep link to the setting menu
  if (isDefined(inheritedFrom)) {
    const label = SETTING_LABELS[inheritedFrom];

    return (
      <Flex.Row align="center" gridGap="2px" paddingRight="12px">
        <Tooltip copy="Remove settings reference" point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            onClick={(event) => {
              event.preventDefault();
              setFieldValue(getPropertyValue(propertyId, language));
            }}
            IconComponent={Icons.RemoveFill}
            width={18}
            height={18}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.mono[900]}
            aria-label="Remove settings reference"
          />
        </Tooltip>
        <Typography
          fontStyle="light"
          fontSize="12px"
          fg={(colors) => colors.mono[600]}
        >
          Inherited from{' '}
          <Typography
            as="a"
            fontStyle="regular"
            fontSize="12px"
            fg={(colors) => colors.blue[400]}
            hoverFg={(colors) => colors.blue[700]}
          >
            {label}
          </Typography>
        </Typography>
      </Flex.Row>
    );
  }

  function onClick(value) {
    return function _onClick(event) {
      event.preventDefault();

      dispatch(setComponentInheritedFrom({
        route: activePageRoute,
        componentId: activeComponentId,
        propertyId,
        value: value,
        language,
      }));
    }
  }

  return (
    <Flex.Row align="center" gridGap="6px">
      {isSettingDefined(PAGE_SETTINGS) && (
        <InheritanceButton
          aria-label={`Reference the ${SETTING_LABELS[PAGE_SETTINGS]} value`}
          onClick={onClick(PAGE_SETTINGS)}
        >
          {SETTING_LABELS[PAGE_SETTINGS]}
        </InheritanceButton>
      )}
      {isSettingDefined(SITE_SETTINGS) && (
        <InheritanceButton
          aria-label={`Reference the ${SETTING_LABELS[SITE_SETTINGS]} value`}
          onClick={onClick(SITE_SETTINGS)}
        >
          {SETTING_LABELS[SITE_SETTINGS]}
        </InheritanceButton>
      )}
    </Flex.Row>
  );
}

const InheritanceButton = styled.button`
  ${(props) => props.theme.fonts.main.regular}
  font-size: 12px;
  color: ${(props) => props.theme.colors.blue[400]};

  cursor: pointer;

  background: none;
  border: none;
  margin: 0;
  padding: 0;

  &:hover {
    color: ${(props) => props.theme.colors.blue[700]};
  }
`;
