import React from 'react';
import get from 'lodash/get';
import {
  PHOTO_COLUMN_CLASS_NAME,
  CONTENT_COLUMN_CLASS_NAME,
} from 'pkg.campaign-components/components/Splash/css';
import {
  PHOTO_ALT_PROPERTY,
  PHOTO_SOURCE_PROPERTY,
  CONTENT_SLOT,
} from 'pkg.campaign-components/components/Splash/meta';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import CfImageUrl from 'pkg.cf-image-url';

export default function Splash(props) {
  const {
    componentClassName,
    properties,
    slots,
    styles,
  } = props;

  const language = useLanguage();
  const content = get(slots, CONTENT_SLOT, null);

  const fileUrl = getPropertyValue(
    properties,
    PHOTO_SOURCE_PROPERTY,
  );

  const srcset = [
    `${CfImageUrl(fileUrl, { width: '720px' })} 410w`,
    `${CfImageUrl(fileUrl, { width: '1024px' })} 720w`,
    `${CfImageUrl(fileUrl, { width: '1440px' })} 1024w`,
  ].join(',\n');

  return (
    <div className={componentClassName}>
      <div className={PHOTO_COLUMN_CLASS_NAME}>
        {!!fileUrl && (
          <img
            src={CfImageUrl(fileUrl, { width: '410px' })}
            srcSet={srcset}
            alt={getPropertyValue(properties, PHOTO_ALT_PROPERTY, language)}
          />
        )}
      </div>
      <div className={CONTENT_COLUMN_CLASS_NAME}>
        {content}
      </div>
    </div>
  );
}
