"use strict";
var test = require('tape');

// In this workshop we will learn about functional programming in
// JavaScript through code.

// But first, open a terminal, go to this directory and run
//
//     npm install

// Every time you are ready to see if your tests run, just type
//
//     npm test
//
// If you instead want to run the tests for a specific file,
//
//     npm run <n>
//
// where <n> is the index of the file your in. So, to run the tests in
// this file, run:
//
//     npm run 1
//
// It stops running on the first failing test.

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

test('first things first', function(t) {
    // In these tests we rely on `tape`, which is a small testing
    // library. Throughout these tests you will see the assertions as
    // follows:

    // If we are testing a primitive (number, string, boolean) we'll
    // use `equal`:

    t.equal("test", "test");

    // This is the same as "test" === "test", i.e. reference equality

    // If we are testing objects or arrays, we'll use `deepEqual`:

    t.deepEqual([1,2,3], [1,2,3]);

    // If we want to just check that something is `true`, we use `ok`:

    t.ok(true);

    // And lastly, if we expect something to throw an error, we
    // use `throws`:

    t.throws(function() {
        throw new Error("wtf?");
    });

    // Just telling tape we're done
    t.end();
});

test('this, call, apply', function (t) {
    // In JavaScript we can dynamically choose the value of `this`
    // using several techniques. Today we will focus on some of these,
    // starting with `call` and `apply`.

    // `call` calls a function with a given `this` value as the first
    // parameter, then arguments provided individually:
    //
    //     func.call(this, arg1, arg2, ...)

    // `apply` calls a function with a given `this` value as the first
    // parameter, then arguments provided as an array
    //
    //     func.apply(this, [arg1, arg2, ...])

    function hello() {
        return this + " says hello";
    }

    t.equal(
        hello(),
        "undefined says hello"
    );

    // PROBLEM: Invoke `hello` using `call` to get this test to run
    t.equal(
        hello.call("kim"),
        "kim says hello"
    );

    // PROBLEM: Invoke `hello` using `apply` to get this test to run
    t.equal(
        hello.apply("kim"),
        "kim says hello"
    );

    function helloTo(thing) {
        return this + " says hello " + thing;
    }

    // PROBLEM: Invoke `helloTo` using `call` to get this test to run
    t.equal(
        helloTo.call("kim", "world"),
        "kim says hello world"
    );

    // PROBLEM: Invoke `helloTo` using `apply` to get this test to run
    t.equal(
        helloTo.apply("kim", ["world"]),
        "kim says hello world"
    );

    // If you want to learn more about function invocation in
    // JavaScript, I recommend reading:
    // http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/

    // By the way, JavaScript is not strict about the number of
    // arguments, so you can for example include more parameters than
    // the function expects:

    t.equal(
        helloTo.call("kim", "world", "or", "maybe", "bekk"),
        "kim says hello world"
    );

    t.end();
});

test('arguments', function(t) {
    // Next up when understanding functions in JavaScript, is
    // understanding arguments.

    // Inside a function you will always have access to `arguments`,
    // which is an array-like object that contains all the arguments
    // passed to the function.

    function argCount() {
        return arguments.length;
    }

    t.equal(
        argCount(1, 2, 3),
        3
    );

    t.equal(
        argCount.call(null, 2, 3),
        2
    );

    // PROBLEM: Multiply `this` and the first argument, without
    // specifying any parameters

    function multiplyFirst() {
        return this * arguments[0];
    }

    t.equal(
        multiplyFirst.call(1, 1),
        1
    );

    t.equal(
        multiplyFirst.call(2, 5),
        10
    );

    t.end();
});

test('prototype & this', function(t) {
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

    // Usually, to get the age of a user, we would:

    var user = new User(25);
    t.equal(user.getAge(), 25);

    // However, in JavaScript we can actually invoke `getAge` without
    // creating an instance of `User`

    var age = User.prototype.getAge.call({ age: 35 });
    t.equal(age, 35);

    // Basically, we borrow a function from `User`. This is a trick we
    // can use to make `arguments` into an array.

    // PROBLEM: Create a function that "borrows"
    // `Array.prototype.slice` and returns all the arguments given,
    // except the first

    function rest() {
        return Array.prototype.slice.call(arguments, 1);
    }

    t.deepEqual(
        rest(1, 2, 3),
        [2, 3]
    );

    t.end();
});

