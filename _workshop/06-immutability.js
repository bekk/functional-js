---
layout: workshop
collection: workshop
title: Part 6
section: 6
name: 06-immutability
prev: 05-curry-compose
next: 07-collections
slides: http://omniscientjs.github.io/workshop-slides/#9
---

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

describe('cloning away the mutability', function() {
    // Let's say that we have the following cache
    // implementation:
    var cache = (function() {
        var values = {};
        return {
            get: function(key) {
                return values[key];
            },
            set: function(key, value) {
                values[key] = value;
            }
        };
    })();

    // Now we can set and get from the cache:

    cache.set("test", 1);

    it('a test', function() {
			var result = cache.get("test");
			expect(result).to.equal(1);
		});

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

    it('a test', function() {
			var result = val !== _.clone(val);
			expect(result).to.ok;
		});

    // I.e. we get a new reference. There is one problem however:

    var location = {
        county: {
            name: 'Nordland'
        }
    }

    var otherLocation = _.clone(location);
    otherLocation.county.name = 'Oslo';

    // This is good:
    it('a test', function() {
			var result = location !== otherLocation;
			expect(result).to.ok;
		});

    // This, however, is NOT good:
    it('a test', function() {
			var result = location.county.name;
			expect(result).to.equal('Oslo');
		});

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

    it('a test', function() {
			var result = location !== otherLocation;
			expect(result).to.ok;
		});
    it('a test', function() {
			var result = newLocation.county.name;
			expect(result).to.equal('Nordland');
		});

    // PROBLEM: Fix the `cache` code above, so the following tests run.

    it('a test', function() {
			var result = obj.name;
			expect(result).to.equal('kim');
		});
    it('a test', function() {
			var result = user.name;
			expect(result).to.equal("kim");
		});
    it('a test', function() {
			var result = user2.name;
			expect(result).to.equal("kim");
		});

    it('a test', function() {
			var result = obj.wat;
			expect(result).to.equal("crazy");
		});
    it('a test', function() {
			var result = user.wat;
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = user2.wat;
			expect(result).to.equal(undefined);
		});

    it('a test', function() {
			var result = obj.someValue;
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = user.someValue;
			expect(result).to.equal("what?");
		});
    it('a test', function() {
			var result = user2.someValue;
			expect(result).to.equal(undefined);
		});

});

describe("prevent cache changes", function() {
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
        return {
            get: function(key) {
                return _.cloneDeep(values[key]);
            },
            set: function(key, value) {
                values[key] = _.cloneDeep(value);
            }
        };
    })();

    it('a test', function() {
      function result() {
        cache.test = "wat?";
      }

      expect(result()).to.throw(TypeError);
    });

    var obj = { name: "kim" };
    cache.set("user", obj);

    var user = cache.get("user");

    it('a test', function() {
      function result() {
        user.name = "kjetil";
      }

      expect(result()).to.throw(TypeError);
    });

    it('a test', function() {
      function result() {
        user.someValue = "test";
      }

      expect(result()).to.throw(TypeError);
    });

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

// This library has an API that closely mirrors that of Array, Map, and
// Set in pure JavaScript.

// Map and Set is part of ES6:
//
// - Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// - Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

// This is the API documentation:
// https://github.com/facebook/immutable-js/blob/master/type-definitions/Immutable.d.ts

describe('cache using immutable.js', function() {
    // Basic introduction to Immutable-js:

    // In this test we'll be working with maps. We can create a map from an
    // existing JavaScript object:

    var obj = { a: 1, b: 2, c: 3 };
    var map = Immutable.Map(obj);

    // We can export a JavaScript object from the Immutable.Map using `toJS`:
    var obj2 = map.toJS();

    it('a test', function() {
			var result = obj;
			expect(result).to.deep.equal( obj2);
		});

    // However,
    it('a test', function() {
			var result = obj !== obj2;
			expect(result).to.ok;
		});

    // We can set new key/value pairs on the map:

    map = map.set('user', 10);
    it('a test', function() {
			var result = map.get('user');
			expect(result).to.equal(10);
		});

    // We can also set objects:

    var deepObj = {
        location: {
            name: "Trondheim"
        }
    };

    map = map.set('obj', deepObj);

    it('a test', function() {
			var result = map.get('obj');
			expect(result).to.deep.equal( deepObj);
		});

    // But here there's something interesting
    it('a test', function() {
			var result = map.get('obj') === deepObj;
			expect(result).to.ok;
		});

    // This means that we can change the content:

    deepObj.location.name = "Oslo";

    it('a test', function() {
			var result = map.get('obj').location.name;
			expect(result).to.equal("Oslo");
		});

    // IMMUTABILITY!? WHERE!?

    // We need to be explicit when we're switching worlds. We need to actually
    // store immutable data.

    map = map.set('obj', Immutable.fromJS(deepObj));

    // Let's try changing it again
    deepObj.location.name = "Bergen";

    // We need to call `toJS` when fetching this object to make it a JavaScript
    // object again.

    it('a test', function() {
			var result = map.get('obj').toJS().location.name;
			expect(result).to.equal("Oslo");
		});

    // PROBLEM: Implement the cache from the last test using
    // Maps in immutable-js: https://github.com/facebook/immutable-js

    var cache = (function() {
        return {
            get: function(key) {
              return {}
            },
            set: function(key, value) {
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

    it('a test', function() {
			var result = obj.name;
			expect(result).to.equal("kim");
		});
    it('a test', function() {
			var result = user.name;
			expect(result).to.equal("kim");
		});
    it('a test', function() {
			var result = user2.name;
			expect(result).to.equal("kim");
		});

    it('a test', function() {
			var result = obj.location.name;
			expect(result).to.equal("Trondheim");
		});
    it('a test', function() {
			var result = user.location.name;
			expect(result).to.equal("Oslo");
		});
    it('a test', function() {
			var result = user2.location.name;
			expect(result).to.equal("Oslo");
		});

    it('a test', function() {
			var result = obj.wat;
			expect(result).to.equal("crazy");
		});
    it('a test', function() {
			var result = user.wat;
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = user2.wat;
			expect(result).to.equal(undefined);
		});

    it('a test', function() {
			var result = obj.someValue;
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = user.someValue;
			expect(result).to.equal("what?");
		});
    it('a test', function() {
			var result = user2.someValue;
			expect(result).to.equal(undefined);
		});

});

describe('undo/redo with immutable.js', function() {
    // PROBLEM: Implement an object that handles undo and redo

    var StateHandler = function() {
        var state = null;
        var states = [];
        var redoStates = [];

        return {
            set: function(value) {
            },
            get: function() {
            },
            canUndo: function() {
            },
            undo: function() {
            },
            canRedo: function() {
            },
            redo: function() {
            }
        }
    }

    var state = StateHandler();

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(false);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(false);
		});

    state.set({ name: 'Kim' });
    state.set({ name: 'Kjetil' });

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(false);
		});

    state.undo();

    var obj = state.get()
    it('a test', function() {
			var result = obj.name;
			expect(result).to.equal('Kim');
		});

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(true);
		});

    state.undo();

    var obj2 = state.get()
    it('a test', function() {
			var result = obj2 == null;
			expect(result).to.ok;
		});

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(false);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(true);
		});

    state.redo();

    var obj3 = state.get()
    it('a test', function() {
			var result = obj3.name;
			expect(result).to.equal('Kim');
		});

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(true);
		});

    state.redo();

    var obj4 = state.get()
    it('a test', function() {
			var result = obj4.name;
			expect(result).to.equal('Kjetil');
		});

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(false);
		});

    state.undo();

    var obj5 = state.get()
    it('a test', function() {
			var result = obj5.name;
			expect(result).to.equal('Kim');
		});

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(true);
		});

    state.set({ name: 'Stian' });
    state.set({ name: 'Mikael' });

    it('a test', function() {
			var result = state.canUndo();
			expect(result).to.equal(true);
		});
    it('a test', function() {
			var result = state.canRedo();
			expect(result).to.equal(false);
		});

});

describe('lazy, yo (these might be a little slow)', function() {
    // Lazy evaluation -- deferral of expression evaluation for as long
    // as possible -- is a feature of many functional programming
    // languages. Lazy collections deliver their elements as needed
    // rather than precalculating them.

    // Basically, we can create infinite collections, which keep
    // delivering elements as long as they keep receiving requests. In
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

    it('a test', function() {
			var result = res.toJS();
			expect(result).to.deep.equal([2,4,6,8,10]);
		});

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

    var perfectNumbers = null;

    it('a test', function() {
			var result = perfectNumbers.first();
			expect(result).to.equal(6);
		});

    it('a test', function() {
			var result = perfectNumbers.skip(1).first();
			expect(result).to.equal(28);
		});

    // PROBLEM: Join the second and third perfect number on ","

    it('a test', function() {
			var result = null;
			expect(result).to.equal('28,496');
		});

});

// If you want to learn more about the value of immutability, David
// Nolen (core developer of ClojureScript) has written a great blog
// post:
//
// http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/
