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
import WorkspacePageNavigation from '@editor/components/Workspace/PageNavigation';
import WorkspacePropertiesForm from '@editor/components/Workspace/Property/Form';
import WorkspaceStyleForm from '@editor/components/Workspace/Style/Form';
import WorkspaceSection from '@editor/components/Workspace/Section';
import WorkspaceSlotsSection from '@editor/components/Workspace/SlotsSection';
import {
  PROPERTIES_TAB,
  STYLES_TAB,
  SLOTS_TAB,
  DOCUMENTATION_TAB,
  FEEDBACK_TAB,

  selectIsComponentTreeOpen,
  selectTab,
  setTab,

  selectVisibleProperties,
  selectVisibleSlots,
  selectVisibleStyles,
} from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import usePrevious from '@editor/hooks/usePrevious';

export default function Workspace(props) {
  const tab = useSelector(selectTab);

  const dispatch = useDispatch();

  const {
    activeComponentMeta,
    activeComponentId,
    activePageId,
  } = useActiveWorkspaceComponent();

  const isComponentTreeOpen = useSelector(selectIsComponentTreeOpen);

  const previousActiveComponentId = usePrevious(activeComponentId);
  const previousActivePageId = usePrevious(activePageId);

  const visibleProperties = useSelector(selectVisibleProperties);
  const activeComponentHasProperties = !!visibleProperties.length;

  const visibleStyles = useSelector(selectVisibleStyles);
  const activeComponentHasStyles = !!visibleStyles.length;

  const visibleSlots = useSelector(selectVisibleSlots);
  const activeComponentHasSlots = !!visibleSlots.length;

  const activeComponentHasDocumentation = !!get(activeComponentMeta, 'documentation', '').length;

  React.useEffect(() => {
    const tabAvailability = {
      [PROPERTIES_TAB]: activeComponentHasProperties,
      [STYLES_TAB]: activeComponentHasStyles,
      [SLOTS_TAB]: activeComponentHasSlots,
      [DOCUMENTATION_TAB]: activeComponentHasDocumentation,
    };

    if (
      (!tabAvailability[tab])
      || (previousActiveComponentId !== activeComponentId)
      || (previousActivePageId !== activePageId)
    ) {
      const nextIndex = Object.values(tabAvailability)
        .findIndex((isAvailable) => !!isAvailable);

      dispatch(setTab(Object.keys(tabAvailability)[nextIndex]));
    }
  }, [
    dispatch,
    tab,
    activeComponentHasProperties,
    activeComponentHasStyles,
    activeComponentHasSlots,
    activeComponentHasDocumentation,
    activeComponentId,
    activePageId,
    previousActiveComponentId,
    previousActivePageId,
  ]);

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
      shadow={(shadow) => shadow.light}
      bg={(colors) => colors.mono[100]}
    >
      <WorkspacePageNavigation />
      <WorkspaceComponentToolbar />
      {isComponentTreeOpen && (
        <WorkspaceComponentTree />
      )}
      {!isComponentTreeOpen && (
        <Flex.Row
          flexGrow
          justifyContent="space-between"
          gridGap="36px"
          padding="12px"
          overflowY="scroll"
        >
          <Flex.Column fullHeight gridGap="12px">
            {activeComponentHasProperties && (
              <Tooltip copy="Edit properties" point={Tooltip.LEFT}>
                <Buttons.IconButton
                  aria-label="Edit component properties"
                  onClick={() => dispatch(setTab(PROPERTIES_TAB))}
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
                  onClick={() => dispatch(setTab(STYLES_TAB))}
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
                  onClick={() => dispatch(setTab(SLOTS_TAB))}
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
                  onClick={() => dispatch(setTab(DOCUMENTATION_TAB))}
                  color={iconButtonColor(DOCUMENTATION_TAB)}
                  hoverColor={(colors) => colors.mono[500]}
                  IconComponent={Icons.QuestionFill}
                />
              </Tooltip>
            )}
            <Tooltip copy="Submit feedback or bugs" point={Tooltip.LEFT}>
              <Buttons.IconButton
                aria-label="Submit feedback or bugs"
                onClick={() => dispatch(setTab(FEEDBACK_TAB))}
                color={iconButtonColor(FEEDBACK_TAB)}
                hoverColor={(colors) => colors.mono[500]}
                IconComponent={Icons.Bug}
              />
            </Tooltip>
          </Flex.Column>
          <Flex.Column overflowY="scroll" gridGap="32px" fullWidth>
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
    </Flex.Column>
  );
}
