'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy-index');
var MockProject = require('../../helpers/mock-project');
var Promise     = require('../../../lib/ext/promise');

describe('deploy:index command', function() {
  var commandOptions;

  beforeEach(function() {
    commandOptions = {
      redisHost: 'localhost',
      redisPort: '1234',
      redisPassword: 'password'
    };

    command.project = new MockProject();

    command._utils.GitUtils = function() {
      return {
        hash: function() {
          return 'abcde12345';
        }
      };
    };
  });

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

  it('sets the dist dir if specified', function() {
    commandOptions.distDir = 'blah/';
    command._tasks.DeployIndexTask = function() {
      return {
        run: function(options) {
          return Promise.resolve(options);
        }
      };
    };

    return command.run(commandOptions).then(function(options) {
      assert.equal(options.distDir, 'blah/', 'Should use dist/ as the default dist dir');
    });
  });

  it ('proceeds if all options are set', function() {
    command._tasks.DeployIndexTask = function() {
      return {
        run: function(options) {
          return Promise.resolve(options);
        }
      }
    };

    return command.run(commandOptions).then(function(options) {
      assert.equal(options.redis.host, 'localhost', 'Redis host should be set in options');
      assert.equal(options.redis.port, '1234', 'Redis port should be set in options');
      assert.equal(options.redis.password, 'password', 'Redis password should be set in options');
      assert.ok(/[0-9a-f]{10}/.test(options.hash), 'Hash should be set in options');
    });
  });

  it('proceeds if options are set in env vars', function() {
    delete commandOptions.redisHost;
    delete commandOptions.redisPort;
    delete commandOptions.redisPassword;

    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '9999';
    process.env.REDIS_PASSWORD = 'password';

    command._tasks.DeployIndexTask = function() {
      return {
        run: function(options) {
          return Promise.resolve(options);
        }
      }
    };

    return command.run(commandOptions).then(function(options) {
      assert.equal(options.redis.host, '127.0.0.1', 'Redis host should be set in options');
      assert.equal(options.redis.port, '9999', 'Redis port should be set in options');
      assert.equal(options.redis.password, 'password', 'Redis password should be set in options');
      assert.equal(options.hash, 'abcde12345', 'Hash should be set in options');
    });
  });
});
