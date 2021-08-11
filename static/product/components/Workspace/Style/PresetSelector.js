import React from 'react';
import Select from 'react-select';
import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  detachPreset,
  importStyle,
  selectComponentStyleInheritsFrom,
  selectPresetsOfTypeSortedAsArray,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

const CUSTOM_OPTION = {
  label: 'Custom style',
  value: 'CUSTOM_OPTION',
};

export default function PresetSelector(props) {
  const {
    styleId,
    styleType,
  } = props;

  const dispatch = useDispatch();

  const { activePageRoute, activeComponentId } = useActiveWorkspaceComponent();

  const availableStyles = useSelector(selectPresetsOfTypeSortedAsArray(styleType));
  const inheritsFromPreset = useSelector(selectComponentStyleInheritsFrom(activePageRoute, activeComponentId, styleId));

  const availableStylesAsOptions = availableStyles.map((style) => ({
    value: style.id,
    label: style.name,
  }));

  const selectorValue = find(availableStylesAsOptions, { value: inheritsFromPreset })
    || CUSTOM_OPTION;

  function onChange({ value }) {
    if (value === CUSTOM_OPTION.value) {
      dispatch(detachPreset({
        route: activePageRoute,
        componentId: activeComponentId,
        styleId,
      }));

      return;
    }

    dispatch(importStyle({
      route: activePageRoute,
      componentId: activeComponentId,
      styleId,
      presetId: value,
    }));
  }

  return (
    <Select
      value={selectorValue}
      isDisabled={!availableStylesAsOptions.length}
      options={[CUSTOM_OPTION, ...availableStylesAsOptions]}
      onChange={onChange}
    />
  );
}
