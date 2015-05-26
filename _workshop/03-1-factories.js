---
layout: workshop
collection: workshop
title: Function factories
section: 3
prev: 02-7-context
name: 03-1-factories
next: 03-2-higher-order
slides:
info: |

---

// Okey, it's time to take a break from map, filter and reduce, and
// start focusing more on higher-order functions and what we can do
// with JavaScript.

describe('function factories!', function() {
    // In JavaScript we love factories. Let's create a factory that
    // creates adder functions:

    function makeAdder(arg) {
        return function(arg2) {
            return arg + arg2;
        }
    }

    var addTwo = makeAdder(2)

    it('a test', function() {
			var result =         addTwo(40);
			expect(result).to.equal(42);
		});;

    it('a test', function() {
			var result =         addTwo(3);
			expect(result).to.equal(5);
		});;

    // Seems simple enough, but it's a powerful technique that we will
    // be having a lot of fun with.

    // Okey, it's your turn to create a factory.

    // PROBLEM: Create a counter that returns a function that increases a
    // number every time it's called.

    function counter() {
    }

    var c1 = counter();

    it('a test', function() {
			var result = c1();
			expect(result).to.equal(0);
		});
    it('a test', function() {
			var result = c1();
			expect(result).to.equal(1);
		});
    it('a test', function() {
			var result = c1();
			expect(result).to.equal(2);
		});

    var c2 = counter();

    it('a test', function() {
			var result = c2();
			expect(result).to.equal(0);
		});

});
