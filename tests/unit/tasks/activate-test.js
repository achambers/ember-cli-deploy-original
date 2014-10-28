'use strict';

var proxyquire  = require('proxyquire');
var assert      = require('../../helpers/assert');
var MockProject = require('../../helpers/mock-project');
var MockUI      = require('../../helpers/mock-ui');
var MockRedis   = require('../../helpers/mock-redis');

var redis       = new MockRedis();

var Task        = proxyquire('../../../lib/tasks/activate', { 'redis': redis });

describe('activate task', function() {
  var subject;
  var mockUI;
  var taskOptions;

  beforeEach(function() {
    mockUI = new MockUI();

    subject = new Task({
      project: new MockProject(),
      ui: mockUI
    });

    taskOptions = {
      key: 'abcde',
      redis: {
        host: '127.0.0.2',
        port: '1234',
        password: 'password'
      }
    };
  });

  it('creates a redis client', function() {
    return subject.run(taskOptions).then(function() {
      assert.equal(redis.client().host(), '127.0.0.2');
      assert.equal(redis.client().port(), '1234');
      assert.equal(redis.client().options().auth_pass, 'password');
    }, function(error) {
      assert.ok(false, 'Shouldn\'t have thrown an error');
    });
  });

  it('doesn\'t proceed if an error occurs when getting redis key', function() {
    redis.throwGetError(true);

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due Redis error');
    }, function(error) {
      assert.include(error.message, 'Error occurred when retrieving key [abcde] from Redis');
    });
  });

  it('doesn\'t proceed if data is empty for redis key', function() {
    redis.returnData(null);

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due Redis error');
    }, function(error) {
      assert.include(error.message, 'Error occurred when retrieving key [abcde] from Redis');
    });
  });

  it('doesn\'t proceed if an error occurs when setting redis key', function() {
    redis.throwGetError(false);
    redis.returnData('helllo');
    redis.throwSetError(true);

    return subject.run(taskOptions).then(function() {
      assert.ok(false, 'Should have errored due Redis error');
    }, function(error) {
      assert.include(error.message, 'Error occured when setting redis key [abcde] to current');
    });
  });

  it('proceeds if index.html is activated successfully', function() {
    redis.throwGetError(false);
    redis.returnData('helllo');
    redis.throwSetError(false);

    return subject.run(taskOptions).then(function() {
      assert.include(mockUI.output[0], 'Success');
      assert.include(mockUI.output[1], 'Release [abcde] successfully activated');
    }, function(error) {
      assert.ok(false, 'Shouldn\'t have thrown an error');
    });
  });
});
