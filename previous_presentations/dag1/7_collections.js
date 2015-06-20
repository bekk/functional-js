"use strict";
var test = require('tape');
var _ = require('lodash');

// For the next couple of tests we need some more data. Let's require
// in some books:
var books = require('./books.json');

// Now we will start taking a look at some of the very nice functions
// included in libraries such as Lo-Dash and Underscore.

// Generally, these are collection-centric helpers, i.e. helpers for
// tasks requiring that some operation happen on many items in a
// collection.

test('pluck', function(t) {
    // How many unique authors are there?
    var authors = _.uniq(_.map(books, function(book) {
        return book.author;
    }));

    t.equal(authors.length, 25);

    // Often we will see this patterns with map -- only getting the
    // value of a key for each item. Generally, there are many nice
    // helpers that can sweeten up our code. One example of this is
    // pluck:
    var authors2 = _.uniq(_.pluck(books, 'author'));

    t.equal(authors2.length, 25);

    // PROBLEM: Okey, that was all authors. Now, how many unique authors have
    // received a 5 star rating on atleast one book?

    var fiveStarAuthors = null;

    t.equal(fiveStarAuthors.length, 7);

    t.end();
});

test('chain', function(t) {
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

    t.deepEqual(
        fiveStarAuthors,
        fiveStarAuthors2
    );

    t.deepEqual(
        fiveStarAuthors2,
        fiveStarAuthors3(books)
    );

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

    t.deepEqual(
        fiveStarAuthors,
        fiveStarAuthors4
    );

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

    t.deepEqual(
        fiveStarAuthors,
        fiveStarAuthors4
    );

    // PROBLEM: Use chaining to find the total number of pages on 4
    // star books

    var pages = _.chain(books)
        .value();

    t.equal(pages, 4259);

    t.end();
});

test('grouping, sorting and counting', function(t) {
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

    t.deepEqual(
        authors,
        [
            'Martin, George R.R.',
            'Gaiman, Neil',
            'Taleb, Nassim Nicholas'
        ]
    );

    // In the end we should not need to handle state at all to solve this
    // problem. This code, written imperatively, would have been very different.

    t.end();
});

// And that's just about it. We'll now finish up at an interesting point --
// functions that call themselves. Recursive functions have generally not been
// much used in JavaScript. An important factor of why is the historic lack of
// tail-call optimization, meaning that the call-stack would grow unboundedly,
// in the end growing too large and killing everything. With EcmaScript 6 comes
// proper tail-calls to JavaScript, finally enabling us to use recursion more.

test('recursion', function(t) {
    // Let's look at a couple of recursive functions.

    function len(arr) {
        if (arr.length == 0) {
            return 0;
        } else {
            return 1 + len(_.rest(arr));
        }
    }

    t.equal(len([]), 0);
    t.equal(len([1000]), 1);
    t.equal(len([1,2,3]), 3);

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

    t.deepEqual(res, [1,4,9,16,25]);

    // PROBLEM: Implement filter using recursion.

    function filter(list, pred) {
    }

    var res = filter([1,2,3,4,5], function(num) {
        return num % 2 == 0;
    });

    t.deepEqual(res, [2,4]);

    t.end();
});

// THE END!

// We have now been on a ride through some of the interesting parts of
// functional programming. You have seen some code that doesn't look much like
// the JavaScript we normally write. We have also seen that the same code has
// interesting properties, such as less focus on state and mutability.
// Hopefully you have learned something along the way.

// To wrap up what we have seen today -- basically, functional programming
// achieve reuse at a coarser-grained level than object-oriented programming,
// extracting common machinery with parameterized behavior. Most applications
// do things with lists of elements, so a functional approach is to build reuse
// mechanisms around the idea of lists plus contextualized, portable code.

// Btw, want to learn more?
//
// https://leanpub.com/javascript-allonge/read
// and
// http://shop.oreilly.com/product/0636920028857.do

