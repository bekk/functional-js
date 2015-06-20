"use strict";
var test = require('tape');
var _ = require('lodash');

// Okey, back again. First we'll include some of our helpers that we'll
// use later

function flip(fn) {
    return function(first, second) {
        return fn.call(this, second, first);
    };
};

var reduceWith = _.curry(flip(_.reduce));
var filterWith = _.curry(flip(_.filter));

var plus = function(a,b) {
    return a + b;
}

var sum = reduceWith(plus);

// We're changing course for some tests, taking a good look at the
// problems of mutability.

test('cloning away the mutability', function(t) {
    // Let's say that we have the following cache
    // implementation:
    var cache = (function() {
        var values = {};
        return {
            get: function(key) {
                return _.cloneDeep(values[key]);
            },
            set: function(key, value) {
                values[key] = _.cloneDeep(value);
            }
        };
    })();

    // Now we can set and get from the cache:

    cache.set("test", 1);

    t.equal(
        cache.get("test"),
        1,
        'cache returns saved value'
    );

    // However, there are some problems:

    var obj = { name: "kim" };
    cache.set("user", obj);

    // oh noes, somewhere in the code someone goes crazy:
    obj.wat = "crazy";

    // ... and then somewhere else:
    var user = cache.get("user")
    // user.wat is now "crazy"
    // -- that's just crazy!

    // Also, another problem:
    user.someValue = "what?"

    // Now the initial `obj` contains `someValue` too.
    // The same applies for new cache gets:

    var user2 = cache.get("user");
    // user.someValue is "what?"

    // This is one example of mutability potentially
    // creating subtle bugs that are difficult to debug

    // There are several ways to solve this problem. The first we'll look at is
    // handling this by cloning the data we're working with. Lo-Dash contains
    // two clone helpers: _.clone and _.cloneDeep. Let's first look at the
    // difference between these.

    // `_.clone` creates a creates a clone of value. That means that:

    var val = {};

    t.ok(
        val !== _.clone(val),
        'cloned object has new reference'
    );

    // I.e. we get a new reference. There is one problem however:

    var location = {
        county: {
            name: 'Nordland'
        }
    }

    var otherLocation = _.clone(location);
    otherLocation.county.name = 'Oslo';

    // This is good:
    t.ok(
        location !== otherLocation,
        'cloned location gets a new reference'
    );

    // This, however, is NOT good:
    t.equal(
        location.county.name, 'Oslo',
        'cloned location overrides its source object'
    );

    // Oups. There is a new reference on the base object, but the content is
    // not cloned and therefore still have the reference as before. It can
    // therefore be changed across objects.

    // The solution is `_.cloneDeep`, which recursively clones the object.

    var newLocation = {
        county: {
            name: 'Nordland'
        }
    }

    var thirdLocation = _.cloneDeep(newLocation);
    thirdLocation.county.name = 'Oslo';

    t.ok(
        location !== otherLocation,
        'cloned location gets a new reference'
    );
    t.equal(
        newLocation.county.name, 'Nordland',
        'cloned location does not override its source object'
    );

    // PROBLEM: Fix the `cache` code above, so the following tests run.

    t.equal(obj.name, "kim", "obj should contain name");
    t.equal(user.name, "kim", "user should contain name");
    t.equal(user2.name, "kim", "user2 should contain name");

    t.equal(obj.wat, "crazy", "obj should contain wat");
    t.equal(user.wat, undefined, "user should not contain wat");
    t.equal(user2.wat, undefined, "user2 should not contain wat");

    t.equal(obj.someValue, undefined, "obj should not contain someValue");
    t.equal(user.someValue, "what?", "user should contain someValue");
    t.equal(user2.someValue, undefined, "user2 should not contain someValue");

    t.end();
});

test("prevent cache changes", function(t) {
    // should we at all be able to change the object we received
    // from the cache?

    // There are several ways of protecting an object from being
    // written to in JavaScript:
    //
    // 1. Preventing extensions is the weakest level,
    // 2. sealing is stronger,
    // 3. freezing is strongest.

    // Today we will go straigth for the freezing

    // PROBLEM: You task is to use Object.freeze
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
    // to disable writing to objects returned from the cache.

    // Let's start of where we ended in the last test:
    var cache = (function() {
        var values = {};
        var api = {
            get: function(key) {
                return Object.freeze(_.cloneDeep(values[key]));
            },
            set: function(key, value) {
                values[key] = _.cloneDeep(value);
            }
        };
        return Object.freeze(api);
    })();

    t.throws(function() {
        cache.test = "wat?";
    }, TypeError, "changing the cache object is not allowed");

    var obj = { name: "kim" };
    cache.set("user", obj);

    var user = cache.get("user");

    t.throws(function() {
        user.name = "kjetil";
    }, TypeError, "should not allow existing key to be change");

    t.throws(function() {
        user.someValue = "test";
    }, TypeError, "should not allow new keys to be added");

    t.end();
});

// We have been playing with immutable data. Thankfully there are now several
// libraries that can help us along. It's important to understand that these
// not only add some helper functions, but they also rely on new data
// structures. We can't make JavaScript objects and arrays immutable, so we
// need to work with "new objects and arrays".

// Two libraries that can help with immutability are mori and immutable.js. The
// former is basically the ClojureScript api in pure JavaScript, while the
// latter is a library by Facebook. We'll use the latter in this course, but both
// are great alternatives (mori far more stable, but also quite a bit larger in
// size).

var Immutable = require('immutable');

// This library has an API that closely mirrors that of Array, Map, and
// Set in pure JavaScript.

// Map and Set is part of ES6:
//
// - Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// - Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

// This is the API documentation:
// https://github.com/facebook/immutable-js/blob/master/type-definitions/Immutable.d.ts

test('cache using immutable.js', function(t) {
    // Basic introduction to Immutable-js:

    // In this test we'll be working with maps. We can create a map from an
    // existing JavaScript object:

    var obj = { a: 1, b: 2, c: 3 };
    var map = Immutable.Map(obj);

    // We can export a JavaScript object from the Immutable.Map using `toJS`:
    var obj2 = map.toJS();

    t.deepEqual(obj, obj2);

    // However,
    t.ok(
        obj !== obj2,
        'the object from immutable has a new reference'
    );

    // We can set new key/value pairs on the map:

    map = map.set('user', 10);
    t.equal(map.get('user'), 10);

    // We can also set objects:

    var deepObj = {
        location: {
            name: "Trondheim"
        }
    };

    map = map.set('obj', deepObj);

    t.deepEqual(map.get('obj'), deepObj);

    // But here there's something interesting
    t.ok(map.get('obj') === deepObj);

    // This means that we can change the content:

    deepObj.location.name = "Oslo";

    t.equal(map.get('obj').location.name, "Oslo");

    // IMMUTABILITY!? WHERE!?

    // We need to be explicit when we're switching worlds. We need to actually
    // store immutable data.

    map = map.set('obj', Immutable.fromJS(deepObj));

    // Let's try changing it again
    deepObj.location.name = "Bergen";

    // We need to call `toJS` when fetching this object to make it a JavaScript
    // object again.

    t.equal(
        map.get('obj').toJS().location.name,
        "Oslo"
    );

    // PROBLEM: Implement the cache from the last test using
    // Maps in immutable-js: https://github.com/facebook/immutable-js

    var cache = (function() {
        var values = Immutable.Map();
        return {
            get: function(key) {
                return values.get(key).toJS();
            },
            set: function(key, value) {
                values = values.set(key, Immutable.fromJS(value));
            }
        };
    })();

    var obj = {
        name: "kim",
        location: {
            name: "Oslo"
        }
    };

    cache.set("user", obj);

    obj.wat = "crazy";
    obj.location.name = "Trondheim";

    var user = cache.get("user")
    user.someValue = "what?"

    var user2 = cache.get("user");

    t.equal(obj.name, "kim", "obj should contain name");
    t.equal(user.name, "kim", "user should contain name");
    t.equal(user2.name, "kim", "user2 should contain name");

    t.equal(obj.location.name, "Trondheim", "obj location should be Trondheim");
    t.equal(user.location.name, "Oslo", "user location should be Oslo");
    t.equal(user2.location.name, "Oslo", "user2 location should be Oslo");

    t.equal(obj.wat, "crazy", "obj should contain wat");
    t.equal(user.wat, undefined, "user should not contain wat");
    t.equal(user2.wat, undefined, "user2 should not contain wat");

    t.equal(obj.someValue, undefined, "obj should not contain someValue");
    t.equal(user.someValue, "what?", "user should contain someValue");
    t.equal(user2.someValue, undefined, "user2 should not contain someValue");

    t.end();
});

test('undo/redo with immutable.js', function(t) {
    // PROBLEM: Implement an object that handles undo and redo

    var StateHandler = function() {
        var state = null;
        var states = [];
        var redoStates = [];

        return {
            set: function(value) {
                var newState = Immutable.fromJS(value);
                states.push(state);
                state = newState;
                redoStates = [];
            },
            get: function() {
                if (state) return state.toJS();
            },
            canUndo: function() {
                return states.length > 0;
            },
            undo: function() {
                if (!this.canUndo()) return;

                redoStates.push(state);
                state = states.pop();
            },
            canRedo: function() {
                return redoStates.length > 0;
            },
            redo: function() {
                if (!this.canRedo()) return;

                states.push(state);
                state = redoStates.pop();
            }
        }
    }

    var state = StateHandler();

    t.equal(
        state.canUndo(), false,
        'Cannot undo as no changes yet'
    );
    t.equal(
        state.canRedo(), false,
        'Cannot redo as no undos yet'
    );

    state.set({ name: 'Kim' });
    state.set({ name: 'Kjetil' });

    t.equal(
        state.canUndo(), true,
        'Changes performed, we can now undo'
    );
    t.equal(
        state.canRedo(), false,
        'Still no undos, so cannot redo yet'
    );

    state.undo();

    var obj = state.get()
    t.equal(obj.name, 'Kim');

    t.equal(
        state.canUndo(), true,
        'We can undo after undo as we still have earlier changes'
    );
    t.equal(
        state.canRedo(), true,
        'We have performed an undo, so now we can redo'
    );

    state.undo();

    var obj2 = state.get()
    t.ok(
        obj2 == null,
        "We didn't have a user to begin with"
    );

    t.equal(
        state.canUndo(), false,
        "We're at the starting position, cannot undo"
    );
    t.equal(
        state.canRedo(), true,
        "We can still redo"
    );

    state.redo();

    var obj3 = state.get()
    t.equal(obj3.name, 'Kim');

    t.equal(
        state.canUndo(), true,
        "Now we can undo the redo"
    );
    t.equal(
        state.canRedo(), true,
        "We can also still redo"
    );

    state.redo();

    var obj4 = state.get()
    t.equal(obj4.name, 'Kjetil');

    t.equal(
        state.canUndo(), true,
        "And we can still undo"
    );
    t.equal(
        state.canRedo(), false,
        "We're at the latest state, cannot redo"
    );

    state.undo();

    var obj5 = state.get()
    t.equal(obj5.name, 'Kim');

    t.equal(
        state.canUndo(), true,
        "We still have changes that can be undo-ed"
    );
    t.equal(
        state.canRedo(), true,
        "And we can redo back to the former state"
    );

    state.set({ name: 'Stian' });
    state.set({ name: 'Mikael' });

    t.equal(
        state.canUndo(), true,
        "After updating state we can undo"
    );
    t.equal(
        state.canRedo(), false,
        "We cannot redo after updating state"
    );

    t.end();
});

test('lazy, yo (these might be a little slow)', function(t) {
    // Lazy evaluation -- deferral of expression evaluation for as long
    // as possible -- is a feature of many functional programming
    // languages. Lazy collections deliver their elements as needed
    // rather than precalculating them.

    // Basically, we can create infinite collections, which keep
    // delivering elements as long as they keep receiving requests.  In
    // some languages, such as Haskell, this is built into the core of
    // the language. Immutable.js gives us a little bit of this in
    // JavaScript.

    // Let's create an infinite range with a map that double each value
    // it receives.

    var divisibleByTwo = Immutable.Range(1, Infinity)
        .map(function(n) {
            return n * 2
        });

    // What's interesting is that `divisibleByTwo` still has done no
    // work even though it goes from 1 to inifity. The reason is that
    // the result is still not used. It's first when we actively ask
    // for data that things start happening:

    var res = divisibleByTwo.takeUntil(function(x) {
        return x > 10;
    });

    t.deepEqual(
        res.toJS(), [2,4,6,8,10],
        'finds numbers up to and including 10 divisable by 2'
    );

    var factorOf = _.curry(function(base, num) {
        return base % num == 0;
    });

    var factorsOf = function(n) {
        return filterWith(factorOf(n), _.range(0, n));
    };

    var sumOfFactors = _.compose(sum, factorsOf);

    var perfectNumber = function(num) {
        return sumOfFactors(num) == num;
    };

    // PROBLEM: Create an infinite range that filters on perfect numbers.

    var perfectNumbers = Immutable.Range(1, Infinity)
        .filter(perfectNumber);

    t.equal(
        perfectNumbers.first(),
        6,
        'finds first perfect number'
    );

    t.equal(
        perfectNumbers.skip(1).first(),
        28,
        'finds second perfect number'
    );

    // PROBLEM: Join the second and third perfect number on ","

    t.equal(
        perfectNumbers.skip(1).take(2).join(','),
        '28,496',
        'joins second and third perfect number'
    );

    t.end();
});

// If you want to learn more about the value of immutability, David
// Nolen (core developer of ClojureScript) has written a great blog
// post:
//
// http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/

