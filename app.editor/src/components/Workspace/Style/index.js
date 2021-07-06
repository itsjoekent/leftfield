import React from 'react';
import { find, get } from 'lodash';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function Style(props) {
  const { styleId } = props;

  const {
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const style = find(get(activeComponentMeta, 'styles'), { id: styleId });
  console.log(style);

  return null;
}
