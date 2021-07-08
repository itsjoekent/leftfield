import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import get from 'lodash.get';
import {
  ONE_BUTTON_LAYOUT,
  MULTI_BUTTON_LAYOUT,

  DISCLAIMER_TEXT_STYLE,
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
import { initialFundraisingState, FundraisingContext } from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
import BoxStyle from '@cc/styles/box';
import GridStyle from '@cc/styles/grid';
import TextStyle from '@cc/styles/text';
import getPropertyValue from '@cc/utils/getPropertyValue';
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

  const localTheme = (theme) => ({
    ...theme,
    properties,
    slots,
    styles,
    language,
  });

  if (getPropertyValue(properties, LAYOUT_PROPERTY) === ONE_BUTTON_LAYOUT) {
    return (
      <FundraisingContext.Provider value={fundraisingState}>
        {get(slots, DONATE_BUTTON_SLOT, null)}
      </FundraisingContext.Provider>
    );
  }

  return (
    <ThemeProvider theme={localTheme}>
      <FundraisingContext.Provider value={fundraisingState}>
        {!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY) ? (
          <ExpressFormSpacing>
            <FormGrid>
              {get(slots, DONATE_BUTTONS_SLOT, null)}
            </FormGrid>
            <Disclaimer>
              {getPropertyValue(properties, EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY)}
            </Disclaimer>
          </ExpressFormSpacing>
        ) : (
          <FormGrid>
            {get(slots, DONATE_BUTTONS_SLOT, null)}
          </FormGrid>
        )}
      </FundraisingContext.Provider>
    </ThemeProvider>
  );
}

const ExpressFormSpacing = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
`;

const Disclaimer = styled.p`
  ${(props) => TextStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: get(props, `theme.styles.${DISCLAIMER_TEXT_STYLE}`, {}),
  })}

  text-align: center;
`;

const FormGrid = styled.div`
  ${(props) => GridStyle.styling({
    styles: get(props, `theme.styles.${GRID_STYLE}`, {}),
  })}

  ${(props) => BoxStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: get(props, `theme.styles.${GRID_STYLE}`, {}),
  })}
`;
