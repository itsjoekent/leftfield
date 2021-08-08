import escapeHtml from 'escape-html';
import get from 'lodash/get';
import md5 from 'md5';
import { createElement } from 'react';
import { Text } from 'slate';
import isTrue from 'pkg.campaign-components/utils/isTrue';

const PureText = ({ children }) => children;

export default function serializeRichText({
  value,
  inline = false,
  ignoreEmpty = true,
  blockClassName = '',
  renderToElement = false,
}) {
  function serializeNode(node, index = 0) {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);

      const elementProps = { key: md5(`${index}-${string}`) };
      let Element = renderToElement && createElement(PureText, elementProps, string);

      if (!string.length && ignoreEmpty) {
        return null;
      }

      if (node.bold) {
        string = `<strong>${string}</strong>`;
        Element = renderToElement && createElement('strong', elementProps, Element);
      }

      if (node.italic) {
        string = `<em>${string}</em>`;
        Element = renderToElement && createElement('em', elementProps, Element);
      }

      if (node.underline) {
        string = `<u>${string}</u>`;
        Element = renderToElement && createElement('u', elementProps, Element);
      }

      if (renderToElement) {
        return Element;
      }

      return string;
    }

    let children = (Array.isArray(node) ? node : node.children)
      .map((childNode, index) => serializeNode(childNode, index));

    if (ignoreEmpty) {
      children = children.filter((childNode) => !!childNode);

      if (!children.length) {
        if (renderToElement) {
          return null;
        }

        return '';
      }
    }

    if (!renderToElement) {
      children = children.join('');
    }

    const key = md5(`${index}-${JSON.stringify(node)}`);

    if (node.type === 'link') {
      const href = escapeHtml(node.url);
      const openInNewTab = isTrue(get(node, 'openInNewTab'), false);

      if (renderToElement) {
        const anchorProps = { href, key };

        if (openInNewTab) {
          anchorProps.target = '_blank';
          anchorProps.rel = 'noopener noreferrer';
        }

        return createElement('a', anchorProps, children);
      }

      const anchorAttributes = `href="${href}" ${openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''}`;
      return `<a ${anchorAttributes}>${children}</a>`;
    }

    if (inline) {
      return children;
    }

    const blockProps = {
      className: blockClassName,
      key,
    };

    switch (node.type) {
      case 'heading-one':
        if (renderToElement) {
          return createElement('h1', blockProps, children);
        }

        return `<h1 class="${blockClassName}">${children}</h1>`;

      case 'heading-two':
        if (renderToElement) {
          return createElement('h2', blockProps, children);
        }

        return `<h2 class="${blockClassName}">${children}</h2>`;

      case 'heading-three':
        if (renderToElement) {
          return createElement('h3', blockProps, children);
        }

        return `<h3 class="${blockClassName}">${children}</h3>`;

      case 'heading-four':
        if (renderToElement) {
          return createElement('h4', blockProps, children);
        }

        return `<h4 class="${blockClassName}">${children}</h4>`;

      case 'quote':
        if (renderToElement) {
          return createElement('blockquote', blockProps, children);
        }

        return `<blockquote class="${blockClassName}"><p>${children}</p></blockquote>`;

      case 'paragraph':
        if (renderToElement) {
          return createElement('p', blockProps, children);
        }

        return `<p class="${blockClassName}">${children}</p>`;

      default:
        return children;
    }
  }

  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return serializeNode(JSON.parse(value));
  }

  return serializeNode(value);
}
