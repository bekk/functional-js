---
layout: workshop
collection: workshop
title: Introduction to the workshop
permalink: /workshop/
section: 0
start: true
name: 00-introduction
next: 01-1-context
slides:
info: |
  Welcome to a workshop for learning functional programming in JavaScript.

  This workshop runs in your browser. Assignments are written as tests that
  you need to make pass. When you have all passing test you can move on to the
  next task. There will be additional information in the comments.

  If you at any time need to freshen up your JS-fu, start any Google
  search with "mdn" and you will always end up at the amazing Mozilla
  Developer Network, which has the best JS explanations around.
---

// You can create functions like this:
function hello(arg) {
  return 'result of function called with ' + arg;
}

// You can call the function and save the result:
var result = hello('some argument');

// A handy way of printing has been added to the environment
log(result);
// And will display in the sidebar to the right of the editor

// Assignments will be written as tests that you need to make pass
// You will either need to modify the tests themselves or the code that the
// tests execute.
describe('mocha inside the workshop', function () {

  it('shows tests', function () {

    expect(2).to.equal(2);

  });

  it('shows failing tests', function () {

    expect(hello('some argument')).to.equal(
      'Hello, some argument',
      'hello should greet argument'
    );

  });

});
