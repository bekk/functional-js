---
layout: workshop
collection: workshop
title: Function factories
section: 3
prev: 03-3-functions-with-functions
name: 03-4-fluent
next: 03-5-arity
slides:
info: |

---
describe('make it fluent', function() {
    // Many of us are used to jQuery and its fluent apis, e.g.
    //
    //     $('#test')
    //         .css('color','#333')
    //         .height(200)
    //         .on('click', function() {
    //             console.log('clicked!')
    //         });
    //
    // Let's create a small helper that simplifies the development of
    // such fluent apis

    // First, to get an understanding of how we can create a simple
    // helper for these fluent interfaces, we start with an entirely
    // different example, `maybe`:

    function maybe(fn) {
        return function(arg) {
            if (arg != null) {
                return fn(arg);
            }
        }
    }

    var exclamate = maybe(function(val) {
        return val + "!";
    });

    it('a test', function() {
			var result = exclamate("test");
			expect(result).to.equal("test!");
		});
    it('a test', function() {
			var result = exclamate(null);
			expect(result).to.equal(undefined);
		});
    it('a test', function() {
			var result = exclamate();
			expect(result).to.equal(undefined);
		});

    // We have now created a helper than only calls the received function is
    // the input is neither null nor undefined. Yet another decorator, that is.

    // Btw, why doesn't this work?

    var user = {
        setName: maybe(function(name) {
            this.name = name;
        })
    };

    it('to throw', function() {
      expect(user.setName('kim')).to.throw(TypeError);
    });

    // It throws this error at us:
    //
    //     TypeError: Cannot set property 'name' of undefined

    // As is often the case in JavaScript, the problem is `this`. We
    // forgot to handle the context when we called `fn` in our `maybe`
    // decorator. In decorators we must always use `call` or `apply` --
    // make them context agnostic!

    // PROBLEM: Now it's time to create a `fluent` decorator

    function fluent(fn) {
    }

    // Here we have our example `$`, containing a field `value` that we
    // want to read out last. (You shouldn't change anything below here.)

    var $ = function(el) {
        return {
            value: 'somevalue',

            // using our fluent helper
            css: fluent(function(key, val) {}),
            height: fluent(function(height) {}),
            on: fluent(function(event, cb) {})
        }
    };

    // var val = $('#test')
    //     .css('color','#333')
    //     .height(200)
    //     .on('click', function() {
    //         console.log('clicked!')
    //     })
    //     .value;

    it('a test', function() {
			var result = val;
			expect(result).to.equal('somevalue');
		});

});
