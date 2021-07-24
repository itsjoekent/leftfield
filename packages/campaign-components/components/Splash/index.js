import React from 'react';
import get from 'lodash/get';
import {
  PHOTO_COLUMN_CLASS_NAME,
  CONTENT_COLUMN_CLASS_NAME,
} from 'pkg.campaign-components/components/Splash/css';
import {
  PHOTO_ALT_PROPERTY,
  CONTENT_SLOT,
} from 'pkg.campaign-components/components/Splash/meta';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export default function Splash(props) {
  const {
    componentClassName,
    properties,
    slots,
  } = props;

  const language = useLanguage();
  const content = get(slots, CONTENT_SLOT, null);

  return (
    <div className={componentClassName}>
      <div className={PHOTO_COLUMN_CLASS_NAME}>
        <img src="https://images.unsplash.com/photo-1578318974843-a022fbc3bd7f?auto=format&fit=crop&w=1226&q=80" alt={getPropertyValue(properties, PHOTO_ALT_PROPERTY, language)} />
      </div>
      <div className={CONTENT_COLUMN_CLASS_NAME}>
        {content}
      </div>
    </div>
  );
}
