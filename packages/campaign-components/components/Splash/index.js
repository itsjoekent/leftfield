import React from 'react';
import get from 'lodash/get';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export const TAG = 'Splash';

export const PHOTO_ALT_PROPERTY = 'PHOTO_ALT_PROPERTY';
export const PHOTO_SOURCE_PROPERTY = 'PHOTO_SOURCE_PROPERTY';

export const CONTENT_SLOT = 'CONTENT_SLOT';

export const CONTENT_STYLE = 'CONTENT_STYLE';
export const PHOTO_STYLE = 'PHOTO_STYLE';

export const PHOTO_COLUMN_CLASS_NAME = 'photo-column';
export const CONTENT_COLUMN_CLASS_NAME = 'content-column';

export const PHOTO_SIZE_ATTRIBUTE = 'PHOTO_SIZE_ATTRIBUTE';
export const PHOTO_HORIZONTAL_POSITION_ATTRIBUTE = 'PHOTO_HORIZONTAL_POSITION_ATTRIBUTE';
export const PHOTO_VERTICAL_POSITION_ATTRIBUTE = 'PHOTO_VERTICAL_POSITION_ATTRIBUTE';

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

  return (
    <div className={componentClassName}>
      <div className={PHOTO_COLUMN_CLASS_NAME}>
        {!!fileUrl && (
          <img
            src={fileUrl}
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
