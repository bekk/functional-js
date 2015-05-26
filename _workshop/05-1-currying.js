---
layout: workshop
collection: workshop
title: Currying
section: 5
prev: 04-2-functions-from-functions
name: 05-1-currying
next: 05-2-compose
slides:
notes: |

---
// Okay, the generalization made it a little bit easier to create our
// with-functions. Now, however, to get away from that call to
// _.partial, we need to take a look at another technique: currying.

// A curried function is a function that will return a new function until
// it receives all of it's arguments. In other words, currying
// describes the conversion of a multiargument function into a chain of
// single-argument functions. (Okey, still a lot of words. Let's look
// at an example -- that should make it far more understandable.)

describe('self-currying', function() {
    // We start by changing flip to return a functions that accept
    // either one or two parameters. If it receives one parameter, it
    // returns a new function that takes one parameter. If it receives
    // both, it calls the function.

    function flip(fn) {
        return function(first, second) {
            if (typeof second == "undefined") {
                return function(second) {
                    return fn.call(null, second, first);
                }
            }
            return fn.call(null, second, first);
        };
    };

    // Now we can create `square` directly without _.partial

    var mapWith = flip(_.map);

    var square = mapWith(function(n) {
        return n * n;
    });

    it('a test', function() {
			var result = square([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // We can also call mapWith with both parameters at once:

    var squared = mapWith(function(n) {
        return n * n;
    }, [1,2,3]);

    it('a test', function() {
			var result = squared;
			expect(result).to.deep.equal([1,4,9]);
		});

    // This technique is great since we sometimes know one parameter at
    // "compile-time" (such as squaring) and the other at run-time (the input).

    // PROBLEM: Now it's your turn to try this out. Implement `splitOn`
    // which accepts as first argument a character to split on, and as
    // the second argument the string you want to split. Remember than
    // it can be called with either only the first or with both
    // arguments.
    // (You can use `str.split` to handle the splitting.)

    var splitOn = function(chr, str) {
    };

    it('a test', function() {
			var result = splitOn(":", "1:2:3");
			expect(result).to.deep.equal(['1', '2' ,'3']);
		});

    var commaSplitter = splitOn(",");

    it('a test', function() {
			var result = commaSplitter("2,3,4");
			expect(result).to.deep.equal(['2', '3', '4']);
		});

});

describe('better curry', function() {
    // However, we neither want nor need to write all of this stuff ourselves
    // of course! Once again, Lo-Dash to the rescue -- now with its _.curry.

    // First, let's get back to our simple flip:
    function flip(fn) {
        return function(first, second) {
            return fn.call(this, second, first);
        };
    };

    // Now, using _.curry together with flip, we can create a function
    // that works as the mapWith we created in the previous test.
    // ("oh yeah, you just need to curry the flip …")

    var mapWith = _.curry(flip(_.map));

    var square = mapWith(function(n) {
        return n * n;
    });

    it('a test', function() {
			var result = square([1,2,3]);
			expect(result).to.deep.equal([1,4,9]);
		});

    // And with both parameters at once:

    var squared = mapWith(function(n) {
        return n * n;
    }, [1,2,3]);

    it('a test', function() {
			var result = squared;
			expect(result).to.deep.equal([1,4,9]);
		});

    // PROBLEM: Implement `splitOn` from the previous test using `_.curry`.

    var splitOn = function () {};

    it('a test', function() {
			var result = splitOn(":", "1:2:3");
			expect(result).to.deep.equal(['1', '2' ,'3']);
		});

    var commaSplitter = splitOn(",");

    it('a test', function() {
			var result = commaSplitter("2,3,4");
			expect(result).to.deep.equal(['2', '3', '4']);
		});

});
