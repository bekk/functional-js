---
layout: workshop
collection: workshop
title: Introduction to the workshop
permalink: /workshop/
section: 0
start: true
name: 00-introduction
next: 01-intro
slides: http://omniscientjs.github.io/workshop-slides/#9
---

// Creating functions
function a_function(argument) {
  return 'result of function called with ' + argument;
}

// Call the function and save the result
var result = a_function('some argument');

// Print the result
log(result);

describe('mocha inside the workshop', function () {
  it('shows tests', function () {
    expect(2).to.equal(2);
  });
  it('shows failing tests', function () {
    expect(2).to.equal(1, 'numbers should be equal');
  });
});
