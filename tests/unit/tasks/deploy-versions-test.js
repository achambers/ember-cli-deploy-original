'use strict';

var assert       = require('ember-cli/tests/helpers/assert');
var Promise      = require('ember-cli/lib/ext/promise');
var MockProject  = require('ember-cli/tests/helpers/mock-project');
var MockUI       = require('ember-cli/tests/helpers/mock-ui');
var MockAdapter  = require('../../helpers/mock-adapter');
var MockRegistry = require('../../helpers/mock-registry');

describe('tasks/deploy-versions', function() {
  var DeployVersionsTask;
  var subject;
  var options;
  var mockUI;
  var resolved;

  before(function() {
    DeployVersionsTask = require('../../../lib/tasks/deploy-versions');

    resolved = function(value) {
      if (value) {
        return Promise.resolve(value);
      }

      return Promise.resolve();
    };
  });

  beforeEach(function() {
    var mockProject = new MockProject();
    mockUI = new MockUI();
    mockProject.root = process.cwd() + '/tests/fixtures';

    options = {
      project: mockProject,
      ui: mockUI
    };
  });

  after(function() {
    DeployVersionsTask = null;
  });

  it('resolves with versions', function() {
    MockAdapter.prototype.listVersions = resolved.bind(this, [{ key: 'aaa' }, {key: 'bbb' }]);
    options.registry = new MockRegistry();

    subject = new DeployVersionsTask(options);

    return subject.run({environment: 'development'})
    .then(function(outputStr) {
      assert.equal(mockUI.output, "The previous 2 versions uploaded:\naaa\nbbb");
    });
  });

});
