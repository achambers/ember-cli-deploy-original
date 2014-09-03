'use strict';

var fs = require('fs');

module.exports = function(options) {
  options = options || {};

  var defaultOptions = { cwd: process.cwd };

  for (var prop in defaultOptions) {
    if (!options.hasOwnProperty(prop)) {
      options[prop] = defaultOptions[prop];
    }
  }

  if (!options.pattern) {
    return [];
  }

  var glob  = require('glob').sync;
  var files = glob(options.pattern, {
    cwd: options.cwd
  }).reduce(function(previous, current) {
    var filePath = options.cwd + '/' + current;

    if (fs.existsSync(filePath)) {
      previous.push(current);
    }

    return previous;
  }, []);

  return files;
};
