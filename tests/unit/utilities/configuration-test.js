'use strict';

var assert = require('ember-cli/tests/helpers/assert');
var Config = require('../../../lib/utilities/configuration');

describe('utilities/configuration', function() {
  describe('initialisation', function() {
    it('throws an error if environment is not set', function() {
      try {
        new Config();
      } catch(e) {
        assert.equal(e.message, 'Configuration must define an `environment` property\n');
        return;
      }

      assert.ok(false, 'Should have thrown an exception due to no environment property');
    });

    it('throws an error if the config file does not exist', function() {
      try {
        new Config({
          project: { root: process.cwd() },
          environment: 'development'
        });
      } catch(e) {
        assert.equal(e.message, '`development` config does not exist\n');
        return;
      }

      assert.ok(false, 'Should have thrown an exception due to no config found');
    });

    it('sets the config when it exists', function() {
      var subject = new Config({
        project: { root: process.cwd() + '/tests/fixtures' },
        environment: 'development'
      });

      assert.ok(subject.hasOwnProperty('distDir'), 'Config missing property');
      assert.ok(subject.hasOwnProperty('index'), 'Config missing property');
      assert.ok(subject.hasOwnProperty('assets'), 'Config missing property');
    });
  });
});
