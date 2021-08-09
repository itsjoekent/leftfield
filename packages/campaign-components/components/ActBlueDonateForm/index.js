import React from 'react';
import get from 'lodash/get';
import { DISCLAIMER_CLASS_NAME } from 'pkg.campaign-components/components/ActBlueDonateForm/css';
import {
  ONE_BUTTON_LAYOUT,
  MULTI_BUTTON_LAYOUT,

  ACTBLUE_FORM_PROPERTY,
  ENABLE_EXPRESS_DONATE_PROPERTY,
  EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
  REFCODE_PROPERTY,
  CARRY_TRACKING_SOURCE_PROPERTY,

  DONATE_BUTTONS_SLOT,
} from 'pkg.campaign-components/components/ActBlueDonateForm/meta';
import {
  initialFundraisingState,
  FundraisingContext,
} from 'pkg.campaign-components/context/Fundraising';
import useClientOnly from 'pkg.campaign-components/hooks/useClientOnly';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import makeActBlueLink from 'pkg.campaign-components/utils/makeActBlueLink';
import mapSourceToRefcode from 'pkg.campaign-components/utils/makeActBlueLink';

export default function ActBlueDonateForm(props) {
  const {
    componentClassName,
    properties,
    slots,
  } = props;

  const isClient = useClientOnly();
  const language = useLanguage();

  const buildUrl = React.useCallback((amount) => {
    const baseUrl = getPropertyValue(properties, ACTBLUE_FORM_PROPERTY, language);
    let params = {};

    if (!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY)) {
      params['express_lane'] = 'true';
    }

    if (!!getPropertyValue(properties, REFCODE_PROPERTY, null)) {
      params['refcode'] = getPropertyValue(properties, REFCODE_PROPERTY);
    }

    if (!!amount) {
      params['amount'] = amount;
    }

    if (isClient && !!getPropertyValue(properties, CARRY_TRACKING_SOURCE_PROPERTY)) {
      params = {
        ...params,
        ...mapSourceToRefcode(),
      };
    }

    return makeActBlueLink(baseUrl, params);
  }, [isClient]);

  const fundraisingState = {
    ...initialFundraisingState,
    buildUrl,
  };

  const donateButtons = get(slots, DONATE_BUTTONS_SLOT, null);

  if (!donateButtons) {
    return null;
  }

  if (donateButtons.length <= 1) {
    return (
      <FundraisingContext.Provider value={fundraisingState}>
        {donateButtons}
      </FundraisingContext.Provider>
    );
  }

  return (
    <FundraisingContext.Provider value={fundraisingState}>
      <div className={componentClassName}>
        {donateButtons}
        {!!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY) && (
          <p className={DISCLAIMER_CLASS_NAME}>
            {getPropertyValue(properties, EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY)}
          </p>
        )}
      </div>
    </FundraisingContext.Provider>
  );
}
