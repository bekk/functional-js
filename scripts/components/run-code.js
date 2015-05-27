import React from 'react';
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import immstruct from 'immstruct';
import chai from 'chai';
import _ from 'lodash';
import books from './books';
chai.should();

// TODO y no worky?
// import Mocha from 'mocha/mocha';
// import to5 from '6to5/browser';

import CodeMirrorEditor from './codemirror-editor';
import RunResult from './run-result';
import PlaygroundReporter from '../playground-reporter';
import omniscient from 'omniscient';
import component from './component';

export default component(
  {
    renderResults: function (data) {
      React.render(
        <RunResult
          stats={data.cursor('stats')}
          failures={data.cursor('failures')}
          errorResult={data.cursor('errorResult')} />,
        this.getDOMNode().querySelector('.results'));
    },

    componentDidMount: function () {
      this.data = immstruct({});
      this.data.on('swap', () => this.renderResults(this.data.cursor()));
      runCode.call(this, this.data.cursor());
    },

    componentDidUpdate: function () {
      if (!this.data) return;
      runCode.call(this, this.data.cursor());
    }
  },
  function RunCode () {
    return <div>
      <h3>Test results:</h3>
      <div className='results'></div>
      <h3>Output:</h3>
      <div className='react-result'>
      </div>
    </div>
  });

const runCode = function () {
  // console.clear();

  const { source, statics } = this.props;

  const src = source.deref();

  if (/\{this\}/.test(src)) // everything hangs when you do this, so don't run with it
    return;

  const hasTest = (/it\(/.test(src));

  const container = this.getDOMNode();
  const resultEl = container.querySelector('.react-result');
  resultEl.innerHTML = ''; // clear previous results when compilation fails

  const cursor = this.data.cursor();

  cursor.update(data => {
    data = data.removeIn(['stats']);
    data = data.removeIn(['errorResult']);
    return data;
  });

  const context = {};
  const mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  const timers = statics.timers;

  timers.timeouts.forEach(id => clearTimeout(id));
  timers.intervals.forEach(id => clearInterval(id));

  timers.timeouts = [];
  timers.intervals = [];

  const newSetTimeout = function () {
    const id = setTimeout.apply(this, arguments);
    timers.timeouts.push(id);
    return id;
  };
  const newSetInterval = function () {
    const id = setInterval.apply(this, arguments);
    timers.intervals.push(id);
    return id;
  };

  try {

    const srcWithoutComments = src.replace(/\s+?\/\/.*/g, '');

    const compiledCode = to5.transform(srcWithoutComments).code;

    const log = function log() {
      var container = document.createElement('div');
      container.innerHTML = _(arguments).join(' ');

      var existing = resultEl.innerHTML;

      resultEl.innerHTML = existing + container.outerHTML;
      console.log(...arguments);
    }

    const fn = Function.apply(null, [
      '_', 'log', 'books', 'Immutable',
      'setTimeout', 'setInterval',
      'chai', 'expect',
      'describe', 'xdescribe',
      'it', 'xit',
      'before', 'beforeEach',
      'after', 'afterEach',
        compiledCode]);

    const it = context.it.bind(context);
    it.only = context.it.only.bind(context);

    fn(_, log, books, Immutable,
       newSetTimeout, newSetInterval,
       chai, chai.expect,
       context.describe.bind(context), context.xdescribe.bind(context),
       it, context.xit.bind(context),
       context.before.bind(context), context.beforeEach.bind(context),
       context.after.bind(context), context.afterEach.bind(context));

    if (hasTest) {
      mocha.run(reporter =>
        cursor.update(data => {
          data = data.removeIn(['errorResult']);
          data = data.updateIn(['stats'], _ => Immutable.fromJS(reporter.stats));
          data = data.updateIn(['failures'], _ => Immutable.fromJS(reporter.failures));
          return data;
        }));
    }
  }
  catch (e) {
    console.error(e);
    cursor.update(data => {
      data = data.updateIn(['errorResult'], _ => e.message);
      data = data.removeIn(['stats']);
      data = data.removeIn(['failures']);
      return data;
    });
  }
}
