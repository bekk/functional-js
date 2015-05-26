---
layout: workshop
collection: workshop
title: Currying
section: 5
prev: 04-2-functions-from-functions
name: 05-1-currying
next: 05-2-compose
slides:
info: |
  Okay, the generalization made it a little bit easier to create our
  with-functions. Now, however, to get away from that call to
  _.partial, we need to take a look at another technique: currying.

  A curried function is a function that will return a new function until
  it receives all of its arguments. In other words, currying
  describes the conversion of a multiargument function into a chain of
  single-argument functions. (Okey, still a lot of words. Let us look
  at an example -- that should make it far more understandable.)
---
describe('self-currying', function() {
  // We start by changing flip to return a functions that accept
  // either one or two parameters. If it receives one parameter, it
  // returns a new function that takes one parameter. If it receives
  // both, it calls the function.

  function flip(fn) {
    return function(first, second) {
      if (typeof second == "undefined") {
        return function(second) {
          return fn.call(null, second, first);
        }
      }
      return fn.call(null, second, first);
    };
  };
  // Now we can create `square` directly without _.partial

  var mapWith = flip(_.map);

  var square = mapWith(function(n) {
      return n * n;
  });
  it('square should square numbers', function() {
		var result = square([1,2,3]);
		expect(result).to.deep.equal([1,4,9]);
	});

  it('square should square numbers when called with both args', function() {
    // We can also call mapWith with both parameters at once:

    var squared = mapWith(function(n) {
        return n * n;
    }, [1,2,3]);

		var result = squared;
		expect(result).to.deep.equal([1,4,9]);
	});
});

// This technique is great since we sometimes know one parameter at
// "compile-time" (such as squaring) and the other at run-time (the input).

// PROBLEM: Now it's your turn to try this out. Implement `splitOn`
// which accepts as first argument a character to split on, and as
// the second argument the string you want to split. Remember than
// it can be called with either only the first or with both
// arguments.
// (You can use `str.split` to handle the splitting.)
var splitOn = function(chr, str) {
};

describe('splitOn', function() {

  it('should be able to accept two arguments', function() {
    var result = splitOn(':', '1:2:3');
    expect(result).to.deep.equal(['1', '2' ,'3']);
  });

  it('should be able to accept one argument at a time', function() {
    var commaSplitter = splitOn(',');
    var result = commaSplitter('2,3,4');

    expect(result).to.deep.equal(['2', '3', '4']);
  });
});

// However, we neither want nor need to write all of this stuff ourselves
// of course! Once again, Lo-Dash to the rescue -- now with its _.curry.

describe('_.curry', function() {
  // First, let's get back to our simple flip:
  function flip(fn) {
    return function(first, second) {
      return fn.call(this, second, first);
    };
  };

  // Now, using _.curry together with flip, we can create a function
  // that works as the mapWith we created in the previous test.
  // ("oh yeah, you just need to curry the flip …")

  var mapWith = _.curry(flip(_.map));

  it('square should square numbers', function() {
    var square = mapWith(function(n) {
        return n * n;
    });

		var result = square([1,2,3]);
		expect(result).to.deep.equal([1,4,9]);
	});

  // And with both parameters at once:
  it('square should square numbers when given 2 arguments', function() {
		var result = mapWith(function(n) {
        return n * n;
    }, [1,2,3]);

		expect(result).to.deep.equal([1,4,9]);
	});
});

// PROBLEM: Implement `splitOn` from the previous test using `_.curry`.

var curriedSplitOn = function () {};
describe('curriedSplitOn', function() {

  it('should split when given both arguments', function() {
    var result = curriedSplitOn(':', '1:2:3');
    expect(result).to.deep.equal(['1', '2' ,'3']);
  });

  it('should split when given one argument at a time', function() {
    var commaSplitter = curriedSplitOn(',');
    var result = commaSplitter('2,3,4');
    expect(result).to.deep.equal(['2', '3', '4']);
  });
});
