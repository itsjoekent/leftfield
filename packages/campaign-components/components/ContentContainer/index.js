import React from 'react';
import get from 'lodash/get';

export const TAG = 'ContentContainer';

export const CONTENT_CONTAINER_SLOT = 'CONTENT_CONTAINER_SLOT';

export const CONTENT_CONTAINER_STYLE = 'CONTENT_CONTAINER_STYLE';

export default function ContentContainer(props) {
  const { componentClassName, slots } = props;

  return (
    <div className={componentClassName}>
      {get(slots, CONTENT_CONTAINER_SLOT, null)}
    </div>
  );
}
