import React from 'react';
import get from 'lodash.get';
import { DISCLAIMER_CLASS_NAME } from '@cc/components/ActBlueDonateForm/css';
import {
  ONE_BUTTON_LAYOUT,
  MULTI_BUTTON_LAYOUT,

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
  initialFundraisingState,
  FundraisingContext,
} from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
import getPropertyValue from '@cc/utils/getPropertyValue';
import makeActBlueLink from '@cc/utils/makeActBlueLink';
import mapSourceToRefcode from '@cc/utils/makeActBlueLink';

export default function ActBlueDonateForm(props) {
  const {
    componentClassName,
    properties,
    slots,
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

  return (
    <FundraisingContext.Provider value={fundraisingState}>
      <div className={componentClassName}>
        {get(slots, DONATE_BUTTONS_SLOT, null)}
        {!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY) && (
          <p className={DISCLAIMER_CLASS_NAME}>
            {getPropertyValue(properties, EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY)}
          </p>
        )}
      </div>
    </FundraisingContext.Provider>
  );
}