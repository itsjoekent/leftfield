import React from 'react';
import copy from 'copy-to-clipboard';
import { useDispatch } from 'react-redux';
import { pushSnack } from '@product/features/snacks';

export default function ClickToCopy(props) {
  const { children, text } = props;

  const dispatch = useDispatch();

  function onClick() {
    copy(text);

    dispatch(pushSnack({
      message: 'Copied to clipboard!',
    }));
  }

  return children({ onClick, cursor: 'pointer' });
}
