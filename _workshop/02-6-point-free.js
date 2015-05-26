---
layout: workshop
collection: workshop
title: Point-free style
section: 2
prev: 02-5-lodash
name: 02-6-point-free
next: 02-7-context
slides:
info: |
  Every time we see the arguments "match up" and are passed
  through to the function in the callback, as with the `x`
  below, we do not need to create the callback function at all.
  That means that this:

  ```
     _.filter(collection, function(x) {
       return exists(x);
     });
  ```

  is the same as:

  ```
     _.filter(collection, exists);
  ```
  
  This is called point-free style, we will see quite a bit of this today!
  (There are some things to think about. We will look at those later.)
---
describe('point-free style', function() {
    function exists(x) {
      return x != null;
    }

    function truthy(x) {
      return exists(x) && x !== false;
    }

    it('lets us pass functions as references if they have matching arguments', function() {
      var result = values.filter(exists);
      expect(result).to.deep.equal(['user', false, 0, 'test', 1]);
    });

    it('works with many different functions', function() {
      var result = values.filter(truthy);
      expect(result).to.deep.equal(['user', 0, 'test', 1]);
    });

});

// PROBLEM: Sum the array using `_.reduce`, following a point-free style.
describe('point-free _.reduce', function() {
  function add(acc, el) {
    return acc + el;
  }

  it('works as normal _.reduce', function() {
    var nums = [1,2,3,4,5];

    var sum = null;

    expect(sum).to.equal(15);
  });
});