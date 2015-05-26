---
layout: workshop
collection: workshop
title: Immutable.js
section: 6
prev: 06-1-sealed
name: 06-2-immutable
next: 06-3-lazy
slides:
notes: |

---
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
