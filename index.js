'use strict';

var commands  = require('./lib/commands');

function EmberCLIDeploy(project) {
  this.project = project;
  this.name = 'ember-cli-deploy';
}

EmberCLIDeploy.prototype.includedCommands = function() {
  return commands;
}

module.exports = EmberCLIDeploy;
