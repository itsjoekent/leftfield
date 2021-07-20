import React from 'react';
import renderer from 'react-test-renderer';
import renderPageComponents from './';

test('Renders the tree as expected', () => {
  const TestElement = renderPageComponents(
    React.createElement,
    {
      rootElementId: '1',
      components: [
        {
          id: '1',
          render: (props) => React.createElement('div', null, [props.slots['a'], props.slots['b']]),
          slots: {
            'a': ['2'],
            'b': ['3']
          },
        },
        {
          id: '2',
          properties: {
            title: 'Test title',
          },
          render: (props) => React.createElement('h1', null, props.properties.title),
        },
        {
          id: '3',
          render: (props) => React.createElement('div', null, props.slots['c']),
          slots: {
            'c': ['4'],
          },
        },
        {
          id: '4',
          properties: {
            subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          render: (props) => React.createElement('p', null, props.properties.subtitle),
        },
      ],
    },
  );

  const component = renderer.create(TestElement);

  expect(JSON.stringify(component.toJSON())).toEqual(
    `{"type":"div","props":{},"children":[{"type":"h1","props":{},"children":["Test title"]},{"type":"div","props":{},"children":[{"type":"p","props":{},"children":["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]}]}]}`
  );
});

test('Renders the tree with a wrapper component as expected', () => {
  const TestElement = renderPageComponents(
    React.createElement,
    {
      rootElementId: '1',
      components: [
        {
          id: '1',
          render: (props) => React.createElement('div', null, [props.slots['a'], props.slots['b']]),
          slots: {
            'a': ['2'],
            'b': ['3']
          },
        },
        {
          id: '2',
          properties: {
            title: 'Test title',
          },
          render: (props) => React.createElement('h1', null, props.properties.title),
        },
        {
          id: '3',
          render: (props) => React.createElement('div', null, props.slots['c']),
          slots: {
            'c': ['4'],
          },
        },
        {
          id: '4',
          properties: {
            subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          render: (props) => React.createElement('p', null, props.properties.subtitle),
        },
      ],
    },
    ({ children }) => React.createElement('article', null, children),
  );

  const component = renderer.create(TestElement);
  expect(JSON.stringify(component.toJSON())).toEqual(
    `{"type":"article","props":{},"children":[{"type":"div","props":{},"children":[{"type":"article","props":{},"children":[{"type":"h1","props":{},"children":["Test title"]}]},{"type":"article","props":{},"children":[{"type":"div","props":{},"children":[{"type":"article","props":{},"children":[{"type":"p","props":{},"children":["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]}]}]}]}]}]}`
  );
});

// test('Throws error for invalid page data', () => {
//   expect(() => renderPageComponents()).toThrow();
//   expect(() => renderPageComponents(React.createElement)).toThrow();
//   expect(() => renderPageComponents(React.createElement, {})).toThrow();
//   expect(() => renderPageComponents(React.createElement, { layout: [] })).toThrow();
//   expect(() => renderPageComponents(React.createElement, { layout: [] }, '')).toThrow();
//   expect(() => renderPageComponents(React.createElement, { layout: [] }, {})).toThrow();
//   expect(() => renderPageComponents(React.createElement, { layout: [] }, {}, 1)).toThrow();
// });
