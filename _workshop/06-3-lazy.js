---
layout: workshop
collection: workshop
title: Lazy evaluation
section: 6
prev: 06-2-immutable
name: 06-3-lazy
next: 07-collections
slides:
info: |

---
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
