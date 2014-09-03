'use strict';

var nopt        = require('nopt');
var env         = require('node-env-file');
var fs          = require('fs');
var chalk       = require('chalk');
var camelize    = require('../utilities/string').camelize;
var underscore  = require('../utilities/string').underscore;

var Parser = function(options) {
  this.project          = options.project;
  this.ui               = options.ui;
  this.commandName      = options.commandName;
  this.availableOptions = options.availableOptions;
};

Parser.prototype.parseArgs = function(commandArgs) {
  var envPath          = this.project.root + '/.env';
  var knownOpts        = {};
  var commandOptions   = {};
  var ui               = this.ui;
  var commandName      = this.commandName;
  var availableOptions = this.availableOptions;
  var parsedOptions;

  var assembleAndValidateOption = function(option) {
    if (parsedOptions[option.name] === undefined) {
      var envVarKey = underscore(option.name).toUpperCase();
      var envVar = process.env[envVarKey];

      if (envVar !== undefined) {
        commandOptions[option.key] = envVar;
      } else if (option.default !== undefined) {
        commandOptions[option.key] = option.default;
      } else if (option.required) {
        ui.writeLine('The specified command ' + chalk.green(commandName) +
                     ' requires the option ' + chalk.green(option.name) + '.');
        return false;
      }
    } else {
      commandOptions[option.key] = parsedOptions[option.name];
      delete parsedOptions[option.name];
    }
    return true;
  };

  if (fs.existsSync(envPath)) {
    env(envPath);
  }

  availableOptions.forEach(function(option) {
    knownOpts[option.name] = option.type;
  });

  parsedOptions = nopt(knownOpts, {}, commandArgs, 0);

  if (!availableOptions.every(assembleAndValidateOption)) {
    return null;
  }

  for (var key in parsedOptions) {
    if(typeof parsedOptions[key] !== 'object') {
      commandOptions[camelize(key)] = parsedOptions[key];
    }
  }

  return {
    options: commandOptions,
    args: parsedOptions.argv.remain
  };
};

module.exports = Parser;
