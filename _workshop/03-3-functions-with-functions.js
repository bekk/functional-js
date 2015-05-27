---
layout: workshop
collection: workshop
title: Functions with functions
section: 3
prev: 03-2-higher-order
name: 03-3-functions-with-functions
next: 03-4-fluent
slides:
info: |
  In JavaScript you can actually add functions onto existing
  functions. This can create sweet APIs. Let us look at an example.

  I have seen this pattern in many code bases:

  ```
  if (debug) console.log('some text');
  ```

  When you want to show debug information you set debug to `true`. You of
  course need to always remember to write that `if` everywhere in your
  code. Let us create a create a better API.
---
// PROBLEM: We want to guard a function, so that it only calls
// through to the function we pass in once we have called `start`
// on the guard. (See below for the tests to understand how this is
// supposed to work.)

function guard(fn) {
  var guard = function() {
  };

  // in JavaScript you can actually add
  // functions to existing functions

  guard.start = function() {
  };

  return guard;
};

describe('guard', function() {
  // Let's now guard a debug helper. To make it a little bit simpler
  // to test, we return a message instead of calling console.log or similar.

  var callCount = 0;
  var debug = guard(function(msg) {
    callCount += 1;
    return msg;
  });

  it('should not return anything if not started', function() {
    var result = debug('test 1');
    expect(callCount).to.equal(0);
    expect(result).to.equal(undefined);
  });

  it('should not return anything if not started even when invoked multiple times', function() {
    var result = debug('test 2');
    expect(callCount).to.equal(0);
    expect(result).to.equal(undefined);
  });

  it('should return if started', function() {
    // open up the guard
    debug.start();

    var result = debug('test 3');
    expect(callCount).to.equal(1);
    expect(result).to.equal('test 3');
  });

});
