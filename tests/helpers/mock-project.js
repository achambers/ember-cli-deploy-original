'use strict';

var MockProject = function(options) {
  options = options || {};
  this.root = options.cwd || process.cwd();
};

module.exports= MockProject;
