import React from 'react';
import WorkspaceMenuAccordion from '@editor/components/Workspace/Menu/Accordion';
import WorkspaceMenuSettings from '@editor/components/Workspace/Menu/Settings';
import {
  selectSiteSettings,
  setSiteSetting,
} from '@editor/features/assembly';

export default function SiteSettings(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  return (
    <WorkspaceMenuAccordion
      title="Site Settings"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <WorkspaceMenuSettings
        formName="site"
        getter={selectSiteSettings}
        setter={setSiteSetting}
      />
    </WorkspaceMenuAccordion>
  );
}
