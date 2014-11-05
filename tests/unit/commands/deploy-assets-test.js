'use strict';

var assert      = require('../../helpers/assert');
var command     = require('../../../lib/commands/deploy-assets');
var MockProject = require('../../helpers/mock-project');
var Promise     = require('../../../lib/ext/promise');

describe('deploy:assets command', function() {
  var commandOptions;

  beforeEach(function() {
    commandOptions = {
      distDir: 'tmp/dist',
      s3AccessKeyId: 'key',
      s3SecretAccessKey: 'secret',
      s3BucketName: 'bucket',
      s3Region: 'eu-west-1',
      filePattern: '**/*.*'
    };

    command.project = new MockProject();
  });

  it('doesn\'t proceed if s3-access-key-id is not specified', function() {
    delete commandOptions.s3AccessKeyId;

    return command.run(commandOptions)
      .then(function() {
        assert.ok(false, 'should have rejected for not supplying s3-access-key-id');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:assets` command requires an s3-access-key-id to be specified.');
      });
  });

  it('doesn\'t proceed if s3-secret-access-key is not specified', function() {
    delete commandOptions.s3SecretAccessKey;

    return command.run(commandOptions)
      .then(function() {
        assert.ok(false, 'should have rejected for not supplying s3-secret-access-key');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:assets` command requires an s3-secret-access-key to be specified.');
      });
  });

  it('doesn\'t proceed if s3-bucket-name is not specified', function() {
    delete commandOptions.s3BucketName;

    return command.run(commandOptions)
      .then(function() {
        assert.ok(false, 'should have rejected for not supplying s3-bucket-name');
      })
      .catch(function(error) {
        assert.include(error.message, 'The `ember deploy:assets` command requires an s3-bucket-name to be specified.');
      });
  });

  it('proceeds if all options are set', function() {
    command._tasks.DeployAssetsTask = function() {
      return {
        run: function(options) {
          return Promise.resolve(options);
        }
      };
    };

    return command.run(commandOptions).then(function(options) {
      assert.equal(options.distDir, 'tmp/dist', 'dist dir should be set in options');
      assert.equal(options.s3.key, 'key', 'S3 key should be set in options');
      assert.equal(options.s3.secret, 'secret', 'S3 secret should be set in options');
      assert.equal(options.s3.bucket, 'bucket', 'S3 bucket should be set in options');
      assert.equal(options.s3.region, 'eu-west-1', 'S3 region should be set in options');
      assert.equal(options.filePattern, '**/*.*', 'File pattern should be set in options');
    });
  });
});
