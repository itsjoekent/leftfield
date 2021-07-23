import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Typography } from 'pkg.admin-components';
import AutoSave from '@product/components/AutoSave';
import Workspace from '@product/components/Workspace';
import Preview from '@product/components/Preview';
import PreviewSelector from '@product/components/PreviewSelector';
import { PARLIAMENTARIAN_BOOTSTRAP_TYPE } from '@product/constants/parliamentarian';
import {
  selectWebsiteId,
  setWebsiteId,
  setAssemblyState,
} from '@product/features/assembly';
import {
  selectAuthOrganization,
  setAccount,
  setOrganization,
} from '@product/features/auth';
import { setModal, WEBSITE_SELECTOR_MODAL } from '@product/features/modal';
import useAuthGate from '@product/hooks/useAuthGate';
import useMediaQuery from '@product/hooks/useMediaQuery';
import useProductApi from '@product/hooks/useProductApi';
import store from '@product/store';

export const EDITOR_ROUTE = '/editor';

export default function Editor() {
  const isAuthenticated = useAuthGate();

  const isMobile = useMediaQuery('(max-width: 960px');

  const previewContainerRef = React.useRef(null);
  const [previewContainerDimensions, setpreviewContainerDimensions] = React.useState(null);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const websiteId = useSelector(selectWebsiteId);
  const organization = useSelector(selectAuthOrganization);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    let cancel = false;

    if (!organization) {
      hitApi('get', 'get-account-organization', null, ({ json, ok }) => {
        if (ok && !cancel) {
          dispatch(setAccount(get(json, 'account')));
          dispatch(setOrganization(get(json, 'organization')));
        }
      });
    }

    if (!!organization) {
      if (get(organization, 'websites.length', 0) === 1) {
        const websiteId = organization.websites[0];

        hitApi('get', `get-website/${websiteId}`, null, ({ json, ok }) => {
          if (ok && !cancel) {
            dispatch(setAssemblyState({
              newAssembly: {
                websiteId,
                ...get(json, 'website.data', {}),
              },
            }));
          }
        });
      } else {
        dispatch(setModal({ type: WEBSITE_SELECTOR_MODAL }));
      }
    }

    return () => cancel = true;
  }, [isAuthenticated, organization]);

  React.useEffect(() => {
    dispatch({ type: PARLIAMENTARIAN_BOOTSTRAP_TYPE });
  }, [websiteId]);

  React.useEffect(() => {
    function updateDimensions() {
      const boundingRect = previewContainerRef.current.getBoundingClientRect();
      setpreviewContainerDimensions([boundingRect.width - 24, boundingRect.height - 24]);
    }

    function onResize(event) {
      updateDimensions();
    }

    if (previewContainerRef.current) {
      window.addEventListener('resize', onResize);

      if (!previewContainerDimensions) {
        updateDimensions();
      }

      return () => window.removeEventListener('resize', onResize);
    }
  }, [previewContainerDimensions]);

  if (isMobile) {
    // TODO: Return just Workspace?
    return (
      <Flex.Column align="center" justify="center" padding="24px">
        <Typography
          fontStyle="bold"
          fontSize="18px"
          lineHeight="1.1"
          fg={(colors) => colors.purple[500]}
        >
          Sorry! The editor isn't mobile friendly right now.
        </Typography>
      </Flex.Column>
    );
  }

  return (
    <Page fullWidth minHeight="100vh" align="center">
      <Flex.Row
        fullWidth
        justify="center"
        bg={(colors) => colors.mono[100]}
        shadow={(shadows) => shadows.light}
        padding="12px"
      >
        <LeftSideNavigation />
        <RightSideNavigation
          align="center"
          gridGap="12px"
        >
          <PreviewSelector />
          <AutoSave />
        </RightSideNavigation>
      </Flex.Row>
      <Flex.Row
        as="main"
        fullWidth
        justify="space-between"
        flexGrow
        padding="24px"
        minHeight="0"
      >
        <WorkspaceContainer as="section">
          <Workspace />
        </WorkspaceContainer>
        <PreviewContainer
          as="section"
          ref={previewContainerRef}
        >
          <Preview previewContainerDimensions={previewContainerDimensions} />
        </PreviewContainer>
      </Flex.Row>
    </Page>
  );
}

const Page = styled(Flex.Column)`
  background: radial-gradient(${(props) => props.theme.colors.purple[200]} 1px, transparent 1px);
  background-size: 25px 25px;
`;

const leftSide = css`
  width: calc(40% - 12px);

  @media (min-width: 1280px) {
    width: calc(33.33% - 12px);
  }
`;

const rightSide = css`
  width: calc(60% - 12px);

  @media (min-width: 1280px) {
    width: calc(66.66% - 12px);
  }
`;

const LeftSideNavigation = styled(Flex.Row)`
  ${leftSide}
`;

const RightSideNavigation = styled(Flex.Row)`
  ${rightSide}
`;

const WorkspaceContainer = styled(Flex.Column)`
  ${leftSide}
  height: calc(100vh - 96px);
`;

const PreviewContainer = styled(Flex.Column)`
  ${rightSide}
  position: relative;
  overflow: hidden;
  height: calc(100vh - 96px);
`;
