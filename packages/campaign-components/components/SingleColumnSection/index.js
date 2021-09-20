import React from 'react';
import get from 'lodash/get';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export const TAG = 'SingleColumnSection';

export const BACKGROUND_IMAGE_SOURCE_PROPERTY = 'BACKGROUND_IMAGE_SOURCE_PROPERTY';
export const BACKGROUND_IMAGE_ALT_PROPERTY = 'BACKGROUND_IMAGE_ALT_PROPERTY';

export const CONTENT_SLOT = 'CONTENT_SLOT';

export const BACKGROUND_IMAGE_STYLE = 'BACKGROUND_IMAGE_STYLE';
export const CONTAINER_STYLE = 'CONTAINER_STYLE';
export const CONTENT_STYLE = 'CONTENT_STYLE';

export const BACKGROUND_IMAGE_HORIZONTAL_POSITION_ATTRIBUTE = 'BACKGROUND_IMAGE_HORIZONTAL_POSITION_ATTRIBUTE';
export const BACKGROUND_IMAGE_VERTICAL_POSITION_ATTRIBUTE = 'BACKGROUND_IMAGE_VERTICAL_POSITION_ATTRIBUTE';

export const BACKGROUND_IMAGE_CLASS_NAME = 'background-image';
export const CONTENT_COLUMN_CLASS_NAME = 'content-column';

export default function SingleColumnSection(props) {
  const {
    componentClassName,
    properties,
    slots,
  } = props;

  const language = useLanguage();
  const content = get(slots, CONTENT_SLOT, null);

  const fileUrl = getPropertyValue(
    properties,
    BACKGROUND_IMAGE_SOURCE_PROPERTY,
  );

  return (
    <section className={componentClassName}>
      {!!fileUrl && (
        <img
          className={BACKGROUND_IMAGE_CLASS_NAME}
          src={fileUrl}
          alt={getPropertyValue(properties, BACKGROUND_IMAGE_ALT_PROPERTY, language)}
        />
      )}
      <div className={CONTENT_COLUMN_CLASS_NAME}>
        {content}
      </div>
    </section>
  );
}
