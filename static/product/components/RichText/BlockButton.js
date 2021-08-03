import React from 'react';
import {
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate';
import { useSlate } from 'slate-react';
import { Buttons, Icons } from 'pkg.admin-components';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: (node) => !Editor.isEditor(node)
      && SlateElement.isElement(node) && node.type === format,
  });

  return !!match
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (node) => LIST_TYPES.includes(
      !Editor.isEditor(node) && SlateElement.isElement(node) && node.type
    ),
    split: true,
  });

  const newProperties = {
    type: isActive ? 'paragraph' : (isList ? 'list-item' : format),
  };

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export default function BlockButton(props) {
  const { format, icon, label } = props;

  const editor = useSlate();

  const isActive = isBlockActive(editor, format);

  return (
    <Buttons.IconButton
      IconComponent={Icons[icon]}
      color={(colors) => isActive ? colors.mono[700] : colors.mono[500]}
      hoverColor={(colors) => colors.mono[700]}
      onClick={() => toggleBlock(editor, format)}
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={isActive}
    />
  );
}
