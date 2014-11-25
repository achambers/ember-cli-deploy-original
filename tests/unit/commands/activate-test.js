'use strict';

var assert       = require('ember-cli/tests/helpers/assert');
var Task         = require('ember-cli/lib/models/task');
var Promise      = require('ember-cli/lib/ext/promise');
var MockRegistry = require('../../helpers/mock-registry');

describe('activate command', function() {
  var subject;
  var tasks;

  beforeEach(function() {
    tasks = {
      ActivateTask: Task.extend({
        run: function(options) {
          return Promise.resolve(options);
        }
      })
    };

    subject = require('../../../lib/commands/activate');

    subject._tasks = tasks;
    subject._registry = MockRegistry;
  });

  it('runs the activate task', function() {
    return subject.run({environment: 'development'}, ['aaa'])
      .then(function(options) {
        assert.equal(options.environment, 'development');
        assert.equal(options.key, 'aaa');
      }, function() {
        assert.ok(false, 'Should have resolved');
      });
  });
});
