import React from 'react';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuThemeColorList from '@product/components/Workspace/Menu/Theme/ColorList';

export default function Theme(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  return (
    <WorkspaceMenuAccordion
      title="Campaign Theme"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <WorkspaceMenuThemeColorList />
    </WorkspaceMenuAccordion>
  );
}
