import get from 'lodash/get';
import Builder from 'pkg.builder';

export default function render(Components, page) {
  function recursiveRenderFill(componentId) {
    const component = get(page, `components.${componentId}`);
    if (!component) {
      // QUESTION: Throw error?
      return;
    }

    const tag = get(component, 'tag');
    page.components[componentId].render = Components[tag];

    if (Object.keys(get(component, 'slots', {})).length) {
      Object.keys(component.slots).forEach((slotId) =>
        component.slots[slotId].forEach((childComponentId) =>
          recursiveRenderFill(childComponentId)
        )
      );
    }
  }

  recursiveRenderFill(get(page, 'rootComponentId'));

  return Builder(React.createElement, page);
}
