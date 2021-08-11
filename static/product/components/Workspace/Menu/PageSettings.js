import React from 'react';
import { Settings } from 'pkg.campaign-components';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuSettings from '@product/components/Workspace/Menu/Settings';
import {
  selectPageSettings,
  setPageSetting,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function PageSettings(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  const { activePageRoute } = useActiveWorkspaceComponent();

  return (
    <WorkspaceMenuAccordion
      title="Page Settings"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <WorkspaceMenuSettings
        formName="page"
        getter={selectPageSettings(activePageRoute)}
        setter={(payload) => setPageSetting({
          ...payload,
          route: activePageRoute,
        })}
        settings={Settings.PageSettings}
      />
    </WorkspaceMenuAccordion>
  );
}
