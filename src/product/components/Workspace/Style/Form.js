import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Block,
  Buttons,
  Icons,
  Flex,
  Tooltip,
  Typography,
  useAdminTheme,
} from 'pkg.admin-components';
import WorkspaceStyleAttribute from '@product/components/Workspace/Style/Attribute';
import WorkspaceStyleLabel from '@product/components/Workspace/Style/Label';
import WorkspaceStylePresetSelector from '@product/components/Workspace/Style/PresetSelector';
import WorkspaceStyleResponsiveHint from '@product/components/Workspace/Style/ResponsiveHint';
import {
  selectComponentStyleInheritsFrom,
  selectPreset,
} from '@product/features/assembly';
import {
  setModal,
  EXPORT_STYLE_MODAL,
} from '@product/features/modal';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import isDefined from '@product/utils/isDefined';

export default function StyleForm(props) {
  const { styleData } = props;

  const styleId = get(styleData, 'id');
  const label = get(styleData, 'label', '');
  const help = get(styleData, 'help', null);
  const type = get(styleData, 'type', null);
  const attributes = get(styleData, 'attributes', []);

  const dispatch = useDispatch();
  const adminTheme = useAdminTheme();

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const inheritsFromPresetId = useSelector(selectComponentStyleInheritsFrom(
    activePageId,
    activeComponentId,
    styleId,
  ));

  const inheritsFromPreset = useSelector(selectPreset(inheritsFromPresetId));
  const isArchivedPreset = !!get(inheritsFromPreset, 'isArchived', false);

  const isExportable = !isDefined(inheritsFromPresetId)
    || (isDefined(inheritsFromPresetId) && !!isArchivedPreset);

  return (
    <Flex.Column
      bg={(colors) => colors.mono[200]}
      rounded={(radius) => radius.default}
    >
      <Flex.Column gridGap="12px" padding="12px">
        <Typography
          fontStyle="bold"
          fontSize="16px"
          fg={(colors) => colors.mono[700]}
        >
          {label}
        </Typography>
        {!!help && (
          <Typography
            fontStyle="thin"
            fontSize="14px"
            fg={(colors) => colors.mono[700]}
          >
            {help}
          </Typography>
        )}
        {!!isArchivedPreset && (
          <Flex.Row align="center" gridGap="2px">
            <Icons.AlarmFill
              width={20}
              height={20}
              color={adminTheme.colors.red[500]}
            />
            <Typography
              fontStyle="medium"
              fontSize="14px"
              fg={(colors) => colors.red[500]}
            >
              The {get(inheritsFromPreset, 'name', 'Unnamed')} preset is archived
            </Typography>
          </Flex.Row>
        )}
        {!!type && (
          <Flex.Row gridGap="12px" align="center">
            <Block flexGrow>
              <WorkspaceStylePresetSelector
                styleId={styleId}
                styleType={type}
              />
            </Block>
            <Tooltip copy="Export preset" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Export}
                color={(colors) => isExportable ? colors.blue[500] : colors.mono[500]}
                hoverColor={(colors) => colors.blue[800]}
                aria-label="Export preset"
                disabled={!isExportable}
                onClick={() => dispatch(setModal({
                  type: EXPORT_STYLE_MODAL,
                  props: {
                    pageId: activePageId,
                    componentId: activeComponentId,
                    styleId,
                    styleType: type,
                  },
                }))}
              />
            </Tooltip>
          </Flex.Row>
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
