'use strict';

var assert = require('../../helpers/assert');
var GitUtils = require('../../../lib/utilities/git-utils');
var MockProject = require('../../helpers/mock-project');

describe('git-utils', function() {
  var subject;

  beforeEach(function() {
    subject = new GitUtils({
      project: new MockProject()
    });
  });

  describe('#hash', function() {
    it('returns the short SHA', function() {
      return subject.hash()
        .then(function(hash) {
          assert.ok(/[0-9a-f]{10}/.test(hash), 'Should return hash');
        }, function() {
          assert.ok(false, 'Should have returned hash');
        });
    });
  });

  describe('#branch', function() {
    it('returns the branch name', function() {
      return subject.branch()
        .then(function(branch) {
          assert.ok(/.*/.test(branch), 'Should return branch');
        }, function() {
          assert.ok(false, 'Should have returned branch');
        });
    });
  });
});
