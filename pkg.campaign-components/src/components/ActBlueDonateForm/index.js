import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import get from 'lodash.get';
import {
  ONE_BUTTON_LAYOUT,
  WIDE_LAYOUT,
  TWO_COLUMN_LAYOUT,
  THREE_COLUMN_LAYOUT,
  FOUR_COLUMN_LAYOUT,

  DISCLAIMER_TEXT_STYLE,

  LAYOUT_PROPERTY,
  ACTBLUE_FORM_PROPERTY,
  ENABLE_EXPRESS_DONATE_PROPERTY,
  EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
  EXPRESS_DONATE_TEXT_COLOR_PROPERTY,
  REFCODE_PROPERTY,
  CARRY_TRACKING_SOURCE_PROPERTY,

  DONATE_BUTTONS_SLOT,
  DONATE_BUTTON_SLOT,
  WIDE_MOBILE_DONATE_BUTTONS_SLOT,
  WIDE_DESKTOP_DONATE_BUTTONS_SLOT,
} from '@cc/components/ActBlueDonateForm/meta';
import { initialFundraisingState, FundraisingContext } from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
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

  // TODO: express disclaimer
  if (getPropertyValue(properties, LAYOUT_PROPERTY) === WIDE_LAYOUT) {
    <ThemeProvider theme={localTheme}>
      <FundraisingContext.Provider value={fundraisingState}>
        <WideGrid isMobile>
          {get(slots, WIDE_MOBILE_DONATE_BUTTONS_SLOT, null)}
        </WideGrid>
        <WideGrid>
          {get(slots, WIDE_DESKTOP_DONATE_BUTTONS_SLOT, null)}
        </WideGrid>
      </FundraisingContext.Provider>
    </ThemeProvider>
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
  grid-gap: ${(props) => getPropertyValue(props.theme.properties, LAYOUT_PROPERTY) === WIDE_LAYOUT ? '6px' : '16px'}
`;

const Disclaimer = styled.p`
  ${(props) => TextStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: get(props, `theme.styles.${DISCLAIMER_TEXT_STYLE}`, {}),
  })}

  text-align: center;
`;

const columnTypeToNumber = {
  [TWO_COLUMN_LAYOUT.key]: 2,
  [THREE_COLUMN_LAYOUT.key]: 3,
  [FOUR_COLUMN_LAYOUT.key]: 4,
};

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => get(columnTypeToNumber, getPropertyValue(props.theme.properties, LAYOUT_PROPERTY))}, 1fr);
  grid-gap: 8px;

  @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
    grid-gap: 12px;
  }
`;

const WideGrid = styled.div`
  display: ${(props) => props.isMobile ? 'grid' : 'none'};
  grid-template-columns: repeat(${(props) => get(props, `slots.${WIDE_MOBILE_DONATE_BUTTONS_SLOT}.length`)}, 1fr);
  grid-gap: 8px;

  @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
    display: ${(props) => props.isMobile ? 'none' : 'grid'};
    grid-template-columns: repeat(${(props) => get(props, `slots.${WIDE_DESKTOP_DONATE_BUTTONS_SLOT}.length`)}, 1fr);
    grid-gap: 12px;
  }
`;
