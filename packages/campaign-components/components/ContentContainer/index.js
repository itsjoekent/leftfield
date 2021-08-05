import React from 'react';
import get from 'lodash/get';
import { CONTENT_CONTAINER_SLOT } from 'pkg.campaign-components/components/ContentContainer/meta';

export default function ContentContainer(props) {
  const { componentClassName, slots } = props;

  return (
    <div className={componentClassName}>
      {get(slots, CONTENT_CONTAINER_SLOT, null)}
    </div>
  );
}
