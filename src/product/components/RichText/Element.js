import React from 'react';
import { Typography } from 'pkg.admin-components';

export default function Element(props) {
  const { attributes, children, element: { type } } = props;

  switch (type) {
    case 'heading-one': return (
      <Typography
        as="h1"
        fontSize="32px"
        fontStyle="extraBold"
        fg={(colors) => colors.mono[700]}
      >
        <span {...attributes}>{children}</span>
      </Typography>
    );

    case 'heading-two': return (
      <Typography
        as="h2"
        fontSize="28px"
        fontStyle="bold"
        fg={(colors) => colors.mono[700]}
      >
        <span {...attributes}>{children}</span>
      </Typography>
    );

    case 'heading-three': return (
      <Typography
        as="h3"
        fontSize="24px"
        fontStyle="medium"
        fg={(colors) => colors.mono[700]}
      >
        <span {...attributes}>{children}</span>
      </Typography>
    );

    case 'heading-four': return (
      <Typography
        as="h4"
        fontSize="20px"
        fontStyle="bold"
        fg={(colors) => colors.mono[700]}
      >
        <span {...attributes}>{children}</span>
      </Typography>
    );

    case 'paragraph':
    default: return (
      <Typography
        as="p"
        fontSize="18px"
        fontStyle="regular"
        fg={(colors) => colors.mono[700]}
      >
        <span {...attributes}>{children}</span>
      </Typography>
    );
  }
}
