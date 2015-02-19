'use strict';

var assert       = require('../../helpers/assert');
var MockS3Client = require('../../helpers/mock-s3-client');
var S3Uploader   = require('../../../lib/utilities/s3-uploader');

describe('s3-uploader', function() {
  var subject;
  var mockClient;

  beforeEach(function() {
    mockClient = new MockS3Client();
    subject = new S3Uploader({
      client: mockClient,
      bucket: 'test-bucket',
      extensionOverrides: {
        'css.gz': {
          ContentType: 'text/css',
          ContentEncoding: 'gzip',
        }
      }
    });
  });

  describe('#uploadFile', function() {
    describe('file to upload does not exist', function() {
      it('does not proceed', function() {
        var params = {
          cwd: 'xxx',
          filePath: 'this-does-not-exist'
        };

        return subject.uploadFile(params)
          .then(function() {
            assert.ok(false,'Should have rejected');
          }, function(message) {
            assert.include(message, 'File at path: \'xxx/this-does-not-exist\' does not exist');
          });
      })
    });

    describe('A successful upload', function() {
      it('uploads the file successfully', function() {
        var params = {
          cwd: process.cwd(),
          filePath: 'tests/fixtures/dist/assets/app.css'
        };

        mockClient.resolveUpload();

        return subject.uploadFile(params)
          .then(function(filePath) {
            assert.equal(filePath, 'tests/fixtures/dist/assets/app.css');
            assert.equal(mockClient.params['Bucket'], 'test-bucket');
            assert.equal(mockClient.params['ACL'], 'public-read');
            assert.equal(mockClient.params['ContentType'], 'text/css');
            assert.equal(mockClient.params['Key'], 'tests/fixtures/dist/assets/app.css');
          }, function() {
            assert.ok(false, 'Should not have rejected');
          });
      });

      it('uploads a file successfully with custom headers', function() {
        var params = {
          cwd: process.cwd(),
          filePath: 'tests/fixtures/dist/assets/app.css.gz',
        };

        mockClient.resolveUpload();

        return subject.uploadFile(params)
          .then(function(filePath) {
            assert.equal(filePath, 'tests/fixtures/dist/assets/app.css.gz');
            assert.equal(mockClient.params['Bucket'], 'test-bucket');
            assert.equal(mockClient.params['ACL'], 'public-read');
            assert.equal(mockClient.params['ContentType'], 'text/css');
            assert.equal(mockClient.params['ContentEncoding'], 'gzip');
            assert.equal(mockClient.params['Key'], 'tests/fixtures/dist/assets/app.css.gz');
          }, function() {
            assert.ok(false, 'Should not have rejected');
          });

      });
    });

    describe('An unsuccessful upload', function() {
      it('rejects with an error', function() {
        var params = {
          cwd: process.cwd(),
          filePath: 'tests/fixtures/dist/assets/app.css'
        };

        mockClient.rejectUpload();

        return subject.uploadFile(params)
          .then(function() {
            assert.ok(false, 'Should not have resolved');
          }, function(error) {
            assert.equal(error, 'Mock error message');
          });
      });
    });
  });
});
