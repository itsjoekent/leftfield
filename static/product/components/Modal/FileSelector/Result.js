import React from 'react';
import { get } from 'lodash';
import {
  Flex,
  Icons,
  Typography,
  useAdminTheme,
} from 'pkg.admin-components';

export default function Result(props) {
  const { file, onSelect } = props;

  const name = get(file, 'name', 'Unnamed file');
  const src = `${process.env.EDGE_DOMAIN}/file/${get(file, 'fileKey')}`;
  const isImage = get(file, 'fileType', '').startsWith('image/');

  const adminTheme = useAdminTheme();

  return (
    <Flex.Column
      role="button"
      tabIndex="0"
      justify="space-between"
      fullWidth
      gridGap="12px"
      padding="12px"
      overflow="hidden"
      bg={(colors) => colors.mono[100]}
      borderColor={(colors) => colors.mono[100]}
      borderWidth="1px"
      hoverBorderColor={(colors) => colors.mono[300]}
      shadow={(shadows) => shadows.light}
      hoverShadow={() => 'box-shadow: none;'}
      rounded={(radius) => radius.default}
      transitions={['box-shadow', 'border']}
      cursor="pointer"
      onClick={() => onSelect(file)}
    >
      {isImage && (
        <img src={src} alt={name} />
      )}
      {!isImage && (
        <Flex.Column
          justify="center"
          align="center"
          padding="6px"
          borderColor={(colors) => colors.mono[400]}
          borderWidth="1px"
        >
          <Icons.FileDockFill
            color={adminTheme.colors.mono[700]}
            width={32}
            height={32}
          />
        </Flex.Column>
      )}
      <Typography
        fontStyle="medium"
        fontSize="14px"
        fg={(colors) => colors.mono[700]}
      >
        {name}
      </Typography>
    </Flex.Column>
  );
}
