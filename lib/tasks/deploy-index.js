'use strict';

var chalk = require('chalk');
var fs = require('fs');
var Promise = require('../ext/promise');
var SilentError = require('../errors/silent');

var DeployIndexTask = function(options) {
  this.project = options.project;
  this.ui = options.ui;
};

DeployIndexTask.prototype.run = function(options) {
  var ui = this.ui;
  var distDir = options.distDir;
  var indexFilePath = distDir + '/index.html'
  var hash = options.hash;
  var redisKey = 'index:' + hash;
  var redisHost = options.redis.host;
  var redisPort = options.redis.port;
  var redisPassword = options.redis.password;

  if (!fs.existsSync(distDir)) {
    var message = chalk.yellow('Unable to find dist directory [' + distDir + '/].  Ensure you have run `ember build` before running this task.  See `ember help` for more details\n');

    return Promise.reject(new SilentError(message));
  }

  if (!fs.existsSync(indexFilePath)) {
    var message = chalk.yellow('Unable to find index.html file [' + distDir + '/index.html].  Ensure you have run `ember build` before running this task.  See `ember help` for more details\n');

    return Promise.reject(new SilentError(message));
  }

  var data = fs.readFileSync(indexFilePath);

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
        ui.write(chalk.green('index.html successfully deployed to Redis\n\n'));
        ui.write(chalk.bold.gray('To Activate:\n'));
        ui.write(chalk.gray('ember activate ' + hash + '\n'));

        return resolve();
      }
    });
  });
};

module.exports = DeployIndexTask;
