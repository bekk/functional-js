---
layout: workshop
collection: workshop
title: Applicative functions with context
section: 2
prev: 02-6-point-free
name: 02-7-context
next: 03-functions
slides:
info: |
  Sometimes you want to use map, filter, reduce or other functions
  inside an object and you want want to access something on
  `this`. Thankfully this is very simple on _.filter and friends --
  just add the context, i.e. what you want `this` to be, as the
  last parameter.
---
describe('filter with context', function() {
    var ages = [20, 30, 75, 156, 200];

    var people = {
      maxAge: 120,
      validAges: function(ages) {

        return _.filter(ages, function(age) {
          return age < this.maxAge;
        }, this);

        // here we specified that we want `this` inside the function in the
        // filter be the same as `this` is inside the current function
      }
    };

    it('works by passing a context to the lodash-function which it can bind to', function() {
      var result = people.validAges(ages);

      expect(result).to.deep.equal([20, 30, 75]);
    });
});

describe('our filter with context', function() {
  // PROBLEM: Fix our filter implementation below so it handles the
  // specified context

  var filter = function(items, fn, context) {
    var arr = [];
    for (var i = 0; i < items.length; i++) {
      if (fn(items[i], i)) {
        arr.push(items[i]);
      }
    }
    return arr;
  }

  var ages = [20, 30, 75, 156, 200];

  var people = {
    maxAge: 120,
    validAges: function(ages) {
      return filter(ages, function(age) {
        //return age < this.maxAge;
      }, this);
    }
  };

  it('works when we pass a context that we bind the function to', function() {
    var result = people.validAges(ages);
    expect(result).to.deep.equal([20, 30, 75]);
  });

});
