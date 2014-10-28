'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/activate');
var MockProject = require('../../helpers/mock-project');
var MockTask = require('../../helpers/mock-task');
var Promise     = require('../../../lib/ext/promise');

describe('activate command', function() {
  var commandOptions;
  var rawArgs;

  beforeEach(function() {
    commandOptions = {
      redisHost: 'localhost',
      redisPort: '1234',
      redisPassword: 'password'
    };

    rawArgs = ['12345'];

    command.project = new MockProject();

    command._tasks.ActivateTask = MockTask;
  });

  describe('#run', function() {
    it('doesn\'t proceed if deploy key is not specified', function() {
      rawArgs = [];

      return command.run(commandOptions, rawArgs).then(function() {
        assert.ok(false, 'should have rejected for not supplying deploy key');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember activate` command requires a deploy key to be specified');
      });
    });

    it('doesn\'t proceed if redis host is not specified', function() {
      delete commandOptions.redisHost;

      return command.run(commandOptions, rawArgs).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis host');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember activate` command requires a redis-host to be specified');
      });
    });

    it('doesn\'t proceed if redis host is blank', function() {
      commandOptions.redisHost = '';

      return command.run(commandOptions, rawArgs).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis host');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember activate` command requires a redis-host to be specified');
      });
    });

    it('doesn\'t proceed if redis port is not specified', function() {
      delete commandOptions.redisPort;

      return command.run(commandOptions, rawArgs).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis port');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember activate` command requires a redis-port to be specified');
      });
    });

    it('doesn\'t proceed if redis port is blank', function() {
      commandOptions.redisPort = '';

      return command.run(commandOptions, rawArgs).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis port');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember activate` command requires a redis-port to be specified');
      });
    });

    it ('proceeds if all options are set', function() {
      return command.run(commandOptions, rawArgs).then(function(options) {
        assert.equal(options.key, '12345', 'Deploy key should be set in options');
        assert.equal(options.redis.host, 'localhost', 'Redis host should be set in options');
        assert.equal(options.redis.port, '1234', 'Redis port should be set in options');
        assert.equal(options.redis.password, 'password', 'Redis password should be set in options');
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
