---
layout: workshop
collection: workshop
title: Pipelines
section: 5
prev: 05-2-compose
name: 05-3-pipelines
next: 05-4-parse-url
slides:
info: |
//TODO: Write something here
---
// In the JS world we're not used to reading from the right
// as in this example from earlier:
var composed = _.compose(_.last, _.range);

// Here `range` is called first, then `last` is called on the
// result from range.

// Thankfully it's easy to reverse the arguments -- we have already
// done this using flip! Let's create a function that works like
// flip, but with any number of arguments:

var flipN = function(fn) {
  return function() {
    // reverse arguments when called
    // (remember that arguments is not an array)
    return fn.apply(this, _.toArray(arguments).reverse());
  }
}

// And, as for flip:
var pipeline = flipN(_.compose);

// Now pipeline expects to receive its arguments in reversed order
// of compose, i.e. now we can write this 'the other way around'.
// For a pipelined version of last in range:
var pipelined = pipeline(_.range, _.last);

describe('pipelined after', function() {

  // And we ensure that they do the same thing:
  it('should do the same as the composed version', function() {
		var composedResult = composed(1,10);
		var pipelinedResult = pipelined(1,10);
		expect(pipelinedResult).to.equal(composedResult);
	});
});

// So, let's get back to the `after` function we created in the
// previous task. First we'll bring in the helpers:

var splitOn = _.curry(function(chr, str) {
  return String.prototype.split.call(str, chr);
});

var joinOn = _.curry(function(chr, arr) {
  return arr.join(chr);
});

// PROBLEM: Now, it's your turn to create a pipelined after.
var after = pipeline(
);

describe('after', function() {
  it('should return the element after the character', function() {
		var result = after('?', 'test?hei');
		expect(result).to.equal('hei');
	});
});

// Now, we want to curry this function too. So we try with this:
var naiveCurriedAfter = _.curry(after);

describe('naiveCurriedAfter', function() {
  // Sadly this doesn't entirely work. It works when called with
  // both parameters:
  it('should work as expected when called with both arguments', function() {
		var result = naiveCurriedAfter('?', 'test?hei');
		expect(result).to.equal('hei');
	});

  // However, it fails hard when called with one at a time and gives us:
  //
  //     [TypeError: string is not a function]

  it('should not work when called with one arg at a time', function() {
    function result() {
      naiveCurriedAfter('?')('test?hei');
    }
    expect(result).to.throw(TypeError);
  });
});

// Why does this happen?

// The problem is that the pipeline don't expect any arguments, so
// `_.curry` think we're done the first time we call a curried function.
// We could solve it using something like this, where we're explicit about
// two arguments.

var curriedAfter = _.curry(function(chr, str) {
  return after(chr, str);
});

describe('curried After', function() {
  it('should work when called with both arguments', function() {
		var result = curriedAfter('?', 'test?hei');
		expect(result).to.equal('hei');
	});

  it('should work when called with one arg after another', function() {
		var result = curriedAfter('?')('test?hei');
		expect(result).to.equal('hei');
	});
});


// That works! However, now we see (chr, str) in both the function
// definition and where we execute our function. This isn't very nice.
// (Point-free style and all that.) The solution is to tell curry how many
// arguments we expect:



var properlyCurriedAfter = _.curry(after, 2);

describe('propertyCurriedAfter', function() {

  it('should work when called with both arguments', function() {
		var result = properlyCurriedAfter('?', 'test?hei');
		expect(result).to.equal('hei');
	});

  it('should work when called with one arg after another', function() {
		var result = properlyCurriedAfter('?')('test?hei');
		expect(result).to.equal('hei');
	});

  // Okay, there was actually no tests to implement here, just a long
  // explanation of currying and arity. If you're still with us, you're
  // starting to understand how composition and currying works.

});
