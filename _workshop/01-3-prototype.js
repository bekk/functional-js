---
layout: workshop
collection: workshop
title: Functions and prototypes
section: 1
prev: 01-2-arguments
name: 01-3-prototype
next: 02-applicative
slides:
info: |
  Prototypes are another core concept in JavaScript. Functions and prototypes
  interact in many interesting ways.

  TODO: Skriv mer her.

  There will not be much about prototypes in this workshop, but
  there is one thing it is important to understand, especially when
  working with `arguments`: In JavaScript you can borrow existing
  functions that live on a prototype.
---
var User = function(age) {
    this.age = age;
};

User.prototype.getAge = function() {
    return this.age;
};

describe('prototype-functions', function() {

  it('are usually bound to the context of an object', function() {
    var user = new User(25);
    var age = user.getAge();

    expect(age).to.equal(25);
  });

  // However, in JavaScript we can actually invoke `getAge` without
  // creating an instance of `User`.

  // We can say that we are "borrowing" the getAge function
  // from the User prototype.
  it('can be borrowed and have their context bound at will', function() {
    var age = User.prototype.getAge.call({ age: 35 });
    expect(age).to.equal(35);
  });

});

// PROBLEM:
// Create a function that "borrow" `Array.prototype.slice`
// and returns all the arguments given, except the first.

// NOTE: This has changed in ES2015 (aka ES6), but it is
// still a useful exercise.

function rest() {
}

describe('rest', function() {

  it('should return all arguments except the first one', function() {
    var result = rest(1);
    expect(result).to.deep.equal([]);
  });

  it('should return all arguments except the first one', function() {
    var result = rest(1, 2, 3);
    expect(result).to.deep.equal([2, 3]);
  });

});
