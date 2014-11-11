'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy-index');
var MockProject = require('../../helpers/mock-project');
var MockTask = require('../../helpers/mock-task');
var Promise     = require('ember-cli/lib/ext/promise');

describe('deploy:index command', function() {
  var commandOptions;

  beforeEach(function() {
    commandOptions = {
      environment: 'development'
    };

    command.project = new MockProject({
      cwd: process.cwd() + '/tests/fixtures'
    });

    command._utils.GitUtils.hash = function() {
      return 'abcde12345';
    }

    command._tasks.DeployIndexTask = MockTask;
  });

  describe('#run', function() {
    it('doesn\'t proceed if config doesn\'t exist', function() {
      commandOptions.environment = 'unknown-env';

      command._tasks.DeployIndexTask = function() {
        return {
          run: function(config) {
            return Promise.resolve(config);
          }
        };
      };

      return command.run(commandOptions)
        .then(function(config) {
          assert.ok(false, 'Should have failed due to invalid config');
        }, function(error) {
          assert.include(error.message, 'command requires index config to be set');
        });
    });

    it ('proceeds if all options are set', function() {
      return command.run(commandOptions)
        .then(function(config) {
          assert.equal(config.distDir, 'tests/fixtures/dist', 'distDir should be set in options');
          assert.equal(config.index.host, 'localhost', 'Redis host should be set in options');
          assert.equal(config.index.port, '1234', 'Redis port should be set in options');
          assert.equal(config.index.password, 'password', 'Redis password should be set in options');
          assert.ok(/[0-9a-f]{10}/.test(config.hash), 'Hash should be set in options');
        }, function() {
          assert.ok(false, 'Should have proceeded successfully');
        });
    });
  });
});
