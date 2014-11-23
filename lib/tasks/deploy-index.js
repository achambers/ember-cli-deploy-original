'use strict';

var chalk = require('chalk');
var fs = require('fs');
var Promise = require('../ext/promise');
var SilentError = require('../errors/silent');

var DeployIndexTask = function(options) {
  this.project = options.project;
  this.ui = options.ui;
  this.environment = options.environment;
  this.availableOptions = options.availableOptions;
};

DeployIndexTask.prototype.run = function(config) {
  var ui = this.ui;
  var distDir = config.distDir;
  var indexFilePath = distDir + '/index.html'
  var hash = config.hash;
  var redisKey = 'index:' + hash;
  var redisHost = config.index.host;
  var redisPort = config.index.port;
  var redisPassword = config.index.password;

  if (!fs.existsSync(distDir)) {
    var message = chalk.yellow('Unable to find dist directory [' + distDir + '/].  Ensure you have run `ember build` before running this task.  See `ember help` for more details\n');

    return Promise.reject(new SilentError(message));
  }

  if (!fs.existsSync(indexFilePath)) {
    var message = chalk.yellow('Unable to find index.html file [' + indexFilePath + '].  Ensure you have run `ember build` before running this task.  See `ember help` for more details\n');

    return Promise.reject(new SilentError(message));
  }

  var data = fs.readFileSync(indexFilePath);
  var environment = this.environment;
  var availableOptions = this.availableOptions;
  var numOptions = availableOptions.length;
  var defaultEnvironment = null;

  while(numOptions--) {
    var option = availableOptions[numOptions];
    if(option.name == 'environment') {
      defaultEnvironment = option.default;
      break;
    }
  }

  return new Promise(function(resolve, reject) {
    var client = require('redis').createClient(redisPort, redisHost, {
      auth_pass: redisPassword
    });

    client.on('error', function(error) {
      ui.write(chalk.red('Redis error occurred: ' + error + '\n'));
    });

    client.on('ready', function() {
      ui.write(chalk.green('Connected to Redis [' + redisHost + ':' + redisPort + ']\n'));
    });

    client.set(redisKey, data, function(error, response) {
      if (error) {
        var message = chalk.red('Error occurred when deploying index to Redis: ' + error);
        return reject(new SilentError(message));
      } else {
        ui.write(chalk.green('\nSuccessfully deployed to Redis: ' + indexFilePath));
        ui.write(chalk.bold.gray('\n\nTo activate index.html:'));

        var activateMsg = '\nember activate ' + hash;

        if(environment != defaultEnvironment) {
          activateMsg += ' --environment=' + environment;
        }
        ui.write(chalk.gray(activateMsg + '\n\n'));

        return resolve();
      }
    });
  });
};

module.exports = DeployIndexTask;
