---
layout: workshop
collection: workshop
title: Case - Parse URL
section: 5
prev: 05-3-pipelines
name: 05-4-parse-url
next: 06-1-sealed
slides:
info: |
  This task does not involve anything new. It is rather a case study for you to
  exercise your newfound knowledge of working with functions.

  You will implement a simple URL-parser through the use of the functional-fu you
  have aquired thus far.
---
// In this test we're going to parse out the queryparams of this url:

var url = 'http://example.com/fetch?product=widget&color=red&size=6';

// The end result looks like this:

var parsedUrl = {
  product: 'widget',
  color: 'red',
  size: '6'
};

// Let's start by bringing in some of the helper functions we've been
// playing with:

var flipN = function(fn) {
  return function() {
    return fn.apply(this, _.toArray(arguments).reverse());
  }
};

var pipeline = flipN(_.compose);

var splitOn = _.curry(function(chr, str) {
  return String.prototype.split.call(str, chr);
});

var joinOn = _.curry(function(chr, arr) {
  return arr.join(chr);
});

var after = _.curry(pipeline(
  splitOn,
  _.rest,
  joinOn('')
), 2);

// Now we can start putting some of these together. A first step in parsing
// the url is finding the queryparams and splitting on &:

var parse = pipeline(after('?'), splitOn('&'));

describe('parse', function() {
  it('should give us the query param pairs', function() {
    var result = parse(url);
    expect(result).to.deep.equal(['product=widget', 'color=red', 'size=6']);
  });
});

// Okey, we're getting somewhere

// The next thing we want to do, is go from:
//
//     ['product=widget', 'color=red', 'size=6']
//
// to
//
//     [
//         ['product', 'widget'],
//         ['color', 'red'],
//         ['size', '6']
//     ]
//
// We will call this pairing on "="
//
// And as soon as we are there, we can use the lovely
// _.object helper to make an object out of this:
//
//     {
//         product: 'widget',
//         color: 'red',
//         size: '6'
//     }

// PROBLEM: So -- your task is to create the pairOn helper:
// (oh, and remember to reuse splitOn and that it should
// be curried.)

var pairOn = function () {};

describe('pairOn', function() {
  var values = ['product=widget', 'color=red', 'size=6'];
  var res = [
    ['product', 'widget'],
    ['color', 'red'],
    ['size', '6']
  ];

  it('should work when called with both arguments', function() {
    var result = pairOn('=', values);
    expect(result).to.deep.equal(res);
  });

  it('should work when called with one arg after another', function() {
    var result = pairOn('=')(values);
    expect(result).to.deep.equal(res);
  });

  // And then, behold the glory of _.object

  it('should give the correct object when called with _.object', function() {
    var result = _.object(pairOn('=', values));

    expect(result).to.deepEqual(parsedUrl);
  });
});

// Nice!

// PROBLEM: Now we need to connect the dots from start to finish, using
// only pipeline, after, splitOn, pairOn and _.object:

var parseUrl = pipeline(
);

describe('parseUrl', function() {
  it('should give the correct object when called', function() {
    var result = parseUrl(url);

    expect(result).to.deepEqual(parsedUrl);
  });
});

// BOOM!

// So, we just implemented this (simplistic) url parsing using only
// reusable functions and no state.

// PROBLEM: Okey, let's also use _.compose directly instead of pipeline:

var composedParseUrl = _.compose(
);

describe('composedParseUrl', function() {
  it('should give the correct object when called', function() {
    var result = composedParseUrl(url);
    expect(result).to.deepEqual(parsedUrl);
  });
});

// FP allows you to elevate your level of abstraction, seeing
// problems with better clarity. For more about this, We recommend
// watching Rich Hickey's amazing "Simple Made Easy":
// http://www.infoq.com/presentations/Simple-Made-Easy

// "OO makes code understandable by encapsulating moving parts.
// FP makes code understandable by minimizing moving parts."
//   - Michael Feathers
