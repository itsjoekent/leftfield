import React from 'react';
import styled from 'styled-components';
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
import WorkspaceStyleLibrarySelector from '@editor/components/Workspace/Style/LibrarySelector';
import WorkspaceStyleResponsiveHint from '@editor/components/Workspace/Style/ResponsiveHint';
import { selectComponentStyleInheritsFrom } from '@editor/features/assembly';
import {
  setModal,
  EXPORT_STYLE_MODAL,
} from '@editor/features/modal';
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
        {!!type && (
          <Flex.Row gridGap="12px" align="center">
            <LibrarySelectorWrapper>
              <WorkspaceStyleLibrarySelector
                styleId={styleId}
                styleType={type}
              />
            </LibrarySelectorWrapper>
            <Tooltip copy="Export this style" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Export}
                color={(colors) => isDefined(inheritsFromStyle) ? colors.mono[500] : colors.blue[500]}
                hoverColor={(colors) => colors.blue[800]}
                aria-label="Export this style"
                disabled={isDefined(inheritsFromStyle)}
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

const LibrarySelectorWrapper = styled.div`
  flex-grow: 1;
`;
