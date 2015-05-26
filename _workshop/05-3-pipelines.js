---
layout: workshop
collection: workshop
title: Pipelines
section: 5
prev: 05-2-compose
name: 05-3-pipelines
next: 05-4-parse-url
slides:
info: |

---
describe('pipelining after', function() {
    // In the JS world we're not used to reading from the right
    // as in this example from earlier:
    var composed = _.compose(_.last, _.range);

    // Here `range` is called first, then `last` is called on the
    // result from range.

    // Thankfully it's easy to reverse the arguments -- we have already
    // done this using flip! Let's create a function that works like
    // flip, but with any number of arguments:

    var flipN = function(fn) {
        return function() {
            // reverse arguments when called
            // (remember that arguments is not an array)
            return fn.apply(this, _.toArray(arguments).reverse());
        }
    }

    // And, as for flip:
    var pipeline = flipN(_.compose);

    // Now pipeline expects to receive its arguments in reversed order
    // of compose, i.e. now we can write this "the other way around".
    // For a pipelined version of last in range:
    var pipelined = pipeline(_.range, _.last);

    // And we ensure that they do the same thing:
    it('a test', function() {
			var result = composed(1,10);
			expect(result).to.equal(9);
		});

    it('a test', function() {
			var result = pipelined(1,10);
			expect(result).to.equal(9);
		});

    // So, let's get back to the `after` function we created in the
    // previous test. First we'll bring in the helpers:

    var splitOn = _.curry(function(chr, str) {
        //return str.split(chr);
    });

    var joinOn = _.curry(function(chr, arr) {
        return arr.join(chr);
    });

    // PROBLEM: Now, it's your turn to create a pipelined after.
    var after = pipeline(
    );

    it('a test', function() {
			var result = after("?", "test?hei");
			expect(result).to.equal("hei");
		});

});

describe('a spicy trick', function() {
    // First our helpers for this test:

    var flipN = function(fn) {
        return function() {
            return fn.apply(this, _.toArray(arguments).reverse());
        }
    }
    var pipeline = flipN(_.compose);

    var splitOn = _.curry(function(chr, str) {
        //return str.split(chr);
    });

    var joinOn = _.curry(function(chr, arr) {
        return arr.join(chr);
    });

    // In the last test we left off at something like this:

    var after = pipeline(
        splitOn,
        _.rest,
        joinOn("")
    );

    it('a test', function() {
			var result = after("?", "test?hei");
			expect(result).to.equal("hei");
		});

    // Now, we want to curry this function too. So we try with this:

    var after = _.curry(pipeline(
        splitOn,
        _.rest,
        joinOn("")
    ));

    // But, sadly this doesn't entirely work. It works when called with
    // both parameters:

    it('a test', function() {
			var result = after("?", "test?hei");
			expect(result).to.equal("hei");
		});

    // However, it fails hard when called with one at a time and gives us:
    //
    //     [TypeError: string is not a function]

    it('a test', function() {
      function result() {
          after("?")("test?hei");
      }
      expect(result()).to.throw(TypeError);
    });
    // Why does this happen?

    // The problem is that the pipeline don't expect any arguments, so
    // `_.curry` think we're done the first time we call a curried function.
    // We could solve it using something like this, where we're explicit about
    // two arguments.

    var after2 = _.curry(function(chr, str) {
        return pipeline(
            splitOn,
            _.rest,
            joinOn("")
        )(chr, str);
    });

    it('a test', function() {
			var result = after2("?", "test?hei");
			expect(result).to.equal("hei");
		});

    it('a test', function() {
			var result = after2("?")("test?hei");
			expect(result).to.equal("hei");
		});

    // That works! However, now we see (chr, str) in both the function
    // definition and where we execute our function. This isn't very nice.
    // (Point-free style and all that.) The solution is to tell curry how many
    // arguments we expect:

    var after3 = _.curry(pipeline(
        splitOn,
        _.rest,
        joinOn("")
    ), 2);

    it('a test', function() {
			var result = after3("?", "test?hei");
			expect(result).to.equal("hei");
		});

    it('a test', function() {
			var result = after3("?")("test?hei");
			expect(result).to.equal("hei");
		});

    // Okay, there was actually no tests to implement here, just a long
    // explanation of currying and arity. If you're still with us, you're
    // starting to understand how composition and currying works.

});
