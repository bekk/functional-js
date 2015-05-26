---
layout: workshop
collection: workshop
title: A functions arguments
section: 1
prev: 01-1-context
name: 01-2-arguments
next: 01-3-prototype
slides:
info: |
  Arguments are what makes functions interesting. Being able to pass data and
  information to a function in order to change its result is important.
---
function helloTo(thing) {
  return this + ' says hello ' + thing;
}

function argCount() {
    return arguments.length;
}
describe('a functions arguments', function() {
  // Inside a function you will always have access to `arguments`,
  // which is an array-like object that contains all the arguments
  // passed to the function.

  it('can be counted', function() {
    var result = argCount(1, 2, 3);
    expect(result).to.equal(3);
  });

  // JavaScript is not strict about the number of
  // arguments, so you can for example include more parameters than
  // the function expects:

  it('are not strict in number', function() {
    var result = helloTo.call('kim', 'world', 'or', 'maybe', 'bekk');
    expect(result).to.equal('kim says hello world');
  });

  // But JavaScript is strict with the count of arguments regardless of
  // wether the argument was used or not.

  it('has a strict count', function() {
    var result = argCount(null, 2, 3);
    expect(result).to.equal(2);
  });

});

function multiplyFirst() {
  // PROBLEM:
  // Multiply `this` and the first argument,
  // without specifying any parameters
}

describe('multiplyFirst', function() {

  it('1*1=1', function() {
    var result = multiplyFirst(1,1);
    expect(result).to.equal(1);
  });

  it('2*5=10', function() {
    var result = multiplyFirst(2,5);
    expect(result).to.equal(10);
  });
});
