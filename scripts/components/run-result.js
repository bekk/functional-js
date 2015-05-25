import React from 'react';
import component from './component';

export default component(function Result ({ stats, failures, errorResult }) {

    const tests   = stats.get('tests'),
          passes  = tests && stats.get('passes'),
          pending = tests && stats.get('pending'),
          failed = tests && stats.get('failures');

    const passesSummary = passes
      ? <span className="editor-success">{passes} of {tests} test{tests > 1 ? 's' : ''} passed</span>
      : null;

    const pendingPrefix = (passes && pending) ? ', ' : '';

    const pendingSummary = pending
      ? <span className="editor-pending">{pending} pending</span>
      : null;

    const failedPrefix = failed
      ? (passes || pending) ? ', ' : ''
      : null;

    const failedSummary = failed
      ? (passes || pending)
        ? <span className="editor-error">{failed} failed!</span>
        : <span className="editor-error">{failed} of {tests} test{tests > 1 ? 's' : ''} failed!</span>
      : null;

    const testResults = failures.toArray().map(test => {
      const suiteTitle = test.parent ? test.parent.title : '';
      return <div>✘ {suiteTitle} {test.title}<div className="editor-error">{test.err.message}</div></div>
    });

    const punctuation = !failed ? '.' : '';

    const errors = errorResult.deref();

  return <div>
    {tests
      ? <div className='test-summary'>{passesSummary}{pendingPrefix}{pendingSummary}{failedPrefix}{failedSummary}{punctuation}</div>
      : null}
    {tests
      ? <div className='test-result'>{testResults}</div>
      : null }
    {errors
      ? <div className='editor-error'><pre>{errors}</pre></div>
      : null}
  </div>;
});


