import React from 'react';
import ReactDOM from 'react-dom';
import render from 'pkg.layout';

function Simulator() {
  // setup iframe listener
  // move page structure to state
  // highlighted element

  const RootElement = render(
    React.createElement,
    {
      layout: [
        {
          id: '1',
          children: [
            {
              id: '2',
            },
            {
              id: '3',
              children: [
                {
                  id: '4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      1: (props) => React.createElement('div', props),
      2: (props) => React.createElement('h1', null, null, props.title),
      3: (props) => React.createElement('div', props),
      4: (props) => React.createElement('p', null, props.subtitle),
    },
    {
      2: { title: 'Test title' },
      4: { subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
    }
  );

  return RootElement;
}

export default function renderSimulator() {
  ReactDOM.render(
    <React.StrictMode>
      <Simulator />
    </React.StrictMode>,
    document.getElementById('root')
  );
}