---
layout: workshop
collection: workshop
title: Make new collections with filter
section: 2
prev: 02-2-map
name: 02-3-filter
next: 02-4-reduce
slides:
info: |
  A filter function accepts a higher-order function and a collection,
  then applies the passed function to each element and returns a
  new collection which includes a subset of the original collection.

  An element is included in the new collection if the filter-function returns
  true and is excluded if the filter-function returns false.
---
describe('filter', function() {
    // A filter-function includes the value for all function invocations that
    // return `true`. Here's an example, again using `for`:

    function removeOddIndicesFor(arr) {
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (i % 2 == 0) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }

    it('can be implemented as a for-loop', function() {
      var result = removeOddIndicesFor([1,2,3,4,5]);
      expect(result).to.deep.equal([1,3,5]);
    });

    // PROBLEM: Implement this using a `Array.prototype.filter`
    // instead:

    function removeOddIndices(arr) {
    }

    it('exists as a method on arrays in JavaScript', function() {
      var result = removeOddIndices([1,2,3,4,5]);
      expect(result).to.deep.equal([1,3,5]);
    });

});

// To be entirely sure that we properly understand how these
// functions work, let's implement our own `map` and `filter`
// functions. The implementation of these still have to concern
// themselves with loops, counters and state.

// (If you struggle, be sure to take a look at the examples we
// saw earlier.)

// PROBLEM: Implement `map`

var map = function(items, fn) {
}

describe('implemented map', function() {

    it('mapfilter1', function() {
      var result = map([1,2,3,4], function(value, index) {
        return value * index;
      });

      expect(result).to.deep.equal([0, 2, 6, 12]);
    });

});

// PROBLEM: Implement `filter`

var filter = function(items, fn) {
}

describe('implemented filter', function() {

  it('mapfilter2', function() {
    var result = ilter([1,2,3,4], function(value, index) {
      return value * index > 4;
    });
    
    expect(result).to.deep.equal([3,4]);
  });
});
