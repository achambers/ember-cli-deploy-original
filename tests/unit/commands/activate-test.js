'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/activate');
var MockProject = require('../../helpers/mock-project');
var MockTask = require('../../helpers/mock-task');

describe('activate command', function() {
  var commandOptions;
  var rawArgs;

  beforeEach(function() {
    commandOptions = {
      environment: 'development'
    };

    rawArgs = ['12345'];

    command.project = new MockProject({
      cwd: process.cwd() + '/tests/fixtures'
    });

    command._tasks.ActivateTask = MockTask;
  });

  describe('#run', function() {
    it ('proceeds if all options are set', function() {
      return command.run(commandOptions, rawArgs).then(function(config) {
        assert.equal(config.key, '12345', 'Deploy key should be set in options');
        assert.equal(config.index.host, 'localhost', 'Redis host should be set in options');
        assert.equal(config.index.port, '1234', 'Redis port should be set in options');
        assert.equal(config.index.password, 'password', 'Redis password should be set in options');
      });
    });

    it ('uses the first deploy key if multiple are specified', function() {
      rawArgs = ['abcdef', '223344'];

      return command.run(commandOptions, rawArgs).then(function(options) {
        assert.equal(options.key, 'abcdef', 'Deploy key should be set in options');
      });
    });
  });
});
