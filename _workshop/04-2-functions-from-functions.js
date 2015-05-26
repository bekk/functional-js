---
layout: workshop
collection: workshop
title: Part 4
section: 4
prev: 04-1-partial-application
name: 05-curry-compose
slides:
info: |
---
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
