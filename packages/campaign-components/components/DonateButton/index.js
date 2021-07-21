import React from 'react';
import get from 'lodash/get';
import {
  AMOUNT_PROPERTY,
  LABEL_PROPERTY,
} from 'pkg.campaign-components/components/DonateButton/meta';
import { FundraisingContext } from 'pkg.campaign-components/context/Fundraising';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

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
