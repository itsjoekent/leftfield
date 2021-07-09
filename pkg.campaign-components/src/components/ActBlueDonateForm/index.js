import React from 'react';
import styled, { css } from 'styled-components';
import get from 'lodash.get';
import {
  ONE_BUTTON_LAYOUT,
  MULTI_BUTTON_LAYOUT,

  DISCLAIMER_TEXT_STYLE,
  DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE,
  GRID_STYLE,

  LAYOUT_PROPERTY,
  ACTBLUE_FORM_PROPERTY,
  ENABLE_EXPRESS_DONATE_PROPERTY,
  EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
  REFCODE_PROPERTY,
  CARRY_TRACKING_SOURCE_PROPERTY,

  DONATE_BUTTONS_SLOT,
  DONATE_BUTTON_SLOT,
  WIDE_MOBILE_DONATE_BUTTONS_SLOT,
  WIDE_DESKTOP_DONATE_BUTTONS_SLOT,
} from '@cc/components/ActBlueDonateForm/meta';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from '@cc/constants/responsive';
import {
  initialFundraisingState,
  FundraisingContext,
} from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
import BoxStyle from '@cc/styles/box';
import GridStyle, { COLUMNS_ATTRIBUTE } from '@cc/styles/grid';
import TextStyle from '@cc/styles/text';
import applyStyleIf from '@cc/utils/applyStyleIf';
import getPropertyValue from '@cc/utils/getPropertyValue';
import getStyleValue from '@cc/utils/getStyleValue';
import makeActBlueLink from '@cc/utils/makeActBlueLink';
import mapSourceToRefcode from '@cc/utils/makeActBlueLink';

export default function ActBlueDonateForm(props) {
  const {
    properties,
    slots,
    styles,
  } = props;

  const language = useLanguage();

  function buildUrl(amount) {
    const baseUrl = getPropertyValue(properties, ACTBLUE_FORM_PROPERTY, language);
    let params = {};

    if (!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY)) {
      params['express_lane'] = 'true';
    }

    if (!!getPropertyValue(properties, REFCODE_PROPERTY, null)) {
      params['refcode'] = getPropertyValue(properties, REFCODE_PROPERTY);
    }

    if (!!getPropertyValue(properties, CARRY_TRACKING_SOURCE_PROPERTY)) {
      params = {
        ...params,
        ...mapSourceToRefcode(),
      };
    }

    if (!!amount) {
      params['amount'] = amount;
    }

    return makeActBlueLink(baseUrl, params);
  }

  const fundraisingState = {
    ...initialFundraisingState,
    buildUrl,
  };

  if (getPropertyValue(properties, LAYOUT_PROPERTY) === ONE_BUTTON_LAYOUT) {
    return (
      <FundraisingContext.Provider value={fundraisingState}>
        {get(slots, DONATE_BUTTON_SLOT, null)}
      </FundraisingContext.Provider>
    );
  }

  const gridStyles = get(styles, GRID_STYLE, {});
  const textDisclaimerStyles = get(styles, DISCLAIMER_TEXT_STYLE, {});

  return (
    <FundraisingContext.Provider value={fundraisingState}>
      <FormGrid gridStyles={gridStyles}>
        {get(slots, DONATE_BUTTONS_SLOT, null)}
        {!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY) && (
          <Disclaimer
            gridStyles={gridStyles}
            textDisclaimerStyles={textDisclaimerStyles}
          >
            {getPropertyValue(properties, EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY)}
          </Disclaimer>
        )}
      </FormGrid>
    </FundraisingContext.Provider>
  );
}

const Disclaimer = styled.p`
  ${(props) => TextStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: props.textDisclaimerStyles,
  })}

  text-align: center;

  grid-column: span ${(props) => getStyleValue(props.gridStyles, COLUMNS_ATTRIBUTE)};
  margin-top: ${(props) => getStyleValue(props.textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE)}px;

  @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
    ${(props) => css`
      ${applyStyleIf(
        getStyleValue(props.gridStyles, COLUMNS_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`grid-column: span ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(props.textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`margin-top: ${styleValue}px;`,
      )}
    `}
  }

  @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
    ${(props) => css`
      ${applyStyleIf(
        getStyleValue(props.gridStyles, COLUMNS_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`grid-column: span ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(props.textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`margin-top: ${styleValue}px;`,
      )}
    `}
  }
`;

const FormGrid = styled.div`
  ${(props) => GridStyle.styling({
    styles: props.gridStyles,
  })}

  ${(props) => BoxStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: props.gridStyles,
  })}
`;
