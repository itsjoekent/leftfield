import React from 'react';
import get from 'lodash/get';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export const TAG = 'CommitteeDisclaimer';

export const COPY_PROPERTY = 'COPY_PROPERTY';

export const DISCLAIMER_BOX_STYLE = 'DISCLAIMER_BOX_STYLE';
export const DISCLAIMER_TEXT_STYLE = 'DISCLAIMER_TEXT_STYLE';

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
