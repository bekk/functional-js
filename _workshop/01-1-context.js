---
layout: workshop
collection: workshop
title: A functions context
section: 1
prev: ''
name: 01-1-context
next: 01-2-arguments
slides:
info: |
  It is time to get started. This workshop will start with some of the basics of
  JavaScript, with scope and context, to ensure that you fully understand how
  functions work in JavaScript.

  We start with how context works when using functions in JavaScript.
---
//A couple of functions that we will work with during this exercise

function hello() {
  return this + ' says hello';
}

describe('a functions context', function() {
  // In JavaScript we can dynamically choose the value of `this`
  // using several techniques. Today we will focus on some of these,
  // starting with `call` and `apply`.

  it('is undefined by default', function() {
    //call function  to observe default behavior
    var result = null;
    expect(result).to.equal('undefined says hello');
  });

  // `call` calls a function with a given `this` value as the first
  // parameter, then arguments provided individually:
  //
  //     func.call(this, arg1, arg2, ...)
  it('can change when using call', function() {
    //change context of `hello` by using `call`
    var result = hello();
    expect(result).to.equal('kim says hello');
  });

  // `apply` calls a function with a given `this` value as the first
  // parameter, then arguments provided as an array
  //
  //     func.apply(this, [arg1, arg2, ...])
  it('can change when using apply', function() {
    //change context of `hello` by using `apply`
    var result = hello();
    expect(result).to.equal('kim says hello');
  });

});
// If you want to learn more about function invocation in
// JavaScript, I recommend reading:
// http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
