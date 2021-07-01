import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Typography } from 'pkg.admin-components';
import {
  SITE_SETTINGS,
  TEMPLATE_SETTINGS,
  PAGE_SETTINGS,
  SETTING_LABELS,
} from '@editor/constants/inheritance';
import {
  selectComponentPropertyStorage,
  selectPageTemplateId,
  setComponentInstancePropertyStorage,
  setComponentInstancePropertyValue,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function PropertyInheritance(props) {
  const { language, property } = props;

  const propertyId = get(property, 'id');
  const isTranslatable = get(property, 'isTranslatable', false);

  const dispatch = useDispatch();

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const templatedFrom = useSelector(selectPageTemplateId(activePageId));
  const hasTemplate = !!templatedFrom;

  const inheritedFrom = useSelector(selectComponentPropertyStorage(
    activePageId,
    activeComponentId,
    propertyId,
    'inheritedFrom',
    language,
  ));

  const getSetting = useGetSetting(activePageId);
  const inheritFromSetting = get(property, 'inheritFromSetting', null);

  function isSettingDefined(level) {
    const setting = getSetting(level, inheritFromSetting, null);
    return (isTranslatable ? pullTranslatedValue(setting, language) : setting) !== null;
  }

  // TODO: Deep link to the setting menu
  if (!!inheritedFrom) {
    return (
      <Flex.Row align="center">
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
            {SETTING_LABELS[inheritedFrom]}
          </Typography>
        </Typography>
      </Flex.Row>
    );
  }

  function onClick(value) {
    return function _onClick(event) {
      event.preventDefault();

      dispatch(setComponentInstancePropertyValue({
        pageId: activePageId,
        componentId: activeComponentId,
        propertyId,
        value: null,
      }));

      dispatch(setComponentInstancePropertyStorage({
        pageId: activePageId,
        componentId: activeComponentId,
        propertyId,
        key: 'inheritedFrom',
        value: value,
        language,
      }));
    }
  }

  return (
    <Flex.Row align="center" gridGap="6px">
      {isSettingDefined(SITE_SETTINGS) && (
        <InheritanceButton
          aria-label={`Reference the ${SETTING_LABELS[SITE_SETTINGS]} value`}
          onClick={onClick(SITE_SETTINGS)}
        >
          {SETTING_LABELS[SITE_SETTINGS]}
        </InheritanceButton>
      )}
      {!!hasTemplate && isSettingDefined(TEMPLATE_SETTINGS) && (
        <InheritanceButton
          aria-label={`Reference the ${SETTING_LABELS[TEMPLATE_SETTINGS]} value`}
          onClick={onClick(TEMPLATE_SETTINGS)}
        >
          {SETTING_LABELS[TEMPLATE_SETTINGS]}
        </InheritanceButton>
      )}
      {isSettingDefined(PAGE_SETTINGS) && (
        <InheritanceButton
          aria-label={`Reference the ${SETTING_LABELS[PAGE_SETTINGS]} value`}
          onClick={onClick(PAGE_SETTINGS)}
        >
          {SETTING_LABELS[PAGE_SETTINGS]}
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