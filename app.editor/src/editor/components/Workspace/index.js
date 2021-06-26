import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Buttons, Flex, Icons, useAdminTheme } from 'pkg.admin-components';
import WorkspaceComponentToolbar from '@editor/components/Workspace/ComponentToolbar';
import WorkspaceDocumentationSection from '@editor/components/Workspace/DocumentationSection';
import WorkspaceFeedbackSection from '@editor/components/Workspace/FeedbackSection';
import WorkspacePageNavigation from '@editor/components/Workspace/PageNavigation';
import WorkspacePropertiesSection from '@editor/components/Workspace/PropertiesSection';
import WorkspaceSection from '@editor/components/Workspace/Section';
import WorkspaceSlotsSection from '@editor/components/Workspace/SlotsSection';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import {
  PROPERTIES_TAB,
  SLOTS_TAB,
  DOCUMENTATION_TAB,
  FEEDBACK_TAB,

  selectTab,
  setTab,
} from '@editor/features/workspace';

export default function Workspace(props) {
  const theme = useAdminTheme();
  const { activeComponentMeta } = useActiveWorkspaceComponent();
  const tab = useSelector(selectTab);

  const dispatch = useDispatch();

  const activeComponentHasProperties = !!Object.keys(get(activeComponentMeta, 'properties', {})).length;
  const activeComponentHasSlots = !!get(activeComponentMeta, 'slots', []).length;
  const activeComponentHasDocumentation = !!get(activeComponentMeta, 'documentation', '').length;

  React.useEffect(() => {
    const tabAvailability = {
      [PROPERTIES_TAB]: activeComponentHasProperties,
      [SLOTS_TAB]: activeComponentHasSlots,
      [DOCUMENTATION_TAB]: activeComponentHasDocumentation,
      [FEEDBACK_TAB]: true,
    };

    if (!tabAvailability[tab]) {
      const nextIndex = Object.values(tabAvailability).findIndex((isAvailable) => !!isAvailable);
      dispatch(setTab(Object.keys(tabAvailability)[nextIndex]));
    }
  }, [
    dispatch,
    tab,
    activeComponentHasProperties,
    activeComponentHasSlots,
    activeComponentHasDocumentation,
  ]);

  function isActiveTab(key) {
    return tab === key;
  }

  function iconButtonColor(key) {
    return theme.colors.mono[isActiveTab(key) ? 700 : 300];
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <WorkspaceContainer fullWidth fullHeight as="article">
        <WorkspacePageNavigation />
        <WorkspaceComponentToolbar />
        <InnerWorkspaceContainer flexGrow justifyContent="space-between" gridGap="36px">
          <Flex.Column fullHeight gridGap="12px">
            {activeComponentHasProperties && (
              <Buttons.IconButton
                aria-label="Edit component properties"
                onClick={() => dispatch(setTab(PROPERTIES_TAB))}
                color={iconButtonColor(PROPERTIES_TAB)}
                hoverColor={theme.colors.mono[500]}
                IconComponent={Icons.SettingFill}
                tooltipProps={{
                  message: 'Properties',
                  point: 'left',
                }}
              />
            )}
            {activeComponentHasSlots && (
              <Buttons.IconButton
                aria-label="Edit component slots"
                onClick={() => dispatch(setTab(SLOTS_TAB))}
                color={iconButtonColor(SLOTS_TAB)}
                hoverColor={theme.colors.mono[500]}
                IconComponent={Icons.MenuAlt}
                tooltipProps={{
                  message: 'Slots',
                  point: 'left',
                }}
              />
            )}
            {activeComponentHasDocumentation && (
              <Buttons.IconButton
                aria-label="Read component documentation"
                onClick={() => dispatch(setTab(DOCUMENTATION_TAB))}
                color={iconButtonColor(DOCUMENTATION_TAB)}
                hoverColor={theme.colors.mono[500]}
                IconComponent={Icons.QuestionFill}
                tooltipProps={{
                  message: 'Documentation',
                  point: 'left',
                }}
              />
            )}
            <Buttons.IconButton
              aria-label="Submit component feedback or bugs"
              onClick={() => dispatch(setTab(FEEDBACK_TAB))}
              color={iconButtonColor(FEEDBACK_TAB)}
              hoverColor={theme.colors.mono[500]}
              IconComponent={Icons.Bug}
              tooltipProps={{
                message: 'Feedback',
                point: 'left',
              }}
            />
          </Flex.Column>
          <Flex.Column overflowY="scroll" gridGap="32px" fullWidth>
            {isActiveTab(PROPERTIES_TAB) && (
              <WorkspaceSection name="Properties">
                <WorkspacePropertiesSection />
              </WorkspaceSection>
            )}
            {isActiveTab(SLOTS_TAB) && (
              <WorkspaceSection name="Slots">
                <WorkspaceSlotsSection />
              </WorkspaceSection>
            )}
            {isActiveTab(DOCUMENTATION_TAB) && (
              <WorkspaceSection name="Documentation">
                <WorkspaceDocumentationSection />
              </WorkspaceSection>
            )}
            {isActiveTab(FEEDBACK_TAB) && (
              <WorkspaceSection name="Feedback">
                <WorkspaceFeedbackSection />
              </WorkspaceSection>
            )}
          </Flex.Column>
        </InnerWorkspaceContainer>
      </WorkspaceContainer>
    </DndProvider>
  );
}

const WorkspaceContainer = styled(Flex.Column)`
  position: relative;
  background-color: ${(props) => props.theme.colors.mono[100]};
  ${(props) => props.theme.shadow.light}
`;

const InnerWorkspaceContainer = styled(Flex.Row)`
  padding: 12px;
  padding-bottom: 0;
`;
