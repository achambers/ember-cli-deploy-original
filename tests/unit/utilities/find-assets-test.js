'use strict';

var assert      = require('../../helpers/assert');
var findAssets    = require('../../../lib/utilities/find-assets');

describe('find-assets', function() {
  var subject = findAssets;

  beforeEach(function() { });

  describe('no options passed in', function() {
    it('returns an empty array', function() {
      var result = subject();

      assert.equal(result.length, 0);
    });
  });

  describe('empty options passed in', function() {
    it('returns an empty array', function() {
      var result = subject({});

      assert.equal(result.length, 0);
    });
  });

  describe('cwd not set in options', function() {
    it('sets the default cwd', function() {
      var options = {};
      var result = subject(options);

      assert.equal(options.cwd(), process.cwd());
    });
  });

  describe('returning files', function() {
    it('returns the files for the pattern provided', function() {
      var options = {
        cwd: process.cwd() + '/tests/fixtures/dist',
        pattern: '**/*.{js,css}',
      };

      var result = subject(options);

      assert.equal(result.length, 2);
      assert.ok(result.indexOf('assets/app.js') > -1);
      assert.ok(result.indexOf('assets/app.css') > -1);
    });
  });
});

