import React from 'react';
import { get } from 'lodash';
import { PropertyTypes } from 'pkg.campaign-components';
import WorkspaceStyleColorPicker from '@product/components/Workspace/Style/ColorPicker';
import WorkspaceStyleNumberRange from '@product/components/Workspace/Style/NumberRange';
import WorkspaceStyleSelector from '@product/components/Workspace/Style/Selector';
import WorkspaceStyleToggle from '@product/components/Workspace/Style/Toggle';

export default function Attribute(props) {
  const {
    styleId,
    attribute,
  } = props;

  switch (get(attribute, 'type')) {
    case PropertyTypes.COLOR_TYPE: return (
      <WorkspaceStyleColorPicker
        styleId={styleId}
        attribute={attribute}
      />
    );

    case PropertyTypes.NUMBER_RANGE_TYPE: return (
      <WorkspaceStyleNumberRange
        styleId={styleId}
        attribute={attribute}
      />
    );

    case PropertyTypes.SELECT_TYPE: return (
      <WorkspaceStyleSelector
        styleId={styleId}
        attribute={attribute}
      />
    );

    case PropertyTypes.TOGGLE_TYPE: return (
      <WorkspaceStyleToggle
        styleId={styleId}
        attribute={attribute}
      />
    );

    default: return null;
  }
}
