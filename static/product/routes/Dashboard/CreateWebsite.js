import React from 'react';
import styled, { css } from 'styled-components';
import { useLocation } from 'wouter';
import { get } from 'lodash';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
import HomeButton from '@product/components/HomeButton';
import Preview from '@product/components/Preview';
import useProductApi from '@product/hooks/useProductApi';
import { setWebsiteId } from '@product/features/assembly';
import { EDITOR_ROUTE } from '@product/routes/Editor';

export const DASHBOARD_CREATE_WEBSITE_ROUTE = '/dashboard/create-website';

export default function CreateWebsite() {
  const hitApi = useProductApi();
  const [, setLocation] = useLocation();

  const [isBuildingBlank, setIsBuildingBlank] = React.useState(false);
  const [isBuildingTemplate, setIsBuildingTemplate] = React.useState(false);

  const previewContainerRef = React.useRef(null);
  const [previewContainerDimensions, setpreviewContainerDimensions] = React.useState(null);

  const [deviceSize, setDeviceSize] = React.useState(Responsive.DESKTOP_DEVICE);

  function isDevice(test) {
    return deviceSize === test;
  }

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

  function createBlankWebsite() {
    setIsBuildingBlank(true);

    hitApi({
      method: 'post',
      route: '/website',
      onResponse: ({ json, ok }) => {
        setIsBuildingBlank(false);

        if (ok) {
          setLocation(`${EDITOR_ROUTE}?id=${get(json, 'website.id')}`);
        }
      },
      onFatalError: () => setIsBuildingBlank(false),
    });
  }

  return (
    <Flex.Column
      fullWidth
      fullViewportHeight
      bg={(colors) => colors.mono[100]}
    >
      <Flex.Row
        align="center"
        gridGap="24px"
        paddingVertical="12px"
        paddingHorizontal="24px"
        bg={(colors) => colors.blue[700]}
        shadow={(shadows) => shadows.strong}
      >
        <LeftSideNavigation>
          <HomeButton color="white" />
        </LeftSideNavigation>
        <RightSideNavigation align="center" justify="space-between">
          <Flex.Row gridGap="12px">
            <Buttons.Text
              IconComponent={Icons.Mobile}
              gridGap="4px"
              buttonFg={(colors) => isDevice(Responsive.MOBILE_DEVICE) ? colors.mono[100] : colors.blue[200]}
              hoverButtonFg={(colors) => colors.mono[100]}
              onClick={() => setDeviceSize(Responsive.MOBILE_DEVICE)}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Mobile
              </Typography>
            </Buttons.Text>
            <Buttons.Text
              IconComponent={Icons.Tablet}
              gridGap="4px"
              buttonFg={(colors) => isDevice(Responsive.TABLET_DEVICE) ? colors.mono[100] : colors.blue[200]}
              hoverButtonFg={(colors) => colors.mono[100]}
              onClick={() => setDeviceSize(Responsive.TABLET_DEVICE)}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Tablet
              </Typography>
            </Buttons.Text>
            <Buttons.Text
              IconComponent={Icons.Desktop}
              gridGap="4px"
              buttonFg={(colors) => isDevice(Responsive.DESKTOP_DEVICE) ? colors.mono[100] : colors.blue[200]}
              hoverButtonFg={(colors) => colors.mono[100]}
              onClick={() => setDeviceSize(Responsive.DESKTOP_DEVICE)}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Desktop
              </Typography>
            </Buttons.Text>
          </Flex.Row>
          <Flex.Row align="center" gridGap="12px">
            <Buttons.Text
              IconComponent={Icons.File2}
              gridGap="4px"
              buttonFg={(colors) => colors.mono[100]}
              hoverButtonFg={(colors) => colors.mono[300]}
              isLoading={isBuildingBlank}
              disabled={isBuildingBlank || isBuildingTemplate}
              onClick={createBlankWebsite}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Start from scratch
              </Typography>
            </Buttons.Text>
            <Buttons.Filled
              IconComponent={Icons.CheckFill}
              paddingVertical="4px"
              paddingHorizontal="8px"
              buttonFg={(colors) => colors.mono[700]}
              buttonBg={(colors) => colors.yellow[500]}
              hoverButtonBg={(colors) => colors.yellow[700]}
              isLoading={isBuildingTemplate}
              disabled={isBuildingBlank || isBuildingTemplate}
            >
              <Typography
                fontStyle="medium"
                fontSize="14px"
              >
                Use this template
              </Typography>
            </Buttons.Filled>
          </Flex.Row>
        </RightSideNavigation>
      </Flex.Row>
      <Flex.Row fullWidth gridGap="24px" flexGrow>
        <TemplateList
          padding="24px"
          gridGap="24px"
          bg={(colors) => colors.blue[100]}
        >
          {/*  */}
        </TemplateList>
        <PreviewContainer ref={previewContainerRef}>
          <Preview
            deviceSize={deviceSize}
            iframeSrc="https://democrats.org"
            containerDimensions={previewContainerDimensions}
          />
        </PreviewContainer>
      </Flex.Row>
    </Flex.Column>
  );
}

const leftSide = css`
  width: calc(25% - 12px);
  max-width: 450px;
`;

const rightSide = css`
  flex-grow: 1;
`;

const LeftSideNavigation = styled(Flex.Row)`
  ${leftSide}
`;

const RightSideNavigation = styled(Flex.Row)`
  ${rightSide}
`;

const TemplateList = styled(Flex.Column)`
  ${leftSide}
`;

const PreviewContainer = styled(Flex.Column)`
  ${rightSide}
  position: relative;
  overflow: hidden;
  height: ${({ theme }) => css`calc(100vh - ${24 + 20}px);`}
`;
