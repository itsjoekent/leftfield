import React from 'react';
import get from 'lodash/get';
import { COPY_PROPERTY } from 'pkg.campaign-components/components/CommitteeDisclaimer/meta';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export default function CommitteeDisclaimer(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();
  const copy = getPropertyValue(properties, COPY_PROPERTY, language);

  return (
    <div className={componentClassName}>
      <span>
        {copy}
      </span>
    </div>
  );
}
