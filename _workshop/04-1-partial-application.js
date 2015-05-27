---
layout: workshop
collection: workshop
title: Partial application
section: 4
prev: 03-5-arity
name: 04-1-partial-application
next: 04-2-functions-from-functions
slides:
info: |
  Partial application describes the process of presetting the value of
  some arguments "up front", i.e. we bind argument values to values
  that we supply, producing a function that accepts less arguments.
---
// We will start by using `bind`, which is yet another way of
// specifying `this` in JavaScript.
describe('partiall application with bind', function() {

  function addOne() {
      return this + 1;
  }

  var fourPlusOne = addOne.bind(4)

  it('on functions with no arguments', function() {
    var result = fourPlusOne();
    expect(result).to.equal(5);
  });

  // However, `bind` can do more powerful stuff than this: we can
  // actually partially apply some arguments. It's easier to
  // understand this with an example. Let's say we have a function
  // that takes two parameters:

  function plus(a, b) {
      return a + b;
  }

  // Now, let's bind the first of these parameters, `a`, to
  // the value 2.

  var addTwo = plus.bind(null, 2);

  // This returns a new function where `a` is already set to `2` and `this` is
  // set to `null`. This new function we can then call with the last parameter, `b`:

  it('on function arguments', function() {
    var result = addTwo(40);
    expect(result).to.equal(42);
  });

});

// This is a powerful technique. The only problem with `bind`, is that we need
// to specify the context ourselves (e.g. as `null` above when we created
// `addTwo`). However, as we learned when we looked at decorators, this is
// something a function can do for us (using `call` or `apply` internally).
// Also, in some cases we might want to partially apply from the right instead
// of from the left. It's time to get back to Lo-Dash and the helpers offered
// there.

// Let's start by going back to plus:

function plus(a, b) {
    return a + b;
}

var addTwo = _.partial(plus, 2);

describe('partial application with _.partial', function() {
  // Using Lo-Dash's partial application helper, we could write:

  it('should work the same as bind', function() {
    var result = addTwo(40);
    expect(result).to.equal(42);
  });

});

// PROBLEM: Use `_.partialRight` to apply in the other direction,
// i.e. to set `b` first.

var addThree = function() {
};

describe('addThree', function() {

  it('should have bound argument', function() {
    var result = addThree(5);
    expect(result).to.equal(8);
  });

});


// Now, let's get back to `parseInt`. A natural first step when
// wanting to apply 10 as the last parameter is to try it out:

var parseDigit = _.partialRight(parseInt, 10);

describe('parseDigit', function() {

  it('should have bound the base', function() {
    var result = parseDigit('08');
    expect(result).to.equal(8);
  });

  // Perfect, that works! Okey, now:

  var parsed = ['1', '2', '3'].map(parseDigit)

  // But no, this is not as we expected:

  it('should not work with map - first element', function() {
    var result = parsed[0];
    expect(result).to.equal(1);
  });

  it('should not work with map - second element', function() {
    var result = isNaN(parsed[1]);
    expect(result).to.ok;
  });

  it('should not work with map - third element', function() {
    var result = isNaN(parsed[2]);
    expect(result).to.ok;
  });
});

// Why?

// Let's look at a simple way of implementing partialRight (without
// considering the context):

function partialRight(fn) {
  var rightArgs = _.toArray(arguments);

  return function() {
    var leftArgs = _.toArray(arguments);
    var args = leftArgs.concat(rightArgs);

    fn.apply(null, args);
  }
}

// This should clear things up. The problem is that `map` passes three
// arguments on every invocation. So with partial application from the
// right, we now end up with 4 arguments.

// Unary to the rescue again:

function unary(fn) {
    return function(arg) {
        return fn.call(this, arg)
    }
}

describe('unary parseDigit', function() {
  var parsed = ['1', '2', '3'].map(unary(parseDigit));

  it('should parse correctly', function() {
    expect(parsed).to.be.deep.equal([1,2,3]);
  });
});

// So -- if you understood that, you have really started to get a grip on
// how functions and arguments work in JavaScript.

// The solution here didn't end up too smooth, but later in this workshop
// we'll see a couple of techniques that can help us improve this significantly.
