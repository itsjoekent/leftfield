import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import WorkspacePropertiesForm from '@editor/components/Workspace/Property/Form';
import { selectPage } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function WorkspacePropertiesSection() {
  const {
    activePageId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const activePage = useSelector(selectPage(activePageId));
  const properties = get(activeComponentMeta, 'properties', {});

  return (
    <WorkspacePropertiesForm
      fields={Object.values(properties)}
      page={activePage}
    />
  );
}
