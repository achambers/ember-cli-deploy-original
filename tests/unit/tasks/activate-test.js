'use strict';

var assert       = require('ember-cli/tests/helpers/assert');
var CLIPromise   = require('ember-cli/lib/ext/promise');
var MockProject  = require('ember-cli/tests/helpers/mock-project');
var MockUI       = require('ember-cli/tests/helpers/mock-ui');
var MockRegistry = require('../../helpers/mock-registry');
var MockAdapter  = require('../../helpers/mock-adapter');

describe('tasks/activate', function() {
  var ActivtateTask;
  var subject;
  var options, runOptions;
  var succeeded, failed;
  var mockUI;

  before(function() {
    ActivtateTask = require('../../../lib/tasks/activate');

    succeeded = function(value) {
      if (value) {
        return CLIPromise.resolve(value);
      }
      return CLIPromise.resolve();
    };

    failed = function(value) {
      if (value) {
        return CLIPromise.reject(value);
      }
      return CLIPromise.reject();
    };
  });

  beforeEach(function() {
    var mockProject = new MockProject();
    mockProject.root = process.cwd() + '/tests/fixtures';

    mockUI = new MockUI();

    options = {
      project: mockProject,
      ui: mockUI,
      registry: new MockRegistry()
    };

    runOptions = {
      key: 'aaa',
      environment: 'development'
    };
  });

  after(function() {
    ActivtateTask = null;
  });

  it('rejects if deploy version is not specified', function() {
    subject = new ActivtateTask(options);

    delete runOptions.key;

    return subject.run(runOptions)
      .then(function() {
        assert.ok(false,'Should have rejected due to missing key');
      }, function(error) {
        assert.include(error.message, 'The `ember activate` command requires a deploy version to be specified.');
      });
  });

  it('rejects if setting the current version fails', function() {
    MockAdapter.prototype.setCurrent = failed;

    subject = new ActivtateTask(options);

    return subject.run(runOptions)
      .then(function() {
        assert.ok(false, 'Should have rejected');
      }, function(error) {
        assert.equal(error, 'aaa');
      });
  });

  it('resolves if version is activated', function() {
    MockAdapter.prototype.setCurrent = succeeded;

    subject = new ActivtateTask(options);

    return subject.run(runOptions)
      .then(function() {
        assert.equal(mockUI.output, 'Version `aaa` activated\n');
      }, function(error) {
        assert.ok(false, 'Should have resolved');
      });
  });
});
