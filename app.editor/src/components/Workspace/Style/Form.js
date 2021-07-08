import React from 'react';
import { get } from 'lodash';
import {
  Buttons,
  Icons,
  Flex,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import WorkspaceStyleAttribute from '@editor/components/Workspace/Style/Attribute';
import WorkspaceStyleLabel from '@editor/components/Workspace/Style/Label';
import WorkspaceStyleResponsiveHint from '@editor/components/Workspace/Style/ResponsiveHint';

export default function StyleForm(props) {
  const { styleData } = props;

  const styleId = get(styleData, 'id');
  const label = get(styleData, 'label', '');
  const help = get(styleData, 'help', null);
  const type = get(styleData, 'type', null);
  const attributes = get(styleData, 'attributes', []);

  return (
    <Flex.Column
      bg={(colors) => colors.mono[200]}
      rounded={(radius) => radius.default}
    >
      <Flex.Column gridGap="12px" padding="12px">
        <Flex.Row align="center" justify="space-between">
          <Typography
            fontStyle="bold"
            fontSize="16px"
            fg={(colors) => colors.mono[700]}
          >
            {label}
          </Typography>
          {!!type && (
            <Flex.Row align="center" gridGap="6px">
              <Tooltip copy="Import existing style" point={Tooltip.UP_RIGHT_ALIGNED}>
                <Buttons.IconButton
                  IconComponent={Icons.Import}
                  width={20}
                  height={20}
                  color={(colors) => colors.mono[500]}
                  hoverColor={(colors) => colors.mono[700]}
                  aria-label="Import existing style"
                  onClick={() => {}}
                />
              </Tooltip>
              <Tooltip copy="Export this style" point={Tooltip.UP_RIGHT_ALIGNED}>
                <Buttons.IconButton
                  IconComponent={Icons.Export}
                  width={20}
                  height={20}
                  color={(colors) => colors.mono[500]}
                  hoverColor={(colors) => colors.mono[700]}
                  aria-label="Export this style"
                  onClick={() => {}}
                />
              </Tooltip>
            </Flex.Row>
          )}
        </Flex.Row>
        {!!help && (
          <Typography
            fontStyle="thin"
            fontSize="14px"
            fg={(colors) => colors.mono[700]}
          >
            {help}
          </Typography>
        )}
      </Flex.Column>
      {attributes.map((attribute) => (
        <React.Fragment key={get(attribute, 'id')}>
          <Flex.Row
            role="separator"
            fullWidth
            bg={(colors) => colors.mono[300]}
            style={{ height: '1px' }}
          />
          <Flex.Column gridGap="12px" padding="12px">
            <WorkspaceStyleLabel
              styleId={styleId}
              attribute={attribute}
            />
            <WorkspaceStyleAttribute
              styleId={styleId}
              attribute={attribute}
            />
            <WorkspaceStyleResponsiveHint
              styleId={styleId}
              attribute={attribute}
            />
          </Flex.Column>
        </React.Fragment>
      ))}
    </Flex.Column>
  );
}
