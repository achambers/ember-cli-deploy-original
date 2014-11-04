'use strict';

var MockProject = function() {
  this.root = process.cwd() + '/tests/fixtures/fakeproject';
};

module.exports = MockProject;
