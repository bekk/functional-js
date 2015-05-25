import React from 'react';
import immstruct from 'immstruct';

import Editor from './components/editor';

const runnables = document.querySelectorAll('.editor');
for (let i = 0; i < runnables.length; i++) {
  const runnable = runnables[i];

  const textarea = runnable.querySelector('textarea');
  const source = textarea.value;
  runnable.removeChild(textarea);

  const isLarge = runnable.dataset.isLarge;
  createEditorRenderLoop(runnable, source, isLarge);
}

function createEditorRenderLoop (container, source, isLarge) {

  const data = immstruct({ source });
  const timers = { intervals: [], timeouts: [] };
  const render = () =>
    React.render(
      <Editor
        source={data.cursor('source')}
        statics={{ timers, isLarge }} />,
      container);

  data.on('swap', () => render());
  render();
}
