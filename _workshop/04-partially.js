---
layout: workshop
collection: workshop
title: Part 4
section: 4
name: 04-partially
prev: 03-functions
next: 05-curry-compose
slides: http://omniscientjs.github.io/workshop-slides/#9
---

// Partial application describes the process of presetting the value of
// some arguments "up front", i.e. we bind argument values to values
// that we supply, producing a function that accepts less arguments.

describe('partially bind', function() {
    // We will start by using `bind`, which is yet another way of
    // specifying `this` in JavaScript.

    function addOne() {
        return this + 1;
    }

    var fourPlusOne = addOne.bind(4)
    it('a test', function() {
			var result = fourPlusOne();
			expect(result).to.equal(5);
		});

    // However, `bind` can do more powerful stuff than this: we can
    // actually partially apply some arguments. It's easier to
    // understand this with an example. Let's say we have a function
    // that takes two parameters:

    function plus(a, b) {
        return a + b;
    }

    // Now, let's bind the first of these parameters, `a`, to
    // the value 2.

    var addTwo = plus.bind(null, 2);

    // This returns a new function where `a` is already set, and which
    // we can then call with the last parameter, `b`:

    it('a test', function() {
			var result = addTwo(40);
			expect(result).to.equal(42);
		});

    // This is a powerful technique. The only problem with `bind`, is
    // that we need to specify the context ourselves. However, as we
    // learned when we looked at decorators, this is something a
    // function can do for us (using `call` or `apply` internally).
    // Also, in some cases we might want to partially apply from the
    // right instead of from the left. It's time to get back to Lo-Dash
    // and the helpers offered there.

});

describe('partial application', function() {
    // Let's start by going back to plus:

    function plus(a, b) {
        return a + b;
    }

    // Using Lo-Dash's partial application helper, we could write:

    var addTwo = _.partial(plus, 2);

    it('a test', function() {
			var result = addTwo(40);
			expect(result).to.equal(42);
		});

    // PROBLEM: Use `_.partialRight` to apply in the other direction,
    // i.e. to set `b` first.

    var addThree = null;

    it('a test', function() {
			var result = addThree(5);
			expect(result).to.equal(8);
		});

    // Now, let's get back to `parseInt`. A natural first step when
    // wanting to apply 10 as the last parameter is to try it out:

    var parseDigit = _.partialRight(parseInt, 10)

    it('a test', function() {
			var result = parseDigit('08');
			expect(result).to.equal(8);
		});

    // Perfect, that works! Okey, now:

    var parsed = ['1', '2', '3'].map(parseDigit)

    // But no, this is not as we expected:

    it('a test', function() {
			var result = parsed[0];
			expect(result).to.equal(1);
		});
    it('a test', function() {
			var result = isNaN(parsed[1]);
			expect(result).to.ok;
		});
    it('a test', function() {
			var result = isNaN(parsed[2]);
			expect(result).to.ok;
		});

    // Why?

    // Let's look at a simple way of implementing partialRight (without
    // considering the context):

    function partialRight(fn) {
        var rightArgs = _.toArray(arguments);

        return function() {
            var leftArgs = _.toArray(arguments);
            var args = leftArgs.concat(rightArgs);

            fn.apply(null, args);
        }
    }

    // This should clear things up. The problem is that `map` passes three
    // arguments on every invocation. So with partial application from the
    // right, we now end up with 4 arguments.

    // Unary to the rescue again:

    function unary(fn) {
        return function(arg) {
            return fn.call(this, arg)
        }
    }

    ['1', '2', '3'].map(unary(parseDigit))

    // So -- if you understood that, you have really started to get a grip on
    // how functions and arguments work in JavaScript.

    // The solution here didn't end up too smooth, but later in this workshop
    // we'll see a couple of techniques that can help us improve this significantly.

});

describe('create functions from functions', function() {
    // Okey, let's keep playing with partial application. The thing about map,
    // filter and reduce is that we often have a "static" function as the last
    // parameter, and a "dynamic" input that is applied to the function. Take
    // for example this function:

    function square(arr) {
        return _.map(arr, function(val) {
            return val * val;
        });
    }

    it('a test', function() {
			var result = square([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // With partial application this can also be written like this:

    var square2 = _.partialRight(_.map, function(val) {
        return val * val;
    });

    it('a test', function() {
			var result = square2([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // Note that we never specify the array argument in `square2`, but we need
    // to specify it in `square`. Again, point-free style.

    // PROBLEM: Use _.partialRight to create a function that filters
    // all odd values from an array

    var onlyEven = null;

    it('a test', function() {
			var result = onlyEven([1,2,3,4,5]);
			expect(result).to.deep.equal([2,4]);
		});

});

describe('mapWith', function() {
    // Above we needed to use _.partialRight to create our function based on
    // `map` and `filter`. As we touched upon you often want to work in the
    // opposite direction of the direction specified by Lo-Dash and
    // Underscore.js -- that is, we want to partially apply the last parameter,
    // the function, first. So, let's create a function that works the other way
    // around:

    function mapWith(fn, arr) {
        return _.map(arr, fn);
    };

    var square = _.partial(mapWith, function(val) {
        return val * val;
    });

    it('a test', function() {
			var result = square([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // PROBLEM: Use `mapWith` and `_.partial` to create a function that adds
    // the current index to the current value:

    var plusIndex = null;

    it('a test', function() {
			var result = plusIndex([1,2,3]);
			expect(result).to.deep.equal([1,3,5]);
		});

    // But damn, it would be nice to get away from that call to
    // _.partial! In order to get there, let's first do a small
    // generalization then we'll take a look at a another powerful
    // technique.

});

describe('flip', function() {
    // So, first the generalization: Instead of flipping the arguments
    // ourselves we can create a flip method which flips the two
    // arguments on the passed function:

    function flip(fn) {
        return function(first, second) {
            return fn.call(this, second, first);
        };
    };

    // We can use this function to create mapWith:

    var mapWith = flip(_.map);

    // And then, as above:

    var square = _.partial(mapWith, function(val) {
        return val * val;
    });

    it('a test', function() {
			var result = square([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // PROBLEM: Use flip to create a parseInt that applies in the other
    // direction, i.e. the base first. Then partially apply it to create
    // parseDigit. (Because flip only works on two arguments, we don't need to
    // think about the unary stuff we did earlier.)

    var parseDigit = null;

    var parseDigits = _.partial(mapWith, parseDigit);

    it('a test', function() {
			var result = parseDigits(['123', '08', '001']);
			expect(result).to.deep.equal([123, 8, 1]);
		});

});
