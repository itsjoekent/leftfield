import React from 'react';
import get from 'lodash/get';

export const TAG = 'Root';

export const SECTIONS_SLOT = 'SECTIONS_SLOT';

export const BACKGROUND_STYLE = 'BACKGROUND_STYLE';

export default function Root(props) {
  const { componentClassName, slots } = props;

  return (
    <div className={componentClassName}>
      {get(slots, SECTIONS_SLOT, null)}
    </div>
  );
}
