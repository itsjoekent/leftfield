import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
} from 'pkg.admin-components';
import WorkspaceComponentToolbar from '@editor/components/Workspace/ComponentToolbar';
import WorkspaceComponentTree from '@editor/components/Workspace/ComponentTree';
import WorkspaceDocumentationSection from '@editor/components/Workspace/DocumentationSection';
import WorkspaceFeedbackSection from '@editor/components/Workspace/FeedbackSection';
import WorkspaceMenu from '@editor/components/Workspace/Menu';
import WorkspacePropertiesForm from '@editor/components/Workspace/Property/Form';
import WorkspaceSection from '@editor/components/Workspace/Section';
import WorkspaceSiteToolbar from '@editor/components/Workspace/SiteToolbar';
import WorkspaceSlotsSection from '@editor/components/Workspace/SlotsSection';
import WorkspaceStyleForm from '@editor/components/Workspace/Style/Form';
import {
  PROPERTIES_TAB,
  STYLES_TAB,
  SLOTS_TAB,
  DOCUMENTATION_TAB,
  FEEDBACK_TAB,

  selectIsComponentTreeOpen,
  selectTab,
  selectVisibleProperties,
  selectVisibleSlots,
  selectVisibleStyles,
  setTab,
} from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function Workspace(props) {
  const tab = useSelector(selectTab);

  const dispatch = useDispatch();

  const { activeComponentMeta } = useActiveWorkspaceComponent();

  const isComponentTreeOpen = useSelector(selectIsComponentTreeOpen);
  const visibleProperties = useSelector(selectVisibleProperties);
  const activeComponentHasProperties = !!visibleProperties.length;

  const visibleStyles = useSelector(selectVisibleStyles);
  const activeComponentHasStyles = !!visibleStyles.length;

  const visibleSlots = useSelector(selectVisibleSlots);
  const activeComponentHasSlots = !!visibleSlots.length;

  const activeComponentHasDocumentation = !!get(activeComponentMeta, 'documentation', '').length;

  function isActiveTab(key) {
    return tab === key;
  }

  function iconButtonColor(key) {
    function _iconButtonColor(colors) {
      return colors.mono[isActiveTab(key) ? 700 : 300];
    }

    return _iconButtonColor;
  }

  return (
    <Flex.Column
      fullWidth
      fullHeight
      as="article"
      position="relative"
      overflowX="hidden"
      shadow={(shadow) => shadow.light}
      bg={(colors) => colors.mono[100]}
    >
      <WorkspaceSiteToolbar />
      <WorkspaceComponentToolbar />
      {isComponentTreeOpen && (
        <WorkspaceComponentTree />
      )}
      {!isComponentTreeOpen && (
        <Flex.Row
          flexGrow
          justifyContent="space-between"
          gridGap="36px"
          paddingTop="12px"
          paddingBottom="0px"
          paddingLeft="12px"
          paddingRight="0px"
          overflowY="scroll"
        >
          <Flex.Column fullHeight gridGap="12px">
            {activeComponentHasProperties && (
              <Tooltip copy="Edit properties" point={Tooltip.LEFT}>
                <Buttons.IconButton
                  aria-label="Edit component properties"
                  onClick={() => dispatch(setTab({ tab: PROPERTIES_TAB }))}
                  color={iconButtonColor(PROPERTIES_TAB)}
                  hoverColor={(colors) => colors.mono[500]}
                  IconComponent={Icons.SettingFill}
                />
              </Tooltip>
            )}
            {activeComponentHasStyles && (
              <Tooltip copy="Edit styles" point={Tooltip.LEFT}>
                <Buttons.IconButton
                  aria-label="Edit component styles"
                  onClick={() => dispatch(setTab({ tab: STYLES_TAB }))}
                  color={iconButtonColor(STYLES_TAB)}
                  hoverColor={(colors) => colors.mono[500]}
                  IconComponent={Icons.DimondAltFill}
                />
              </Tooltip>
            )}
            {activeComponentHasSlots && (
              <Tooltip copy="Edit slots" point={Tooltip.LEFT}>
                <Buttons.IconButton
                  aria-label="Edit component slots"
                  onClick={() => dispatch(setTab({ tab: SLOTS_TAB }))}
                  color={iconButtonColor(SLOTS_TAB)}
                  hoverColor={(colors) => colors.mono[500]}
                  IconComponent={Icons.MenuAlt}
                />
              </Tooltip>
            )}
            {activeComponentHasDocumentation && (
              <Tooltip copy="Documentation" point={Tooltip.LEFT}>
                <Buttons.IconButton
                  aria-label="Component documentation"
                  onClick={() => dispatch(setTab({ tab: DOCUMENTATION_TAB }))}
                  color={iconButtonColor(DOCUMENTATION_TAB)}
                  hoverColor={(colors) => colors.mono[500]}
                  IconComponent={Icons.QuestionFill}
                />
              </Tooltip>
            )}
            <Tooltip copy="Submit feedback or bugs" point={Tooltip.LEFT}>
              <Buttons.IconButton
                aria-label="Submit feedback or bugs"
                onClick={() => dispatch(setTab({ tab: FEEDBACK_TAB }))}
                color={iconButtonColor(FEEDBACK_TAB)}
                hoverColor={(colors) => colors.mono[500]}
                IconComponent={Icons.Bug}
              />
            </Tooltip>
          </Flex.Column>
          <Flex.Column
            overflowY="scroll"
            gridGap="32px"
            paddingBottom="24px"
            paddingRight="12px"
            fullWidth
          >
            {isActiveTab(PROPERTIES_TAB) && (
              <WorkspaceSection name="Properties">
                <WorkspacePropertiesForm />
              </WorkspaceSection>
            )}
            {isActiveTab(STYLES_TAB) && (
              <WorkspaceSection name="Styles">
                <Flex.Column gridGap="12px">
                  {visibleStyles.map((style) => (
                    <WorkspaceStyleForm key={style.id} styleData={style} />
                  ))}
                </Flex.Column>
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
        </Flex.Row>
      )}
      <WorkspaceMenu />
    </Flex.Column>
  );
}
