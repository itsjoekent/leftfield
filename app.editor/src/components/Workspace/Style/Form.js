import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  detachStyleReference,
  selectComponentStyleInheritsFrom,
  selectStyleNameFromStyleLibrary,
} from '@editor/features/assembly';
import { setModal, EXPORT_STYLE_MODAL } from '@editor/features/modal';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import isDefined from '@editor/utils/isDefined';

export default function StyleForm(props) {
  const { styleData } = props;

  const styleId = get(styleData, 'id');
  const label = get(styleData, 'label', '');
  const help = get(styleData, 'help', null);
  const type = get(styleData, 'type', null);
  const attributes = get(styleData, 'attributes', []);

  const dispatch = useDispatch();

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const inheritsFromStyle = useSelector(selectComponentStyleInheritsFrom(
    activePageId,
    activeComponentId,
    styleId,
  ));

  const inheritsFromStyleName = useSelector(selectStyleNameFromStyleLibrary(inheritsFromStyle));

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
              {!isDefined(inheritsFromStyle) && (
                <Tooltip copy="Export this style" point={Tooltip.UP_RIGHT_ALIGNED}>
                  <Buttons.IconButton
                    IconComponent={Icons.Export}
                    width={20}
                    height={20}
                    color={(colors) => colors.mono[500]}
                    hoverColor={(colors) => colors.mono[700]}
                    aria-label="Export this style"
                    onClick={() => dispatch(setModal({
                      type: EXPORT_STYLE_MODAL,
                      props: {
                        pageId: activePageId,
                        componentId: activeComponentId,
                        styleId,
                      },
                    }))}
                  />
                </Tooltip>
              )}
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
        {isDefined(inheritsFromStyle) && (
          <Flex.Row fullWidth align="center" gridGap="2px">
            <Tooltip copy="Detatch style reference" point={Tooltip.UP_LEFT_ALIGNED}>
              <Buttons.IconButton
                onClick={() => dispatch(detachStyleReference({
                  pageId: activePageId,
                  componentId: activeComponentId,
                  styleId,
                }))}
                IconComponent={Icons.RemoveFill}
                width={18}
                height={18}
                color={(colors) => colors.blue[500]}
                hoverColor={(colors) => colors.blue[800]}
                aria-label="Detatch style reference"
              />
            </Tooltip>
            <Typography
              fontStyle="regular"
              fontSize="14px"
              fg={(colors) => colors.blue[500]}
            >
              Editing {inheritsFromStyleName}
            </Typography>
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
