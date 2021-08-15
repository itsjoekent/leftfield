import React from 'react';
import get from 'lodash/get';
import { FundraisingContext } from 'pkg.campaign-components/context/Fundraising';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export const TAG = 'DonateButton';

export const BUTTON_STYLE = 'BUTTON_STYLE';

export const AMOUNT_PROPERTY = 'AMOUNT_PROPERTY';
export const LABEL_PROPERTY = 'LABEL_PROPERTY';

export default function DonateButton(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();
  const { buildUrl } = React.useContext(FundraisingContext);

  const href = buildUrl(getPropertyValue(properties, AMOUNT_PROPERTY, language));
  const label = getPropertyValue(properties, LABEL_PROPERTY, language);

  return (
    <a href={href} className={componentClassName}>
      {label}
    </a>
  );
}
