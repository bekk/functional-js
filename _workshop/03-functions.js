---
layout: workshop
collection: workshop
title: Part 3
section: 3
name: 03-functions
prev: 02-applicative
next: 04-partially
slides: http://omniscientjs.github.io/workshop-slides/#9
---

// Okey, it's time to take a break from map, filter and reduce, and
// start focusing more on higher-order functions and what we can do
// with JavaScript.

test('function factories!', function(t) {
    // In JavaScript we love factories. Let's create a factory that
    // creates adder functions:

    function makeAdder(arg) {
        return function(arg2) {
            return arg + arg2;
        }
    }

    var addTwo = makeAdder(2)

    t.equal(
        addTwo(40),
        42
    );

    t.equal(
        addTwo(3),
        5
    );

    // Seems simple enough, but it's a powerful technique that we will
    // be having a lot of fun with.

    // Okey, it's your turn to create a factory.

    // PROBLEM: Create a counter that returns a function that increases a
    // number every time it's called.

    function counter() {
    }

    var c1 = counter();

    t.equal(c1(), 0);
    t.equal(c1(), 1);
    t.equal(c1(), 2);

    var c2 = counter();

    t.equal(c2(), 0);

    t.end();
});

test('function taking function as argument', function(t) {
    // Sometimes we want to take a function as an argument.

    // PROBLEM: Create a once factory that receives a function that
    // will at most be called once. If already run, return the result
    // of the first invocation on every succeeding invocation.

    function once(fn) {
    }

    var win = once(function(name) {
        return name + ' is winning';
    });

    t.equal(win('kim'), 'kim is winning');
    t.equal(win('kjetil'), 'kim is winning');
    t.equal(win('stian'), 'kim is winning');
    t.equal(win('mikael'), 'kim is winning');
    // I WON!

    // And we have now decorated a function, i.e. wrapped an existing functions
    // with new functionality.

    t.end();
});

test('add functions to functions', function(t) {
    // In JavaScript you can actually add functions onto existing
    // functions. This can create sweet APIs. Let's look at an example.

    // I've seen this pattern in many code bases:
    //
    //     if (debug) console.log('some text');
    //
    // When you want to show debug information you set debug to `true`. You of
    // course need to always remember to write that `if` everywhere in your
    // code. Let's create a create a better API.

    // PROBLEM: We want to guard a function, so that it only calls
    // through to the function we pass in once we have called `start`
    // on the guard. (See below for the tests to understand how this is
    // supposed to work.)

    function guard(fn) {
        var guard = function() {
        };

        // in JavaScript you can actually add
        // functions to existing functions
        guard.start = function() {
        };

        return guard;
    };

    // Let's now guard a debug helper. To make it a little bit simpler
    // to test, we return a message instead of calling console.log or similar.
    var debug = guard(function(msg) {
        return msg;
    });

    t.equal(debug('test 1'), undefined);
    t.equal(debug('test 2'), undefined);

    debug.start();

    t.equal(debug('test 3'), 'test 3');

    t.end();
});

test('make it fluent', function(t) {
    // Many of us are used to jQuery and its fluent apis, e.g.
    //
    //     $('#test')
    //         .css('color','#333')
    //         .height(200)
    //         .on('click', function() {
    //             console.log('clicked!')
    //         });
    //
    // Let's create a small helper that simplifies the development of
    // such fluent apis

    // First, to get an understanding of how we can create a simple
    // helper for these fluent interfaces, we start with an entirely
    // different example, `maybe`:

    function maybe(fn) {
        return function(arg) {
            if (arg != null) {
                return fn(arg);
            }
        }
    }

    var exclamate = maybe(function(val) {
        return val + "!";
    });

    t.equal(exclamate("test"), "test!");
    t.equal(exclamate(null), undefined);
    t.equal(exclamate(), undefined);

    // We have now created a helper than only calls the received function is
    // the input is neither null nor undefined. Yet another decorator, that is.

    // Btw, why doesn't this work?

    var user = {
        setName: maybe(function(name) {
            this.name = name;
        })
    };

    t.throws(function() {
        user.setName("kim");
    }, TypeError);

    // It throws this error at us:
    //
    //     TypeError: Cannot set property 'name' of undefined

    // As is often the case in JavaScript, the problem is `this`. We
    // forgot to handle the context when we called `fn` in our `maybe`
    // decorator. In decorators we must always use `call` or `apply` --
    // make them context agnostic!

    // PROBLEM: Now it's time to create a `fluent` decorator

    function fluent(fn) {
    }

    // Here we have our example `$`, containing a field `value` that we
    // want to read out last. (You shouldn't change anything below here.)

    var $ = function(el) {
        return {
            value: 'somevalue',

            // using our fluent helper
            css: fluent(function(key, val) {}),
            height: fluent(function(height) {}),
            on: fluent(function(event, cb) {})
        }
    };

    var val = $('#test')
        .css('color','#333')
        .height(200)
        .on('click', function() {
            console.log('clicked!')
        })
        .value;

    t.equal(val, 'somevalue');

    t.end();
});

test('understanding arity', function(t) {
    // Going from string to int we can use parseInt, e.g.

    t.equal(parseInt('123'), 123);

    // However, trying to use this function together with map,
    // we see a problem:

    var parsed = ['1','2','3'].map(parseInt)
    //=> [1, NaN, NaN]

    t.equal(parsed[0], 1);
    t.ok(isNaN(parsed[1]));
    t.ok(isNaN(parsed[2]));
    // (we can't use deepEqual since NaN !== NaN in JavaScript)

    // The problem is that map calls each function with three parameters -- the
    // value, the index, and the array. Instead of the above, we could write:

    var parsed2 = ['1','2','3'].map(function(value, index, arr) {
        return parseInt(value);
    })

    t.deepEqual(
        parsed2,
        [1,2,3]
    );

    // However, there are a couple of other solutions. We can for example
    // create a helper to do the job for us, and that lets us write:

    var parsed3 = ['1', '2', '3'].map(unary(parseInt))

    function unary(fn) {
        return function(arg) {
            return fn.call(this, arg)
        }
    }

    // Here we have created unary, which ensures that a function is only ever
    // called with one argument, no matter how many you actually send to it.

    t.deepEqual(
        parsed3,
        [1,2,3]
    );

    // However, unary might be to simple in this case, as we actually
    // might want to call:
    //
    //     parseInt(val, 10);
    //
    // To get there, however, we should first learn some things about
    // partial application.

    t.end();
});
