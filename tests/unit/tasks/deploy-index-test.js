'use strict';

var assert      = require('ember-cli/tests/helpers/assert');
var Promise     = require('ember-cli/lib/ext/promise');
var MockProject = require('ember-cli/tests/helpers/mock-project');
var MockUI      = require('ember-cli/tests/helpers/mock-ui');
var MockAdapter = require('../../helpers/mock-adapter');
var MockRegistry = require('../../helpers/mock-registry');

describe('tasks/deploy-index', function() {
  var DeployIndexTask;
  var subject;
  var options;
  var rejected, resolved;
  var mockUI;

  before(function() {
    DeployIndexTask = require('../../../lib/tasks/deploy-index');

    rejected = function() {
      return Promise.reject();
    };
    resolved = function(value) {
      if (value) {
        return Promise.resolve(value);
      }

      return Promise.resolve();
    };
  });

  beforeEach(function() {
    MockAdapter.prototype.upload = resolved.bind(this, 'aaa');

    var mockProject = new MockProject();
    mockProject.root = process.cwd() + '/tests/fixtures';

    mockUI = new MockUI();

    options = {
      project: mockProject,
      ui: mockUI,
      _indexFile: resolved
    };
  });

  after(function() {
    DeployIndexTask = null;
  });

  it('rejects if index.html cannot be found', function() {
    options._indexFile = rejected;
    options.registry = new MockRegistry();

    subject = new DeployIndexTask(options);

    return subject.run({environment: 'development'})
      .then(function() {
        assert.ok(false);
      }, function(error) {
        assert.equal(error.message, 'index.html could not be found.\n');
      });
  });

  it('rejects if upload fails', function() {
    MockAdapter.prototype.upload = rejected;
    options.registry = new MockRegistry();

    subject = new DeployIndexTask(options);

    return subject.run({environment: 'development'})
      .then(function() {
        assert.ok(false, 'Should have rejected');
      }, function() {
        assert.ok(true);
      });
  });

  it('resolves if uploaded succeeds', function() {
    options.registry = new MockRegistry();
    subject = new DeployIndexTask(options);

    return subject.run({environment: 'development'})
      .then(function() {
        assert.equal(mockUI.output, 'ember activate aaa\n');
      }, function() {
        assert.ok(false, 'Should have resolved');
      });
  });
});
