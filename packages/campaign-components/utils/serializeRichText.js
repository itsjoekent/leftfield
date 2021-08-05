import escapeHtml from 'escape-html';
import { Text } from 'slate';

export default function serializeRichText(value, inline = false) {
  function serializeNode(node) {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);

      if (node.bold) {
        string = `<strong>${string}</strong>`;
      }

      if (node.italic) {
        string = `<em>${string}</em>`;
      }

      if (node.underline) {
        string = `<u>${string}</u>`;
      }

      return string;
    }

    const children = (Array.isArray(node) ? node : node.children)
      .map((childNode) => serializeNode(childNode)).join('');

    if (inline) {
      return children;
    }

    switch (node.type) {
      case 'heading-one':
        return `<h1>${children}</h1>`;
      case 'heading-two':
        return `<h2>${children}</h2>`;
      case 'heading-three':
        return `<h3>${children}</h3>`;
      case 'heading-four':
        return `<h4>${children}</h4>`;
      case 'quote':
        return `<blockquote><p>${children}</p></blockquote>`;
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'link':
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      default:
        return children;
    }
  }

  if (!value) {
    return null;
  }

  return serializeNode(JSON.parse(value));
}
