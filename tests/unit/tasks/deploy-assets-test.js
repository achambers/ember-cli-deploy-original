'use strict';

var proxyquire     = require('proxyquire');
var assert         = require('../../helpers/assert');
var MockProject    = require('../../helpers/mock-project');
var MockUI         = require('../../helpers/mock-ui');
var MockS3Uploader = require('../../helpers/mock-s3-uploader');

var Command        = proxyquire('../../../lib/tasks/deploy-assets', { '../utilities/s3-uploader': MockS3Uploader });

describe('deploy-assets task', function() {
  var subject;
  var taskOptions;
  var mockUI;

  beforeEach(function() {
    mockUI = new MockUI();

    subject = new Command({
      project: new MockProject(),
      ui: mockUI
    });

    taskOptions = {
      distDir: 'tests/fixtures/dist',
      s3: {
        key: 'access-key',
        secret: 'access-secret',
        region: 'region',
        bucket: 'bucket'
      }
    }
  });

  it('doesn\'t proceed if distDir does not exist', function() {
    taskOptions.distDir = 'dist';

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due to no dist dir found');
    }, function(error) {
      assert.include(error.message, 'Unable to find dist directory [dist/]');
    });
  });

  it('doesn\'t proceed if there are not assets in dist dir', function() {
    taskOptions.distDir = 'tests/fixtures/dist-no-index';

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due to no dist dir found');
    }, function(error) {
      assert.include(error.message, 'There are no assets to deploy');
    });
  });

  it('uploads each file in dist dir', function() {
    return subject.run(taskOptions).then(function() {
      var params = MockS3Uploader.params;

      assert.equal(params.accessKeyId, 'access-key');
      assert.equal(params.secretAccessKey, 'access-secret');
      assert.equal(params.region, 'region');
      assert.equal(params.bucket, 'bucket');

      var paths = MockS3Uploader.paths;

      assert.include(paths, 'assets/app.css');
      assert.include(paths, 'assets/app.js');
    }, function(error) {
      assert.ok(false, 'Should have resolved due to successful upload of assets');
    });
  });
});
