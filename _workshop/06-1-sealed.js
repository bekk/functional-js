---
layout: workshop
collection: workshop
title: Sealed structures
section: 6
prev: 05-4-parse-url
name: 06-1-sealed
next: 06-2-immutable
slides:
info: |

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
