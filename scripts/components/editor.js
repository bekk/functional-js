import React from 'react';
import omniscient from 'omniscient';

import component from './component';
import CodeMirrorEditor from './codemirror-editor';
import RunCode from './run-code';

export default component(function Editor ({ source }, { isLarge, timers }) {

  return <div className='window editor'>
    <div className='inner inner--code'>
      <CodeMirrorEditor
        source={source}
        statics={{isLarge}}
        />
    </div>
    <div className="inner inner--result">
      <RunCode
        source={source}
        statics={{timers}}
        />
    </div>
  </div>;
});

