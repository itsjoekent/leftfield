import React from 'react';
import styled from 'styled-components';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
} from 'pkg.admin-components';

export default function WorkspacePageNavigation() {
  return (
    <Flex.Row
      fullWidth
      justify="space-between"
      align="center"
      paddingVertical="2px"
      paddingHorizontal="12px"
      bg={(colors) => colors.blue[200]}
    >
      <Flex.Row align="center" gridGap="12px">
        <Tooltip copy="Open settings menu" point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Open settings menu"
            IconComponent={Icons.Sort}
            color={(theme) => theme.colors.blue[700]}
            hoverColor={(theme) => theme.colors.blue[500]}
          />
        </Tooltip>
        <Flex.Row align="center" gridGap="6px">
          <PageTitle>
            Homepage
          </PageTitle>
          <Tooltip copy="Edit page title" point={Tooltip.UP}>
            <Buttons.IconButton
              aria-label="Edit page title"
              width={16}
              height={16}
              IconComponent={Icons.EditFill}
              color={(theme) => theme.colors.blue[700]}
              hoverColor={(theme) => theme.colors.blue[500]}
            />
          </Tooltip>
        </Flex.Row>
      </Flex.Row>
      <Flex.Row align="center" gridGap="6px">
        <Tooltip copy="Create new page" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Create a new page"
            IconComponent={Icons.AddRound}
            color={(theme) => theme.colors.blue[700]}
            hoverColor={(theme) => theme.colors.blue[500]}
          />
        </Tooltip>
        <Tooltip copy="Browse all pages" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Browse all pages"
            IconComponent={Icons.ExpandDown}
            color={(theme) => theme.colors.blue[700]}
            hoverColor={(theme) => theme.colors.blue[500]}
          />
        </Tooltip>
      </Flex.Row>
    </Flex.Row>
  );
}

const PageTitle = styled.p`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 14px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.blue[700]};
`;
