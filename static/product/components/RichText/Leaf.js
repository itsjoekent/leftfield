import React from 'react';

export default function Leaf(props) {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = (<strong>{children}</strong>);
  }

  if (leaf.code) {
    children = (<code>{children}</code>);
  }

  if (leaf.italic) {
    children = (<em>{children}</em>);
  }

  if (leaf.underline) {
    children = (<u>{children}</u>);
  }

  return (
    <span {...attributes}>{children}</span>
  );
}
