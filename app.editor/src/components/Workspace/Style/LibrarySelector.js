import React from 'react';
import Select from 'react-select';
import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  detachStyleReference,
  importStyle,
  selectComponentStyleInheritsFrom,
  selectStyleLibrary,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

const CUSTOM_OPTION = {
  label: 'Custom style',
  value: 'CUSTOM_OPTION',
};

export default function LibrarySelector(props) {
  const {
    styleId,
    styleType,
  } = props;

  const dispatch = useDispatch();

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const styleLibrary = useSelector(selectStyleLibrary);
  const inheritsFromStyle = useSelector(selectComponentStyleInheritsFrom(activePageId, activeComponentId, styleId));

  const availableStyles = Object.keys(styleLibrary).reduce((acc, styleId) => {
    const style = styleLibrary[styleId];
    if (styleType !== style.type) {
      return acc;
    }

    return [
      ...acc,
      style,
    ];
  }, []);

  const availableStylesAsOptions = availableStyles.map((style) => ({
    value: style.id,
    label: style.name,
  }));

  const selectorValue = find(availableStylesAsOptions, { value: inheritsFromStyle })
    || CUSTOM_OPTION;

  function onChange({ value }) {
    if (value === CUSTOM_OPTION.value) {
      dispatch(detachStyleReference({
        pageId: activePageId,
        componentId: activeComponentId,
        styleId,
      }));

      return;
    }

    dispatch(importStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      libraryStyleId: value,
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
