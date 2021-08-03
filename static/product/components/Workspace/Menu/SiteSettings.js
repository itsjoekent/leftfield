import React from 'react';
import { Settings } from 'pkg.campaign-components';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuSettings from '@product/components/Workspace/Menu/Settings';
import {
  selectSiteSettings,
  setSiteSetting,
} from '@product/features/assembly';

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
        settings={Settings.SiteSettings}
      />
    </WorkspaceMenuAccordion>
  );
}
