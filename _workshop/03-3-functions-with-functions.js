---
layout: workshop
collection: workshop
title: Functions with functions
section: 3
prev: 03-2-higher-order
name: 03-3-functions-with-functions
next: 03-4-fluent
slides:
info: |

---
describe('add functions to functions', function() {
    // In JavaScript you can actually add functions onto existing
    // functions. This can create sweet APIs. Let's look at an example.

    // I've seen this pattern in many code bases:
    //
    //     if (debug) console.log('some text');
    //
    // When you want to show debug information you set debug to `true`. You of
    // course need to always remember to write that `if` everywhere in your
    // code. Let's create a create a better API.

    // PROBLEM: We want to guard a function, so that it only calls
    // through to the function we pass in once we have called `start`
    // on the guard. (See below for the tests to understand how this is
    // supposed to work.)

    function guard(fn) {
        var guard = function() {
        };

        // in JavaScript you can actually add
        // functions to existing functions
        guard.start = function() {
        };

        return guard;
    };

    // Let's now guard a debug helper. To make it a little bit simpler
    // to test, we return a message instead of calling console.log or similar.
    var debug = guard(function(msg) {
        return msg;
    });

    it('a test', function() {
			var result = debug('test 1');
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = debug('test 2');
			expect(result).to.equal(undefined);
		});

    debug.start();

    it('a test', function() {
			var result = debug('test 3');
			expect(result).to.equal('test 3');
		});

});
