---
layout: workshop
collection: workshop
title: Part 5
section: 5
name: 05-curry-compose
prev: 04-partially
next: 06-immutability
slides: http://omniscientjs.github.io/workshop-slides/#9
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

})

describe('composing function', function() {
    // Sometimes we write code where the functions we use line up nicely with
    // regards to arguments.  For example, say that we want to find the first
    // element of a range (which, as you can see, is quite stupid --
    // nevertheless):

    it('a test', function() {
			var result = _.first(_.range(1, 10));
			expect(result).to.equal(1);
		});

    it('a test', function() {
			var result = _.last(_.range(1, 10));
			expect(result).to.equal(9);
		});

    // _.range receives to numbers and return an array of numbers
    // _.first receives an array and returns the first element
    // _.last receives an array and returns the last element
    //
    // That means that the result of _.range can be used directly
    // as input for _.first or _.last

    // Whenever we see this pattern:
    //
    //     fn1(fn2(some, input))
    //
    // we can instead write:
    //
    //     _.compose(fn1, fn2)(some, input)
    //
    // or, as you will mostly not invoke the function at once but first
    // later when used:
    //
    //     var someFn = _.compose(fn1, fn2)
    //     someFn(some, input)

    // One example of this is _.curry(flip(_.map)) in the previous
    // test. Using compose we can rewrite this:

    function flip(fn) {
        return function(first, second) {
            return fn.call(this, second, first);
        };
    };

    var curriedFlip = _.compose(_.curry, flip);
    var mapWith = curriedFlip(_.map);

    // This might seem strange now, but we'll soon see some great
    // examples of why you might want to do this.

    // PROBLEM: Your task is to use _.compose to create these
    // functions:

    var firstInRange = null;
    var lastInRange = null;

    it('a test', function() {
			var result = firstInRange(4, 13);
			expect(result).to.equal(4);
		});

    it('a test', function() {
			var result = lastInRange(7, 18);
			expect(result).to.equal(17);
		});

});

describe('curry and compose', function() {
    // Remember our curried splitOn?

    var splitOn = _.curry(function(chr, str) {
        //return str.split(chr);
    });

    it('a test', function() {
        log('heia')
			var result = splitOn(",")("1,2,3");
        log('heia etter')
			expect(result).to.deep.equal(['1','2','3']);
		});

    it('a test', function() {
			var result = splitOn(",", "1,2,3");
			expect(result).to.deep.equal(['1','2','3']);
		});

    // If we now combine composition and currying, we can start doing
    // interesting things:

    var beforeFirstComma = _.compose(_.first, splitOn(","));

    // Remember, when composing the input to the composed
    // functions is passed to the rightmost function, i.e.
    // `splitOn(",")` in this case.

    it('a test', function() {
			var result = beforeFirstComma("1,2,3");
			expect(result).to.equal("1");
		});

    // Let's try to create something more advanced

    function after(chr, str) {
        var arr = str.split(chr);
        return _.rest(arr).join("");
    }

    it('a test', function() {
			var result = after("?", "test?hei");
			expect(result).to.equal("hei");
		});

    var joinOn = _.curry(function(chr, arr) {
        return arr.join(chr);
    });

    // PROBLEM: Compose splitOn, joinOn and _.rest (in some order) to
    // create a function that does the same as `after`.

    // It's important to think about a couple of things:
    //
    // - which arguments are applied when
    // - you want to line-up the functions so each match the return value of the previous one
    // - as you can only return one value, most function can only receive one argument
    // - except the first function, that can receive as many arguments as you'd like

    var composedAfter = _.compose(
    );

    it('a test', function() {
			var result = composedAfter("?", "test?hei");
			expect(result).to.equal("hei");
		});

});

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

describe('parsing a url', function() {
    // Okey, this is the big one. This is where we'll see the beauty of using
    // composition and currying.

    // In this test we're going to parse out the queryparams of this url:

    var url = "http://example.com/fetch?product=widget&color=red&size=6";

    // The end result looks like this:
    //
    //     {
    //         product: "widget",
    //         color: "red",
    //         size: 6
    //     }

    // Let's start by bringing in some of the helper functions we've been
    // playing with:

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

    var after = _.curry(pipeline(
        splitOn,
        _.rest,
        joinOn("")
    ), 2);

    // Now we can start putting some of these together. A first step in parsing
    // the url is finding the queryparams and splitting on &:

    var parse = pipeline(after("?"), splitOn("&"));

    it('a test', function() {
			var result = parse(url);
			expect(result).to.deep.equal(['product=widget', 'color=red', 'size=6']);
		});

    // Okey, we're getting somewhere

    // The next thing we want to do, is go from:
    //
    //     ['product=widget', 'color=red', 'size=6']
    //
    // to
    //
    //     [
    //         ['product', 'widget'],
    //         ['color', 'red'],
    //         ['size', '6']
    //     ]
    //
    // We will call this pairing on "="
    //
    // And as soon as we are there, we can use the lovely
    // _.object helper to make an object out of this:
    //
    //     {
    //         product: 'widget',
    //         color: 'red',
    //         size: '6'
    //     }

    // PROBLEM: So -- your task is to create the pairOn helper:
    // (oh, and remember to reuse splitOn and that it should
    // be curried.)

    var pairOn = null;

    var values = ['product=widget', 'color=red', 'size=6'];
    var res = [
        ['product', 'widget'],
        ['color', 'red'],
        ['size', '6']
    ];

    it('a test', function() {
			var result =         pairOn("=", values);
			expect(result).to.deep.equal(        res);
		});

    it('a test', function() {
			var result =         pairOn("=")(values);
			expect(result).to.deep.equal(        res);
		});

    // And then, behold the glory of _.object

    it('a test', function() {
      var result = _.object(pairOn("=", values))
      expect(result).to.deepEqual(
          {
              product: "widget",
              color: "red",
              size: "6"
          }
      );
    });

    // Nice!

    // PROBLEM: Now we need to connect the dots from start to finish, using
    // only pipeline, after, splitOn, pairOn and _.object:

    var parseUrl = pipeline(
    );

    it('a test', function() {
      var result = parseUrl(url);
      expect(result).to.deepEqual(
          {
              product: "widget",
              color: "red",
              size: "6"
          }
      );
    });

    // BOOM!

    // So, we just implemented this (simplistic) url parsing using only
    // reusable functions and no state.

    // PROBLEM: Okey, let's also use _.compose directly instead of pipeline:

    var parseUrl2 = _.compose(
    );

    it('a test', function() {
      var result = parseUrl2(url);
      expect(result).to.deepEqual(
          {
              product: "widget",
              color: "red",
              size: "6"
          }
      );
    });


    // FP allows you to elevate your level of abstraction, seeing
    // problems with better clarity. For more about this, I recommend
    // watching Rich Hickey's amazing "Simple Made Easy":
    // http://www.infoq.com/presentations/Simple-Made-Easy

    // "OO makes code understandable by encapsulating moving parts.
    // FP makes code understandable by minimizing moving parts."
    //   - Michael Feathers

});

// BAM! Now it's time to take a break — your brain is overflowing with crazy.
