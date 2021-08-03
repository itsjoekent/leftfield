import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Buttons, Icons } from 'pkg.admin-components';

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export default function MarkButton(props) {
  const { format, icon, label } = props;

  const editor = useSlate();

  const isActive = isMarkActive(editor, format);

  return (
    <Buttons.IconButton
      IconComponent={Icons[icon]}
      color={(colors) => isActive ? colors.mono[700] : colors.mono[500]}
      hoverColor={(colors) => colors.mono[700]}
      onClick={() => toggleMark(editor, format)}
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={isActive}
    />
  );
}
