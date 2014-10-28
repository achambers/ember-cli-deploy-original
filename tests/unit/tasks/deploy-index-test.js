'use strict';

var proxyquire  = require('proxyquire');
var assert      = require('../../helpers/assert');
var MockProject = require('../../helpers/mock-project');
var MockUI      = require('../../helpers/mock-ui');
var MockRedis   = require('../../helpers/mock-redis');

var redis       = new MockRedis();

var Task        = proxyquire('../../../lib/tasks/deploy-index', { 'redis': redis });

describe('deploy-index task', function() {
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
      hash: '123456',
      redis: {
        host: '127.0.0.1',
        port: '1234',
        password: 'password'
      },
      distDir: 'tests/fixtures/dist'
    }
  });

  it('doesn\'t proceed if distDir does not exist', function() {
    taskOptions.distDir = 'dist';

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due to no dist dir found');
    })
    .catch(function(error) {
      assert.include(error.message, 'Unable to find dist directory [dist/]');
    });
  });

  it('doesn\'t proceed if index.html does not exist', function() {
    taskOptions.distDir = 'tests/fixtures/dist-no-index';

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due to no index.html found');
    })
    .catch(function(error) {
      assert.include(error.message, 'Unable to find index.html file [tests/fixtures/dist-no-index/index.html]');
    });
  });

  it('creates a redis client', function() {
    return subject.run(taskOptions).then(function() {
      assert.equal(redis.client().host(), '127.0.0.1');
      assert.equal(redis.client().port(), '1234');
      assert.equal(redis.client().options().auth_pass, 'password');
    })
    .catch(function(error) {
      assert.ok(false, 'Shouldn\'t have thrown an error');
    });
  });

  it('doesn\'t proceed if an error occurs when setting redis key', function() {
    redis.throwSetError(true);

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due Redis error');
    }, function(error) {
      assert.include(error.message, 'Error occurred when deploying index to Redis');
    });
  });

  it('proceeds if index.html is set in redis successfully', function() {
    redis.throwSetError(false);

    return subject.run(taskOptions).then(function() {
      assert.include(mockUI.output[0], 'index.html successfully deployed to Redis');
      assert.include(mockUI.output[1], 'To Activate:');
      assert.include(mockUI.output[2], 'ember activate 123456');
    })
    .catch(function(error) {
      assert.ok(false, 'Shouldn\'t have thrown an error');
    });
  });
});
