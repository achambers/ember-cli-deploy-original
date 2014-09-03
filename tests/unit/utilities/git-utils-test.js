'use strict';

var assert      = require('../../helpers/assert');
var GitUtils    = require('../../../lib/utilities/git-utils');
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
      var result = subject.hash();

      assert.ok(/[0-9a-f]{10}/.test(result), 'Should not be able to return hash as HEAD should have no ref path');
    });
  });

  describe('#branch', function() {
    it('returns the branch name', function() {
      var result = subject.branch();

      assert.ok(/.+/.test(result), 'Should not be able to return hash as HEAD should have no ref path');
    });
  });
});
