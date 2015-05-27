---
layout: workshop
collection: workshop
title: Make new collections with map
section: 2
prev: 02-1-applicative
name: 02-2-map
next: 02-3-filter
slides:
info: |
  A map function accepts a higher-order function and a collection,
  then applies the passed function to each element and returns a
  new collection.
---

describe('map', function() {
    // To understand what we're talking about, this is an example of
    // using a for loop to go through a collection, performing a
    // calculation on each item:

    function squareFor(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i] * arr[i]);
      }
      return newArr;
    }

    it('can be implemented as a for-loop', function() {
      var result = squareFor([1,2,3]);
       expect(result).to.deep.equal([1,4,9]);
    });

    // For-loops involve alot of manual steps, which makes it error prone.
    // Thankfully we now have a `map` functions on `Array.prototype`.

    // For each iteration of map it invokes the function with three
    // arguments: the current value, the current index, the entire
    // collection. So we could have written this instead:

    function square(arr) {
      return arr.map(function(value, index, collection) {
        return value * value;
      });
    }

    it('exists as a method on arrays in JavaScript', function() {
      var result = square([1,2,3]);
      expect(result).to.deep.equal([1,4,9]);
    });

    // An important characteristic of these kinds of higher order functions is
    // that they do not modify the original collection.
    it('does not modify the original collection', function() {
      var numbers = [1,2,3];
      var result = square(numbers);

      expect(numbers).to.not.equal(result);
    });

});

// PROBLEM: Implement the following function using map, i.e. a
// function that adds the current index to the current value:
//
//  for (var i = 0; i < arr.length; i++) {
//      arr[i] = arr[i] + i
//  }

function addIndex(arr) {
}

describe('addIndex', function() {
  it('should add the index to the current element', function() {
    var result = addIndex([1,2,3]);
    expect(result).to.deep.equal([1,3,5]);
  });

  it('should not modify the original collection', function() {
    var numbers = [1,2,3];
    var result = addIndex(numbers);

    expect(result).to.deep.equal([1,3,5]);
    expect(numbers).to.not.equal(result);
  });
});
