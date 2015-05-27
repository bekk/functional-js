---
layout: workshop
collection: workshop
title: Shared state
section: 6
prev: 05-4-parse-url
name: 06-shared-state
next: 07-collections
slides:
info: |
  Sometimes we are working with shared state. Shared state is the source of many
  bugs and odd behavior in code. We will be looking at some ways this manifests
  and a few ways to guard against it.
---
// Let's say that we have the following cache
// implementation:
var naiveCache = (function() {
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

describe('naiveCache', function() {

  it('can get values', function() {
    naiveCache.set('test', 1);

    var result = naiveCache.get('test');
    expect(result).to.equal(1);
  });

  it('does not shield values from mutation', function() {
    var obj = { name: 'kim' };
    naiveCache.set('user', obj);

    obj.wat = 'crazy';

    //When we get the value again
    var user = naiveCache.get('user');

    // user.wat is now "crazy"
    // -- that's just crazy!
    expect(user.wat).to.equal('crazy');

    //This also works the other way
    user.someValue = 'what?';

    expect(obj.someValue).to.equal('what?');
  });

  it('does not prevent other from tampering with values', function() {

    // Now the initial `obj` contains `someValue` too.
    // The same applies for new cache gets:

    var user2 = naiveCache.get('user');
    // user.someValue is "what?"
  });
});

// This is one example of mutability potentially
// creating subtle bugs that are difficult to debug

// There are several ways to solve this problem. The first we'll look at is
// handling this by cloning the data we're working with. Lo-Dash contains
// two clone helpers: _.clone and _.cloneDeep. Let's first look at the
// difference between these.

// `_.clone` creates a creates a clone of value. That means that:

describe('_.clone', function() {
  it('does not refer to the same value', function() {
    var val = {};
		var result = val !== _.clone(val);
		expect(result).to.ok;
	});

  it('does not shield from mutating shared references', function() {
    var location = {
      county: {
        name: 'Nordland'
      }
    };

    var otherLocation = _.clone(location);
    otherLocation.county.name = 'Oslo';

    //They are not the same object
		expect(location !== otherLocation).to.ok;

    //But they do share a common reference to the same county-object
		expect(location.county.name).to.equal('Oslo');

    // Oups. There is a new reference on the base object, but the content is
    // not cloned and therefore still have the reference as before. It can
    // therefore be changed across objects.
  });
});

// The solution is `_.cloneDeep`, which recursively clones the object.
describe('_.cloneDeep', function() {
  var location = {
    county: {
      name: 'Nordland'
    }
  };
  var otherLocation = _.cloneDeep(location);
  otherLocation.county.name = 'Oslo';

  it('should not share reference', function() {
    expect(location !== otherLocation).to.ok;
  });

  it('should not share reference to shared objects', function() {
    expect(otherLocation.county.name).to.equal('Oslo');
    expect(location.county.name).to.equal('Nordland');
  });
});

// PROBLEM: Fix the `cache` code above, so the following tests run.
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

describe('cache', function() {
  var obj = {name: 'kim'};

  cache.set('user', obj);

  it('should preserve name of original object', function() {
		var result = cache.get('user').name;
		expect(result).to.equal('kim');
	});

  it('should not allow mutating stored obj', function() {
    var user = cache.get('user');
    user.name = 'stian';
		expect(obj.name).to.equal('kim');
		expect(user.name).to.equal('stian');
	});

  it('should not allow adding new props to stored obj', function() {
    var user = cache.get('user');
    user.wat = 'crazy';
		expect(obj.wat).to.equal(undefined);
		expect(user.wat).to.equal('crazy');
	});
});

// should we at all be able to change the object we received
// from the cache? Maybe not. Being able to will lead to
// subtle and hard to find bugs.

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

var frozenCache = (function() {
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

describe('frozenCache', function() {
  var obj = {name: 'kim'};
  frozenCache.set('user', obj);

  it('will not allow extension of objects recieved from the cache', function() {
    function result() {
      var user = frozenCache.get('user');
      user.test = 'wat?';
    }

    expect(result).to.throw(TypeError);
  });

  it('will not allow mutation of objects recieved from the cache', function() {
    function result() {
      var user = frozenCache.get('user');
      user.name = 'kjetil';
    }

    expect(result).to.throw(TypeError);
  });
});
