import React from 'react';
import { get } from 'lodash';
import { PropertyTypes } from 'pkg.campaign-components';
import WorkspaceStyleColorPicker from '@editor/components/Workspace/Style/ColorPicker';
import WorkspaceStyleNumberRange from '@editor/components/Workspace/Style/NumberRange';
import WorkspaceStyleSelector from '@editor/components/Workspace/Style/Selector';

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

    default: return null;
  }
}
