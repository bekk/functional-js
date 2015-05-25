---
layout: workshop
collection: workshop
title: Part 1
section: 1
name: 01-intro
next: 02-applicative
slides: http://omniscientjs.github.io/workshop-slides/#9
---
// If you at any time need to freshen up your JS-fu, start any Google
// search with "mdn" and you will always end up at the amazing Mozilla
// Developer Network, which has the best JS explanations around.

// The goal of this workshop is to start thinking differently about
// functions. Some tests will appear strange, others will perhaps seem
// too easy. However, what you will see throughout the tests is a focus
// on functions as building blocks to solve problems. Hopefully some of
// these techniques will prove valuable to you.

// It's time to get started. This workshop will start with some of the
// basics of JavaScript, to ensure that you fully understand how
// functions work in JavaScript.

function hello() {
  return this + ' says hello';
}

function helloTo(thing) {
  return this + " says hello " + thing;
}

describe('this, call, apply', function() {
  // In JavaScript we can dynamically choose the value of `this`
  // using several techniques. Today we will focus on some of these,
  // starting with `call` and `apply`.

  it('undefined this', function() {
    var result = null
    expect(result).to.equal('undefined says hello');
  });

  // `call` calls a function with a given `this` value as the first
  // parameter, then arguments provided individually:
  //
  //     func.call(this, arg1, arg2, ...)

  it('this with call', function() {
    var result = null;
    expect(result).to.equal('kim says hello');
  });

  // `apply` calls a function with a given `this` value as the first
  // parameter, then arguments provided as an array
  //
  //     func.apply(this, [arg1, arg2, ...])

  it('this with apply', function() {
    var result = null;
    expect(result).to.equal('kim says hello');
  });

  // If you want to learn more about function invocation in
  // JavaScript, I recommend reading:
  // http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/

  // By the way, JavaScript is not strict about the number of
  // arguments, so you can for example include more parameters than
  // the function expects:

  it('javascript fault tolerance', function() {
    var result = helloTo.call("kim", "world", "or", "maybe", "bekk");
    expect(result).to.equal('kim says hello world');
  });

});

function argCount() {
    return arguments.length;
}

describe('arguments', function() {
  // Next up when understanding functions in JavaScript, is
  // understanding arguments.

  // Inside a function you will always have access to `arguments`,
  // which is an array-like object that contains all the arguments
  // passed to the function.

  it('count arguments', function() {
    var result = argCount(1, 2, 3);
    expect(result).to.equal(3);
  });

  it('count arguments', function() {
    var result = argCount(null, 2, 3);
    expect(result).to.equal(2);
  });

  // PROBLEM: Multiply `this` and the first argument, without
  // specifying any parameters

  function multiplyFirst() {
  }

  it('multiplyFirst 1*1', function() {
    var result = multiplyFirst(1,1);
    expect(result).to.equal(1);
  });

  it('multiplyFirst 2*5', function() {
    var result = multiplyFirst(2,5);
    expect(result).to.equal(10);
  });

});

describe('prototype & this', function() {
  // There will not be much about prototypes in this workshop, but
  // there is one thing it's important to understand, especially when
  // working with `arguments`: In JavaScript you can borrow existing
  // functions that live on a prototype.

  // Let's look at an example

  var User = function(age) {
      this.age = age;
  };

  User.prototype.getAge = function() {
      return this.age;
  };

  it('user getAge', function() {
    var user = new User(25);
    expect(user.getAge()).to.equal(25);
  });

  // However, in JavaScript we can actually invoke `getAge` without
  // creating an instance of `User`

  it('context free getAge', function() {
    var age = User.prototype.getAge.call({ age: 35 });
    expect(age).to.equal(35);
  });

  // Basically, we borrow a function from `User`. This is a trick we
  // can use to make `arguments` into an array.

  // PROBLEM: Create a function that "borrows"
  // `Array.prototype.slice` and returns all the arguments given,
  // except the first

  function rest() {
  }

  it('rest', function() {
    var result = rest(1, 2, 3);
    expect(result).to.equal([2, 3]);
  });

});
