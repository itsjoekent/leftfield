import React from 'react';
import WorkspaceMenuAccordion from '@editor/components/Workspace/Menu/Accordion';
import WorkspaceMenuSettings from '@editor/components/Workspace/Menu/Settings';
import {
  selectPageSettings,
  setPageSetting,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function PageSettings(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  const { activePageId } = useActiveWorkspaceComponent();

  return (
    <WorkspaceMenuAccordion
      title="Page Settings"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <WorkspaceMenuSettings
        formName="page"
        getter={selectPageSettings(activePageId)}
        setter={(payload) => setPageSetting({
          ...payload,
          pageId: activePageId,
        })}
      />
    </WorkspaceMenuAccordion>
  );
}
