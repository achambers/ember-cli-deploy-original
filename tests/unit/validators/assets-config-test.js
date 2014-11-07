'use strict';

var assert      = require('../../helpers/assert');
var MockProject = require('../../helpers/mock-project');
var Validator   = require('../../../lib/validators/assets-config');

describe('assets-config-validator', function() {
  var subject;
  var config;

  beforeEach(function() {
    config = {
      distDir: 'tests/fixtures/dist',
      assets: {
        accessKeyId: 'asdf',
        secretAccessKey: '1234',
        bucket: 'my-bucket',
        region: 'us-west-1',
        filePattern: '**/*.{js,css}'
      }
    };

    var mockProject = new MockProject({
      cwd: 'some-dir'
    });

    subject = new Validator({
      project: mockProject
    });
  });

  describe('#validate', function() {
    it('doesn\'nt proceed when assets is missing', function() {
      delete config.assets;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to assets missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember deploy:assets` command requires assets config to be set.');
        });
    });

    it('doesn\'t proceed when assets.accessKeyId is missing', function() {
      delete config.assets.accessKeyId;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to assets.accessKeyId missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember deploy:assets` command requires assets.accessKeyId config to be set.');
        });
    });

    it('doesn\'t proceed when assets.secretAccessKey is missing', function() {
      delete config.assets.secretAccessKey;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to assets.secretAccessKey missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember deploy:assets` command requires assets.secretAccessKey config to be set.');
        });
    });

    it('doesn\'t proceed when assets.bucket is missing', function() {
      delete config.assets.bucket;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to assets.bucket missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember deploy:assets` command requires assets.bucket config to be set.');
        });
    });

    it('uses the default assets.region if is it missing', function() {
      delete config.assets.region;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.assets.region, 'us-east-1', 'Should have used default region');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default region being used');
        });
    });

    it('uses the default assets.filePattern if is it missing', function() {
      delete config.assets.filePattern;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.assets.filePattern, '**/*.{js,css,png,gif,jpg}', 'Should have used default filePattern');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default filePattern being used');
        });
    });

    it('uses the default distDir if is it missing', function() {
      delete config.distDir;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.distDir, 'dist', 'Should have used default distDir');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default distDir being used');
        });
    });

    it('proceeds if all config is valid', function() {
      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.distDir, 'tests/fixtures/dist', 'Should have used specified distDir');
          assert.equal(config.assets.accessKeyId, 'asdf', 'Should have used specified assets.accessKeyId');
          assert.equal(config.assets.secretAccessKey, '1234', 'Should have used specified assets.secretAccessKey');
          assert.equal(config.assets.bucket, 'my-bucket', 'Should have used specified assets.bucket');
          assert.equal(config.assets.region, 'us-west-1', 'Should have used specified assets.region');
          assert.equal(config.assets.filePattern, '**/*.{js,css}', 'Should have used specified assets.filePattern');
        }, function() {
          assert.ok(false, 'Should have succeeded due to config being valid');
        });
    });
  });
});
