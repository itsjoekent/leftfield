import React from 'react';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
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
      <Flex.Row align="center" gridGap="12px" minWidth="0" paddingRight="12px">
        <Tooltip copy="Open settings menu" point={Tooltip.UP_LEFT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Open settings menu"
            IconComponent={Icons.Sort}
            color={(colors) => colors.blue[700]}
            hoverColor={(colors) => colors.blue[500]}
          />
        </Tooltip>
        <Flex.Row align="center" gridGap="6px" minWidth="0">
          <Typography
            fontStyle="medium"
            fontSize="14px"
            letterSpacing="2%"
            fg={(colors) => colors.blue[700]}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            Homepage
          </Typography>
          <Tooltip copy="Edit page title" point={Tooltip.UP}>
            <Buttons.IconButton
              aria-label="Edit page title"
              width={16}
              height={16}
              IconComponent={Icons.EditFill}
              color={(colors) => colors.blue[700]}
              hoverColor={(colors) => colors.blue[500]}
            />
          </Tooltip>
        </Flex.Row>
      </Flex.Row>
      <Flex.Row align="center" gridGap="6px">
        <Tooltip copy="Create new page" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Create a new page"
            IconComponent={Icons.AddRound}
            color={(colors) => colors.blue[700]}
            hoverColor={(colors) => colors.blue[500]}
          />
        </Tooltip>
        <Tooltip copy="Browse all pages" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            aria-label="Browse all pages"
            IconComponent={Icons.ExpandDown}
            color={(colors) => colors.blue[700]}
            hoverColor={(colors) => colors.blue[500]}
          />
        </Tooltip>
      </Flex.Row>
    </Flex.Row>
  );
}
