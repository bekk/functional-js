---
layout: workshop
collection: workshop
title: Using helper liberaries
section: 2
prev: 02-4-reduce
name: 02-5-lodash
next: 02-6-point-free
slides:
info: |
  In the examples we have seen so far, we have used methods that live
  on an array. We are now going to switch tactics and focus more on
  functions instead of methods. For example, in addition to
  `Array.prototype.reduce`, there exists a `reduce` functions in
  libraries such as Lo-Dash and Underscore. One of the primary values
  of using these functions instead is composability. We are going to
  look more on what exactly that means later. Another great thing is
  that some of these functions are more powerful that the methods on
  arrays.

  In this course we will use Lo-Dash, which will be accessible through the `_`
  global (however, we could also have chosen Underscore instead).
---

describe('_.reduce', function() {
  // We'll start by going back to reduce. As for the built-in reduce,
  // _.reduce does not need a starting value. (Reduce without an initial
  // value is actually a fold, and in fact, in Lo-Dash _.reduce is aliased
  // to _.foldl, i.e. fold from the left.)

  function join(arr, chr) {
    return _.reduce(arr, function(memo, str) {
      return memo + chr + str;
    });
  }

  it('works the same way as the array method', function() {
    var result = join(['a','b','c'], ':');
    expect(result).to.equal('a:b:c');
  });

});

// PROBLEM: Determine the longest word using _.reduce

function longest(arr) {
}

describe('longest', function() {

  it('finds the longest word in a collection', function() {

    var result = longest(['test', 'kim', 'winning', 'lol']);
    expect(result).to.equal('winning');

  });
});
