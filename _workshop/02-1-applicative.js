---
layout: workshop
collection: workshop
title: Applicative programming
section: 2
prev: 01-3-prototype
name: 02-1-applicative
next: 02-2-map
slides:
info: |
  Instead of discussing the theory on lexical scoping and closures,
  we will just go straight to more code. If you want to read the theory,
  we recommend checking out this link after the workshop:
  [Eloquent JavaScript chapter 3](http://eloquentjavascript.net/03_functions.html)

  First up is applicative programming. In general, applicative
  programming is the pattern of defining a function that takes a
  function and then invokes that function for each element in a
  collection. We will look at three central functions: map, filter and
  reduce. These are central building blocks of what we are learning
  today.

  Applicative programming works best with pure functions, i.e.
  functions that have no side effects: it references no other mutable
  state, does not set any values other than the return value,
  and relies only on the parameters given as input.
---
function square(n) {
  return n*n;
}

describe('applicative programming', function() {

  it('is about applying functions to elements in collections', function() {
    var result = [1,2,3].map(function(n) {
      return n+1;
    });

    expect(result).to.deep.equal([2,3,4]);
  });

  it('is about reusing already defined functions by passing them as parameters', function() {
    var result = [1,2,3].map(square);

    expect(result).to.deep.equal([1,4,9]);
  });
});
