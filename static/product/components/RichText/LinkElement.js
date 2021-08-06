import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate';
import { useSlate } from 'slate-react';
import { Typography } from 'pkg.admin-components';
import { setModal, ADD_LINK_MODAL } from '@product/features/modal';

function getLink(editor) {
  const [match] = Editor.nodes(editor, {
    match: (node) => !Editor.isEditor(node)
      && SlateElement.isElement(node)
      && node.type === 'link',
  });

  return match;
}

export default function LinkElement(props) {
  const { attributes, children } = props;

  const dispatch = useDispatch();
  const editor = useSlate();

  const onClick = React.useCallback(() => {
    const link = getLink(editor);

    function onInsert({ href }) {
      Transforms.setNodes(
        editor,
        { url: href },
        {
          at: link[1],
        },
      );
    }

    if (!link) {
      return;
    }

    dispatch(setModal({
      type: ADD_LINK_MODAL,
      props: {
        includeTextField: false,
        href: link[0].url,
        onInsert,
      },
    }));
  }, [editor]);

  return (
    <Typography
      as="a"
      fontSize="18px"
      fontStyle="regular"
      fg={(colors) => colors.blue[500]}
      onClick={onClick}
    >
      <span {...attributes}>{children}</span>
    </Typography>
  );
}
