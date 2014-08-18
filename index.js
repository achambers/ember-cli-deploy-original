'use strict';

var commands  = require('./lib/commands');

function EmberCLIDeploy(project) {
  this.project = project;
  this.name = 'Ember CLI Deploy';
}

EmberCLIDeploy.prototype.includedCommands = function() {
  return commands;
}

module.exports = EmberCLIDeploy;
