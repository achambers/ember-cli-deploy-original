'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy-assets');
var MockProject = require('../../helpers/mock-project');
var Promise     = require('ember-cli/lib/ext/promise');

describe('deploy:assets command', function() {
  var commandOptions;

  beforeEach(function() {
    commandOptions = {
      environment: 'development'
    };

    command.project = new MockProject({
      cwd: process.cwd() + '/tests/fixtures'
    });
  });

  describe('#run', function() {
    it('doesn\'t proceed if config doesn\'t exist', function() {
      commandOptions.environment = 'unknown-env';

      command._tasks.DeployAssetsTask = function() {
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
          assert.include(error.message, 'command requires assets config to be set');
        });
    });

    it('proceeds if config is valid', function() {
      command._tasks.DeployAssetsTask = function() {
        return {
          run: function(config) {
            return Promise.resolve(config);
          }
        };
      };

      return command.run(commandOptions)
        .then(function(config) {
          assert.equal(config.distDir, 'tests/fixtures/dist', 'distDir should be set in config');
          assert.equal(config.assets.accessKeyId, 'asdf', 'S3 key should be set in config');
          assert.equal(config.assets.secretAccessKey, '1234', 'S3 secret should be set in config');
          assert.equal(config.assets.bucket, 'my-bucket', 'S3 bucket should be set in config');
          assert.equal(config.assets.region, 'us-west-1', 'S3 region should be set in config');
          assert.equal(config.assets.filePattern, '**/*.{js,css}', 'File pattern should be set in config');
        });
    });
  });
});
