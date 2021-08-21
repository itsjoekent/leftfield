import React from 'react';
import isUrl from 'is-url';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  Editor,
  Element as SlateElement,
  Range,
  Text,
  Transforms,
} from 'slate';
import { useSlate } from 'slate-react';
import { Buttons, Icons } from 'pkg.admin-components';
import { setModal, ADD_LINK_MODAL } from '@product/features/modal';
import isTrue from '@product/utils/isTrue';

function getLink(editor) {
  const [match] = Editor.nodes(editor, {
    match: (node) => !Editor.isEditor(node)
      && SlateElement.isElement(node)
      && node.type === 'link',
  });

  return match;
}

function unwrapLink(editor) {
  Transforms.unwrapNodes(editor, {
    match: (node) => !Editor.isEditor(node)
      && SlateElement.isElement(node)
      && node.type === 'link',
  });
}

export function withLinks(editor) {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  }

  function insertUrl(text, ifNotLink) {
    if (text && isUrl(text)) {
      const element = {
        type: 'link',
        url: text,
        children: [{ text }],
      };

      Transforms.insertNodes(editor, element);
    } else {
      ifNotLink();
    }
  }

  editor.insertText = function (text) {
    insertUrl(text, () => insertText(text));
  }

  editor.insertData = function (data) {
    const text = data.getData('text/plain');
    insertUrl(text, () => insertData(data));
  }

  return editor;
};

export default function LinkButton() {
  const dispatch = useDispatch();
  const editor = useSlate();

  const link = getLink(editor);
  const hasLink = !!link;

  function onClick() {
    if (hasLink) {
      unwrapLink(editor);
      return;
    }

    const openInNewTab = !!link && isTrue(get(link[0], 'openInNewTab', false));

    const selection = editor.selection;
    const isExpanded = Range.isExpanded(editor.selection);
    const includeTextField = !isExpanded;

    function onInsert({ href, text, openInNewTab }) {
      if (isExpanded) {
        const element = {
          openInNewTab,
          type: 'link',
          url: href,
        };

        Transforms.select(editor, selection);
        Transforms.wrapNodes(editor, element, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
      } else {
        const element = {
          children: [{ text: text || href }],
          openInNewTab,
          type: 'link',
          url: href,
        };

        Transforms.insertNodes(editor, element);
      }
    }

    dispatch(setModal({
      type: ADD_LINK_MODAL,
      props: {
        includeNewTabField: true,
        includeTextField,
        href: '',
        onInsert,
        openInNewTab,
      },
    }));
  }

  return (
    <Buttons.IconButton
      IconComponent={Icons.Link}
      color={(colors) => hasLink ? colors.mono[700] : colors.mono[500]}
      hoverColor={(colors) => colors.mono[700]}
      onClick={onClick}
      type="button"
      role="switch"
      aria-label="Toggle link"
      aria-checked={hasLink}
    />
  );
}
