import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import WorkspaceMenuPageSettings from '@product/components/Workspace/Menu/PageSettings';
import WorkspaceMenuSiteSettings from '@product/components/Workspace/Menu/SiteSettings';
import WorkspaceMenuTheme from '@product/components/Workspace/Menu/Theme';
import {
  selectIsSettingsMenuOpen,
  setIsSettingsMenuOpen,
} from '@product/features/workspace';

const CAMPAIGN_THEME_MENU = 'CAMPAIGN_THEME_MENU';
const PAGE_SETTINGS_MENU = 'PAGE_SETTINGS_MENU';
const SITE_SETTINGS_MENU = 'SITE_SETTINGS_MENU';
const STYLE_LIBRARY_MENU = 'STYLE_LIBRARY_MENU';

const menus = [
  [PAGE_SETTINGS_MENU, WorkspaceMenuPageSettings],
  [SITE_SETTINGS_MENU, WorkspaceMenuSiteSettings],
  [CAMPAIGN_THEME_MENU, WorkspaceMenuTheme],
  // [STYLE_LIBRARY_MENU, React.Fragment],
];

export default function Menu() {
  const dispatch = useDispatch();
  const isSettingsMenuOpen = useSelector(selectIsSettingsMenuOpen);

  const [openMenu, setOpenMenu] = React.useState(PAGE_SETTINGS_MENU);

  return (
    <Container
      padding="12px"
      gridGap="24px"
      bg={(colors) => colors.blue[200]}
      isOpen={isSettingsMenuOpen}
    >
      <Flex.Row fullWidth>
        <Buttons.Text
          IconComponent={Icons.ArrowLeft}
          buttonFg={(colors) => colors.blue[700]}
          hoverButtonFg={(colors) => colors.mono[900]}
          gridGap="2px"
          onClick={() => dispatch(setIsSettingsMenuOpen(false))}
        >
          <Typography fontStyle="medium" fontSize="14px">
            Return to workspace
          </Typography>
        </Buttons.Text>
      </Flex.Row>
      <Flex.Column gridGap="12px" flexGrow>
        {menus.map((menu) => {
          const [key, MenuComponent] = menu;

          function setIsExpanded(isExpanded) {
            if (isExpanded) {
              setOpenMenu(key);
            } else {
              setOpenMenu(null);
            }
          }

          return (
            <MenuComponent
              key={key}
              isExpanded={openMenu === key}
              setIsExpanded={setIsExpanded}
            />
          );
        })}
      </Flex.Column>
    </Container>
  );
}

const Container = styled(Flex.Column)`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  overflow: hidden;

  transform: translateX(${(props) => props.isOpen ? '0' : '-100%'});
  transform-origin: left;

  transition: transform ${(props) => props.theme.animation.defaultTransition} ${(props) => props.isOpen ? 'ease-in' : 'ease-out'};
`;
