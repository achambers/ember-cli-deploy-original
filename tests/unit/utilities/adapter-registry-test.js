'use strict';

var assert          = require('ember-cli/tests/helpers/assert');
var MockUI          = require('ember-cli/tests/helpers/mock-ui');
var AdapterRegistry = require('../../../lib/utilities/adapter-registry');

describe('utilities/adapter-registry', function() {
  it('returns the first index adapter if there is one or more registered', function() {
    var project = {
      addons: [
        {adapter: {type: 'index-adapter', name: 'a'} },
        {adapter: {type: 'index-adapter', name: 'b'} }
      ]
    };

    var subject = new AdapterRegistry({
      project: project,
      ui: new MockUI()
    });

    var adapter = subject.indexAdapter();

    assert.equal(adapter.name, 'a');
  });

  it('uses default index adapter if none are registered', function() {
    var project = {
      addons: []
    };

    var mockUI = new MockUI();

    var subject = new AdapterRegistry({
      project: project,
      ui: mockUI
    });

    var result = subject.indexAdapter();

    assert.include(mockUI.output, 'No index adapter specified.  Defaulting to `redis-index-adapter`');
    assert.equal(result.type, 'index-adapter');
  });
});
