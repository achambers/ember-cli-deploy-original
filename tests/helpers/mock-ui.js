'use strict';

var MockUI = function() {
  this.output = [];
};

MockUI.prototype.write = function(message) {
  this.output.push(message);
};

module.exports = MockUI;
