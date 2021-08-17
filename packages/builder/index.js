import get from 'lodash/get';

/**
 * Render a page.
 *
 * @param {Function} createElement Virtual dom function to create an element.
 *    Should accept the standard `component, props, ...children arguments.
 * @param {Object} page JSON representation of the page layout.
 * @param {Object} components Key value map of component ID's and render functions.
 * @param {Object} initialProps Key value map of component ID's and initial data to render with.
 * @param {Function} [wrapperComponent=null] Optional component to wrap every parent component.
 * @returns Array of virtual dom elements
 */
function construct(
  createElement,
  page,
  targetComponentId,
  wrapperComponentRender = null,
  key = null,
) {
  const component = page.components[targetComponentId];
  if (!component) return null;

  const {
    properties,
    render,
    slots,
    styles,
  } = component;

  const renderedSlots = Object
    .keys(slots || {})
    .reduce((acc, slotId) => ({
      ...acc,
      [slotId]: slots[slotId].map((componentId) => construct(
        createElement,
        page,
        componentId,
        wrapperComponentRender,
        componentId,
      )),
    }), {});

  const props = {
    componentClassName: `c-${targetComponentId}`,
    properties: properties || {},
    settings: page.settings,
    slots: renderedSlots,
    styles: styles || {},
  };

  if (wrapperComponentRender) {
    const wrapperProps = {};
    if (key) {
      wrapperProps.key = key;
    }

    return createElement(
      wrapperComponentRender,
      wrapperProps,
      createElement(
        render,
        props,
      ),
    );
  }

  if (key) {
    props.key = key;
  }

  return createElement(
    render,
    props,
  );
}

/**
 * Render a page.
 *
 * @param {Function} createElement Virtual dom function to create an element.
 *    Should accept the standard `component, props, ...children arguments.
 * @param {Object} page JSON representation of the page layout.
 * @param {Function} [wrapperComponent=null] Optional component to wrap every parent component.
 * @returns Virtual dom element
 */
export default function builder(
  createElement,
  page,
  wrapperComponentRender = null,
) {
  if (!createElement || typeof createElement !== 'function') {
    throw new Error('Invalid createElement argument');
  }

  if (!page || typeof page !== 'object' || !page.components) {
    throw new Error('Failed to render page, invalid "page" syntax.');
  }

  // if (!!wrapperComponent && typeof wrapperComponent !== 'function') {
  //   throw new Error('Invalid wrapperComponent argument');
  // }

  return construct(
    createElement,
    page,
    page.rootComponentId,
    wrapperComponentRender,
  );
}
