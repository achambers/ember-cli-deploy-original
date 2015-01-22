'use strict';

var Promise = require('ember-cli/lib/ext/promise');

function MockCommand(returnValue) {
  this.done = false;
  this.returnValue = returnValue;
}

MockCommand.prototype.run = function(commandOptions, rawArgs) {
  this.commandOptions = commandOptions;
  this.rawArgs = rawArgs;
  this.done = true;
  return Promise.resolve(this.returnValue);
};

module.exports = MockCommand;
