import React from 'react';
import { v4 as uuid } from 'uuid';
import { createGlobalStyle } from 'styled-components';
import { batch, useDispatch } from 'react-redux';
import {
  Block,
  Flex,
  Typography,
} from 'pkg.admin-components';
import {
  setCampaignThemeKeyValue,
  setMetaValue,
} from '@product/features/assembly';
import { setModal } from '@product/features/modal';

const FontHoist = createGlobalStyle`
  .${({ name }) => name}-starter-kit-h3 {
    font-family: ${({ headerFontFamily }) => headerFontFamily};
    font-weight: 700;
    font-size: 28px;
    text-align: left;
  }

  .${({ name }) => name}-starter-kit-p {
    font-family: ${({ paragraphFontFamily }) => paragraphFontFamily};
    font-weight: 400;
    font-size: 18px;
    text-align: left;
  }
`;

export default function StarterKit(props) {
  const {
    name = '',
    headerFontImport = '',
    headerFontName = '',
    headerFontFamily = '',
    headerWeights = {},
    paragraphFontImport = '',
    paragraphFontName = '',
    paragraphFontFamily = '',
    paragraphWeights = {},
  } = props;

  const dispatch = useDispatch();

  function addFonts() {
    const headerFontId = uuid();
    const paragraphFontId = uuid();

    batch(() => {
      dispatch(setCampaignThemeKeyValue({
        path: `fonts.${headerFontId}`,
        value: {
          label: headerFontName,
          value: headerFontFamily,
          html: headerFontImport,
        },
      }));

      dispatch(setCampaignThemeKeyValue({
        path: `fontWeights.${headerFontId}`,
        value: headerWeights,
      }));

      dispatch(setCampaignThemeKeyValue({
        path: `fonts.${paragraphFontId}`,
        value: {
          label: paragraphFontName,
          value: paragraphFontFamily,
          html: paragraphFontImport,
        },
      }));

      dispatch(setCampaignThemeKeyValue({
        path: `fontWeights.${paragraphFontId}`,
        value: paragraphWeights,
      }));

      dispatch(setMetaValue({
        item: headerFontId,
        op: '$PUSH',
        path: 'fontSortOrder',
      }));

      dispatch(setMetaValue({
        item: paragraphFontId,
        op: '$PUSH',
        path: 'fontSortOrder',
      }));

      dispatch(setModal({ type: null }));
    });
  }

  React.useEffect(() => {
    const fonts = [headerFontImport, paragraphFontImport];

    fonts.forEach((fontHtml) => {
      const parser = new DOMParser();
      const fontElements = parser.parseFromString(`<head>${fontHtml}</head>`, 'text/html').head.children;

      fontElements.forEach((fontElement) => {
        document.head.append(fontElement);
      });
    });
  }, []);

  return (
    <Flex.Column
      role="button"
      bg={(colors) => colors.mono[100]}
      borderColor={(colors) => colors.mono[100]}
      borderWidth="1px"
      hoverBorderColor={(colors) => colors.mono[300]}
      shadow={(shadows) => shadows.light}
      hoverShadow={() => 'box-shadow: none;'}
      rounded={(radius) => radius.default}
      padding="0px"
      onClick={addFonts}
      cursor="pointer"
    >
      <FontHoist
        name={name}
        headerFontFamily={headerFontFamily}
        paragraphFontFamily={paragraphFontFamily}
      />
      <Flex.Column
        gridGap="6px"
        padding="12px"
      >
        <h3 className={`${name}-starter-kit-h3`}>
          Good evening
        </h3>
        <p className={`${name}-starter-kit-p`}>
          Ella Baker, a giant of the civil rights movement left us with this wisdom: Give people light and they will find the way. "Give people light": Those are words for our time.
        </p>
      </Flex.Column>
      <Block
        fullWidth
        padding="12px"
        paddingTop="0px"
      >
        <Typography
          fontStyle="medium"
          fontSize="14px"
          fg={(colors) => colors.mono[700]}
        >
          {headerFontName}, {paragraphFontName}
        </Typography>
      </Block>
    </Flex.Column>
  );
}
