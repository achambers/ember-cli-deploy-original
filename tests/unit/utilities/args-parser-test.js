'use strict';

var assert     = require('../../helpers/assert');
var ArgsParser = require('../../../lib/utilities/args-parser');
var MockProject = require('../../helpers/mock-project');
var MockUI = require('../../helpers/mock-ui');

describe('args-parser', function() {
  var subject;
  var mockUI;

  beforeEach(function() {
    mockUI = new MockUI();

    var availableOptions = [
      { name: 'option-with-default', key: 'optionWithDefault', type: String, default: 'test-default', required: false },
      { name: 'option-without-default', key: 'optionWithoutDefault', type: String, required: false },
      { name: 'required-option', key: 'requiredOption', type: String, required: true }
    ];

    subject = new ArgsParser({
      project: new MockProject(),
      ui: mockUI,
      commandName: 'test-command',
      availableOptions: availableOptions
    });
  });

  describe('#parseArgs', function() {
    describe('all options passed in', function() {
      it('parses options successfully', function() {
        var options = ['--option-with-default=option1', '--option-without-default=option2', '--required-option=option3'];

        var result = subject.parseArgs(options);
        var options = result.options;
        var args = result.args;

        assert.equal(options.optionWithDefault, 'option1');
        assert.equal(options.optionWithoutDefault, 'option2');
        assert.equal(options.requiredOption, 'option3');
        assert.equal(args.length, 0);
      });
    });

    describe('default options', function() {
      it('falls back to the defult value when option not passed in', function() {
        var options = ['--option-without-default=option2', '--required-option=option3'];

        var result = subject.parseArgs(options);
        var options = result.options;
        var args = result.args;

        assert.equal(options.optionWithDefault, 'test-default');
      });
    });

    describe('required options', function() {
      it('falls back to the defult value when option not passed in', function() {
        var options = ['--option-without-default=option2'];

        subject.parseArgs(options);

        assert.ok(mockUI.output[0].indexOf('The specified command') > -1);
        assert.ok(mockUI.output[0].indexOf('required-option') > -1);
      });
    });
  });
});
