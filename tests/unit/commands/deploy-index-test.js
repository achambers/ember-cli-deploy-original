'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy-index');
var MockProject = require('../../helpers/mock-project');
var MockTask = require('../../helpers/mock-task');
var Promise     = require('../../../lib/ext/promise');

describe('deploy:index command', function() {
  var commandOptions;

  beforeEach(function() {
    commandOptions = {
      distDir: 'someDir',
      redisHost: 'localhost',
      redisPort: '1234',
      redisPassword: 'password'
    };

    command.project = new MockProject();

    command._utils.GitUtils.hash = function() {
      return 'abcde12345';
    }

    command._tasks.DeployIndexTask = MockTask;
  });

  describe('#run', function() {
    it('doesn\'t proceed if redis host is not specified', function() {
      delete commandOptions.redisHost;

      return command.run(commandOptions).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis host');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:index` command requires a redis-host to be specified');
      });
    });

    it('doesn\'t proceed if redis host is blank', function() {
      commandOptions.redisHost = '';

      return command.run(commandOptions).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis host');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:index` command requires a redis-host to be specified');
      });
    });

    it('doesn\'t proceed if redis port is not specified', function() {
      delete commandOptions.redisPort;

      return command.run(commandOptions).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis port');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:index` command requires a redis-port to be specified');
      });
    });

    it('doesn\'t proceed if redis port is blank', function() {
      commandOptions.redisPort = '';

      return command.run(commandOptions).then(function() {
        assert.ok(false, 'should have rejected for not supplying redis port');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:index` command requires a redis-port to be specified');
      });
    });

    it ('proceeds if all options are set', function() {
      return command.run(commandOptions).then(function(options) {
        assert.equal(options.distDir, 'someDir', 'distDir should be set in options');
        assert.equal(options.redis.host, 'localhost', 'Redis host should be set in options');
        assert.equal(options.redis.port, '1234', 'Redis port should be set in options');
        assert.equal(options.redis.password, 'password', 'Redis password should be set in options');
        assert.ok(/[0-9a-f]{10}/.test(options.hash), 'Hash should be set in options');
      });
    });
  });
});
