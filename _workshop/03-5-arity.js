---
layout: workshop
collection: workshop
title: Function factories
section: 3
prev: 03-4-fluent
name: 03-5-arity
next: 04-partially
slides:
info: |

---
describe('understanding arity', function() {
    // Going from string to int we can use parseInt, e.g.

    it('a test', function() {
			var result = parseInt('123');
			expect(result).to.equal(123);
		});

    // However, trying to use this function together with map,
    // we see a problem:

    var parsed = ['1','2','3'].map(parseInt)
    //=> [1, NaN, NaN]

    it('a test', function() {
			var result = parsed[0];
			expect(result).to.equal(1);
		});
    it('a test', function() {
			var result = isNaN(parsed[1]);
			expect(result).to.ok;
		});
    it('a test', function() {
			var result = isNaN(parsed[2]);
			expect(result).to.ok;
		});
    // (we can't use deepEqual since NaN !== NaN in JavaScript)

    // The problem is that map calls each function with three parameters -- the
    // value, the index, and the array. Instead of the above, we could write:

    var parsed2 = ['1','2','3'].map(function(value, index, arr) {
        return parseInt(value);
    })

    it('a test', function() {
			var result =         parsed2;
			expect(result).to.deep.equal([1,2,3]);
		});

    // However, there are a couple of other solutions. We can for example
    // create a helper to do the job for us, and that lets us write:

    var parsed3 = ['1', '2', '3'].map(unary(parseInt))

    function unary(fn) {
        return function(arg) {
            return fn.call(this, arg)
        }
    }

    // Here we have created unary, which ensures that a function is only ever
    // called with one argument, no matter how many you actually send to it.

    it('a test', function() {
			var result =         parsed3;
			expect(result).to.deep.equal([1,2,3]);
		});

    // However, unary might be to simple in this case, as we actually
    // might want to call:
    //
    //     parseInt(val, 10);
    //
    // To get there, however, we should first learn some things about
    // partial application.

});
