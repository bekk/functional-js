---
layout: workshop
collection: workshop
title: Composition
section: 5
prev: 05-1-currying
name: 05-2-compose
next: 05-3-pipelines
slides:
info: |
  Sometimes we write code where the functions we use line up nicely with
  regards to arguments.  For example, say that we want to find the first
  element of a range (which, as you can see, is quite stupid --
  nevertheless):
---
describe('find', function() {
  it('first should give the first element', function() {
		var result = _.first(_.range(1, 10));
		expect(result).to.equal(1);
	});

  it('last should give the last element', function() {
		var result = _.last(_.range(1, 10));
		expect(result).to.equal(9);
	});
});

// _.range receives to numbers and return an array of numbers
// _.first receives an array and returns the first element
// _.last receives an array and returns the last element
//
// That means that the result of _.range can be used directly
// as input for _.first or _.last

// Whenever we see this pattern:
//
//     fn1(fn2(some, input))
//
// we can instead write:
//
//     _.compose(fn1, fn2)(some, input)
//
// or, as you will mostly not invoke the function at once but first
// later when used:
//
//     var someFn = _.compose(fn1, fn2)
//     someFn(some, input)

// One example of this is _.curry(flip(_.map)) in the previous
// test. Using compose we can rewrite this:

function flip(fn) {
  return function(first, second) {
    return fn.call(this, second, first);
  };
};

var curriedFlip = _.compose(_.curry, flip);
var mapWith = curriedFlip(_.map);

// This might seem strange now, but we'll soon see some great
// examples of why you might want to do this.

// PROBLEM: Your task is to use _.compose to create these
// functions:

var firstInRange = null;
var lastInRange = null;

describe('composed find', function() {
  it('first should give first element', function() {
		var result = firstInRange(4, 13);
		expect(result).to.equal(4);
	});

  it('last should give last element', function() {
		var result = lastInRange(7, 18);
		expect(result).to.equal(17);
	});
});

// Remember our curried splitOn?
function splitOn(chr, str) {
  return str.split(chr);
}
var curriedSplitOn = _.curry(splitOn);

describe('curriedSplitOn', function() {

  it('should split when given arguments one after another', function() {
		var result = curriedSplitOn(',')('1,2,3');
		expect(result).to.deep.equal(['1','2','3']);
	});

  it('should split when given both arguments at the same time', function() {
		var result = curriedSplitOn(',', '1,2,3');
		expect(result).to.deep.equal(['1','2','3']);
	});

  // If we now combine composition and currying, we can start doing
  // interesting things:

  var beforeFirstComma = _.compose(_.first, curriedSplitOn(','));

  // Remember, when composing the input to the composed
  // functions is passed to the rightmost function, i.e.
  // `curriedSplitOn(',')` in this case.

  it('should split when composed', function() {
		var result = beforeFirstComma('1,2,3');
		expect(result).to.equal('1');
	});
});

// Let's try to create something more advanced

function after(chr, str) {
  var arr = str.split(chr);
  return _.rest(arr).join('');
}

describe('after', function() {
  it('should give all elements after char', function() {
		var result = after('?', 'test?hei');
		expect(result).to.equal('hei');
	});
});


var joinOn = _.curry(function(chr, arr) {
    return arr.join(chr);
});

// PROBLEM: Compose splitOn, joinOn and _.rest (in some order) to
// create a function that does the same as `after`.

// It's important to think about a couple of things:
//
// - which arguments are applied when
// - you want to line-up the functions so each match the return value of the previous one
// - as you can only return one value, most function can only receive one argument
// - except the first function, that can receive as many arguments as you'd like

var composedAfter = _.compose(
);

describe('composedAfter', function() {
  it('should give all elements after char', function() {
		var result = composedAfter('?', 'test?hei');
		expect(result).to.equal('hei');
	});
});
