---
layout: workshop
collection: workshop
title: Make new collections with reduce
section: 2
prev: 02-3-filter
name: 02-4-reduce
next: 02-5-lodash
slides:
info: |
 The last applicative functions we will look at for now is reduce.
 Reduce applies a function against an accumulator and each value
 of the array to reduce it to a single value.

 Reduce is different from map and filter in that it returns a value rather than a
 collection. However, the value could also be a collection.
---

describe('reduce', function() {
    // As always, let's start with an example of calculating the sum of
    // all items in an array using a `for` loop:

    function sumFor(arr) {
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      return sum;
    }

    it('can be implemented with a for-loop', function() {
      var result = sumFor([1,2,3]);
      expect(result).to.equal(6);
    });

    // Using reduce it can look like this:

    function sum(arr) {
      return arr.reduce(function(acc, value){

        // What is returned in this function is used as `acc` for
        // the next iteration
        return acc + value;

      }, 0);
      // 0 is the starting value for `acc`

      // What we return on the last iteration is the result of
      // the reduce.
    }

    // This illustrates how reduce works:

    // Operation   Accumulator   List
    //     +            0        1, 2, 3, 4
    //                  1        2, 3, 4
    //                  3        3, 4
    //                  6        4
    //                 10

    it('exists as a method on arrays in JavaScript', function() {
      var result = sum([1,2,3,4]);
      expect(result).to.equal(10);
    });

    it('hands the values in the collection to the reducing-function', function() {
      var result = sum([0,0,-1]);
      expect(result).to.equal(-1);
    });

});

// PROBLEM: Implement multiplication using reduce

function multiply(arr) {
}

describe('multiply', function() {

  it('does multiply all the numbers in the collection', function() {
    var result = multiply([1,2,3,4]);
    expect(result).to.equal(24);
  });

  it('does work as expected when 0 appears in the collection', function() {
    var result = multiply([0,1,2,3]);
    expect(result).to.equal(0);
  });
});

// PROBLEM: Implement join using reduce
// (think about what's the first value and what we need to
// iterate over)

function join(arr, chr) {
}

describe('join', function() {

  it('does join the elements in the collection', function() {
    var result = join(["a"], ":");
    expect(result).to.equal("a");
  });

  it('works correctly with multiple elements', function() {
    var result = join(["a","b","c"], ":");
    expect(result).to.equal("a:b:c");
  });

});

// PROBLEM: Implement find using reduce
// (think about what we want to get back from such a function)

function find(arr, el) {
}

describe('find', function() {

  it('should return true if element is found', function() {
    var result = find([1,2,3], 1);
    expect(result).to.be.ok();
  });

  it('should return false if element is not found', function() {
    var result = find([1,2,3], 4);
    expect(result).to.not.be.ok();
  });

  it('should return false if given an empty collection', function() {
    var result = find([], 1);
    expect(result).to.not.be.ok();
  });
});
