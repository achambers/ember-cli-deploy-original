'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy');
var MockCommand = require('../../helpers/mock-command');
var MockProject = require('../../helpers/mock-project');

describe('deploy command', function() {
  var commandOptions = {
    environment: 'development'
  };

  var commands = command._commands = {
    DeployAssets: new MockCommand(),
    DeployIndex:  new MockCommand('aaa'),
    Activate:     new MockCommand(),
  };

  beforeEach(function() {
    command.project = new MockProject({
      cwd: process.cwd() + '/tests/fixtures'
    });
  });

  it('runs the deploy-assets, deploy-index and activate commands', function() {
    return command.run(commandOptions)
      .then(function() {
        assert.ok(commands.DeployAssets.done, 'deploy-assets command was not run');
        assert.ok(commands.DeployIndex.done, 'deploy-index command was not run');
        assert.ok(commands.Activate.done, 'activate command was not run');
      });
  });

  it('passes an index key to the activate command', function() {
    return command.run(commandOptions)
      .then(function() {
        assert.equal(commands.Activate.rawArgs[0], 'aaa');
      });
  });
});
