import React from 'react';
import get from 'lodash.get';
import { SECTIONS_SLOT } from '@cc/components/Root/meta';

export default function Root(props) {
  const { slots, componentClassName } = props;

  return (
    <div className={componentClassName}>
      {get(slots, SECTIONS_SLOT, null)}
    </div>
  );
}
