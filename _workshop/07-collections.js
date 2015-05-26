---
layout: workshop
collection: workshop
title: Working with collections
section: 7
prev: 06-3-lazy
name: 07-collections
next: 08-done
slides:
info: |

---

// Now we will start taking a look at some of the very nice functions
// included in libraries such as Lo-Dash and Underscore.

// Generally, these are collection-centric helpers, i.e. helpers for
// tasks requiring that some operation happen on many items in a
// collection.

describe('pluck', function() {
    // How many unique authors are there?
    var authors = _.uniq(_.map(books, function(book) {
        return book.author;
    }));

    it('a test', function() {
			var result = authors.length;
			expect(result).to.equal(25);
		});

    // Often we will see this patterns with map -- only getting the
    // value of a key for each item. Generally, there are many nice
    // helpers that can sweeten up our code. One example of this is
    // pluck:
    var authors2 = _.uniq(_.pluck(books, 'author'));

    it('a test', function() {
			var result = authors2.length;
			expect(result).to.equal(25);
		});

    // PROBLEM: Okey, that was all authors. Now, how many unique authors have
    // received a 5 star rating on atleast one book?

    var fiveStarAuthors = null;

    it('a test', function() {
			var result = fiveStarAuthors.length;
			expect(result).to.equal(7);
		});

});

describe('chain', function() {
    // On the last test you might have have ended up with something
    // like this:

    var fiveStarAuthors = _.uniq(_.pluck(_.filter(books, function(book) {
        return book.rating == 5;
    }), 'author'));

    // Or, maybe,

    var fiveStarAuthors2 = _.uniq(_.pluck(_.where(books, { rating: 5 }), 'author'));

    // Thing is, this is hard to read. If you've been following along with all
    // the currying and composition we have done so far, maybe something like this:

    function flip(fn) {
        return function(first, second) {
            return fn.call(this, second, first);
        };
    };

    var filterWhere = _.curry(flip(_.where));
    var pluckWith = _.curry(flip(_.pluck));

    var fiveStarAuthors3 = _.compose(_.uniq, pluckWith('author'), filterWhere({ rating: 5 }));

    // I think this is far easier to read and understand.

    // Just to show you they are equal (well, except for actually applying
    // authors later in the composed version -- point-free, remember).

    it('a test', function() {
			var result = fiveStarAuthors;
			expect(result).to.deep.equal(fiveStarAuthors2);
		});

    it('a test', function() {
			var result = fiveStarAuthors2;
			expect(result).to.deep.equal(fiveStarAuthors3(books));
		});

    // As Lo-Dash and Underscore are not too well suited for functional
    // programming out-of-the-box, especially because of the wrong
    // ordering of arguments, many end up using chain quite a bit.
    // Let's look at how we could have solved this with `_.chain`:

    var fiveStarAuthors4 = _.chain(books)
        .filter(function(book) {
            return book.rating == 5;
        })
        .pluck('author')
        .uniq()
        .value();

    it('a test', function() {
			var result = fiveStarAuthors;
			expect(result).to.deep.equal(fiveStarAuthors4);
		});

    // It doesn't look too bad, but there is one major negative aspect
    // of this: it only works for the functions that are made available
    // on the `_.chain`. With `_.compose`, however, we can put in
    // whatever functions we want.

    // Just a small trick: you can tap into the `_.chain` using `_.tap`:

    var fiveStarAuthors4 = _.chain(books)
        .filter(function(book) {
            return book.rating == 5;
        })
        .tap(function(book) {
            // tap is basically just a function that gives you access to the
            // current element, then it passes that element along. This makes
            // it easy to add logging, for example.
        })
        .pluck('author')
        .uniq()
        .value();

    it('a test', function() {
			var result = fiveStarAuthors;
			expect(result).to.deep.equal(fiveStarAuthors4);
		});

    // PROBLEM: Use chaining to find the total number of pages on 4
    // star books

    var pages = _.chain(books)
        .value();

    it('a test', function() {
			var result = pages;
			expect(result).to.equal(4259);
		});

});

describe('grouping, sorting and counting', function() {
    // PROBLEM: Sort authors descending on their number of books and return the
    // 3 most read authors

    // To solve this as one chain, I recommend getting familiar with the
    // Lo-dash docs, and especially
    //
    // - groupBy: http://lodash.com/docs#groupBy
    // - sortBy: http://lodash.com/docs#sortBy
    // - countBy: http://lodash.com/docs#countBy

    // Also, do remember to `tap` if you need to debug!

    var authors = _.chain(books)
        .value();

    it('a test', function() {
			var result = authors;
			expect(result).to.deep.equal(['Martin, George R.R.', 'Gaiman, Neil', 'Taleb, Nassim Nicholas']);
		});

    // In the end we should not need to handle state at all to solve this
    // problem. This code, written imperatively, would have been very different.

});

// And that's just about it. We'll now finish up at an interesting point --
// functions that call themselves. Recursive functions have generally not been
// much used in JavaScript. An important factor of why is the historic lack of
// tail-call optimization, meaning that the call-stack would grow unboundedly,
// in the end growing too large and killing everything. With EcmaScript 6 comes
// proper tail-calls to JavaScript, finally enabling us to use recursion more.

describe('recursion', function() {
    // Let's look at a couple of recursive functions.

    function len(arr) {
        if (arr.length == 0) {
            return 0;
        } else {
            return 1 + len(_.rest(arr));
        }
    }

    it('a test', function() {
			var result = len([]);
			expect(result).to.equal(0);
		});
    it('a test', function() {
			var result = len([1000]);
			expect(result).to.equal(1);
		});
    it('a test', function() {
			var result = len([1,2,3]);
			expect(result).to.equal(3);
		});

    // ... the rules of thumb
    function map(list, cb) {
        // Know when to stop
        if (list.length == 0) {
            return [];
        }

        // Decide how to take one step
        // (we create a new array containing the result of the callback applied
        // to first element in the list)
        return [cb(_.first(list))]
            // Break the problem into a smaller problem
            // (we concat the array with the result of calling map on the rest
            // of the array)
            .concat(map(_.rest(list), cb));
    }

    // Interestingly, we now have no variables at all, i.e. we don't handle the
    // state ourselves.

    var res = map([1,2,3,4,5], function(num) {
        return num * num;
    });

    it('a test', function() {
			var result = res;
			expect(result).to.deep.equal([1,4,9,16,25]);
		});

    // PROBLEM: Implement filter using recursion.

    function filter(list, pred) {
    }

    var res = filter([1,2,3,4,5], function(num) {
        return num % 2 == 0;
    });

    it('a test', function() {
			var result = res;
			expect(result).to.deep.equal([2,4]);
		});

});
