'use strict';

var proxyquire     = require('proxyquire');
var assert         = require('../../helpers/assert');
var MockProject    = require('../../helpers/mock-project');
var MockUI         = require('../../helpers/mock-ui');
var MockS3Uploader = require('../../helpers/mock-s3-uploader');

var Task           = proxyquire('../../../lib/tasks/deploy-assets', { '../utilities/s3-uploader': MockS3Uploader });

describe('deploy-assets task', function() {
  var subject;
  var taskOptions;
  var mockUI;

  beforeEach(function() {
    mockUI = new MockUI();

    subject = new Task({
      project: new MockProject(),
      ui: mockUI
    });

    taskOptions = {
      distDir: 'tests/fixtures/dist',
      assets: {
        accessKeyId: 'access-key',
        secretAccessKey: 'access-secret',
        region: 'region',
        bucket: 'bucket',
        filePattern: '**/*.{js,css,css.gz,png,gif,jpg}',
        extensionOverrides: {
          'css.gz': {
            ContentType: 'text/css',
            ContentEncoding: 'gzip'
          }
        }
      },
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
      assert.deepEqual(params.extensionOverrides, {
        'css.gz': {
          ContentType: 'text/css',
          ContentEncoding: 'gzip'
        }
      });

      var paths = MockS3Uploader.paths;

      assert.include(paths, 'assets/app.css');
      assert.include(paths, 'assets/app.css.gz');
      assert.include(paths, 'assets/app.js');

      assert.include(mockUI.output[0], 'Successfully uploaded: assets/app.css');
      assert.include(mockUI.output[1], 'Successfully uploaded: assets/app.css.gz');
      assert.include(mockUI.output[2], 'Successfully uploaded: assets/app.js');
      assert.include(mockUI.output[3], 'To deploy index.html');
      assert.include(mockUI.output[4], 'ember deploy:index');
    }, function(error) {
      assert.ok(false, 'Should have resolved due to successful upload of assets');
    });
  });
});
