import React from 'react';
import get from 'lodash/get';
import { SECTIONS_SLOT } from 'pkg.campaign-components/components/Root/meta';

export default function Root(props) {
  const { componentClassName, slots } = props;

  return (
    <div className={componentClassName}>
      {get(slots, SECTIONS_SLOT, null)}
    </div>
  );
}
