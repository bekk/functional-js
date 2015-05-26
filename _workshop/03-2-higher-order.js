---
layout: workshop
collection: workshop
title: Higher order functions
section: 3
prev: 03-1-factories
name: 03-2-higher-order
next: 03-3-functions-with-functions
slides:
info: |
  Sometimes we want to take a function as an argument. Functions that take
  other functions as arguments are called higher order functions.
---
// PROBLEM: Create a once factory that receives a function that
// will at most be called once. If already run, return the result
// of the first invocation on every succeeding invocation.

function once(fn) {
}

describe('once', function() {
    var win = once(function(name) {
        return name + ' is winning';
    });

    it('should declare a winner the first time', function() {
			var result = win('kim');
			expect(result).to.equal('kim is winning');
		});

    it('should not change winner if invoked multiple times', function() {
      var result = win('stian');
			expect(result).to.equal('kim is winning');
		});

    // And we have now decorated a function, i.e. wrapped an existing functions
    // with new functionality.
});
