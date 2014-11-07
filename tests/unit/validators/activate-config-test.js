'use strict';

var assert      = require('../../helpers/assert');
var Validator   = require('../../../lib/validators/activate-config');

describe('activate-config-validator', function() {
  var subject;
  var config;

  beforeEach(function() {
    config = {
      key: 'asdf123',
      index: {
        host: 'some-host',
        port: 'some-port',
        password: 'some-password'
      }
    };

    subject = new Validator();
  });

  describe('#validate', function() {
    it('doesn\'t proceed when key is missing', function() {
      delete config.key;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to key missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember activate` command requires a deploy key to be specified.');
        });
    });

    it('doesn\'t proceed when index is missing', function() {
      delete config.index;

      return subject.validate(config)
        .then(function() {
          assert.ok(false, 'Should have failed due to index missing from config');
        }, function(error) {
          assert.include(error.message, 'The `ember activate` command requires index config to be set.');
        });
    });

    it('uses the default index.host if is it missing', function() {
      delete config.index.host;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.index.host, 'localhost', 'Should have used default host');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default host being used');
        });
    });

    it('uses the default index.port if is it missing', function() {
      delete config.index.port;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.index.port, '6379', 'Should have used default port');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default port being used');
        });
    });

    it('uses the default index.password if is it missing', function() {
      delete config.index.password;

      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.index.password, null, 'Should have used default password');
        }, function() {
          assert.ok(false, 'Should have succeeded due to default password being used');
        });
    });

    it('proceeds if all config is valid', function() {
      return subject.validate(config)
        .then(function(config) {
          assert.equal(config.key, 'asdf123', 'Should have used specified key');
          assert.equal(config.index.host, 'some-host', 'Should have used specified index.host');
          assert.equal(config.index.port, 'some-port', 'Should have used specified index.port');
          assert.equal(config.index.password, 'some-password', 'Should have used specified index.password');
        }, function() {
          assert.ok(false, 'Should have succeeded due to config being valid');
        });
    });
  });
});
