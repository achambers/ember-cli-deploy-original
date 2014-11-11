'use strict';

var chalk       = require('chalk');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');

function ActivateTask(options) {
  this.project = options.project;
  this.ui      = options.ui;
};

ActivateTask.prototype.run = function(config) {
  var ui            = this.ui;
  var key           = config.key;
  var redisKey      = 'index:' + key;
  var redisHost     = config.index.host;
  var redisPort     = config.index.port;
  var redisPassword = config.index.password;

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

    client.get(redisKey, function(error, data) {
      if (error) {
        var message = chalk.red('Error occurred when retrieving key [' + key + '] from Redis: ' + error);
        return reject(new SilentError(message));
      } else {
        if (!data) {
          var message = chalk.red('No index.html entry exists for redis key [' + key + ']: ' + error);
          return reject(new SilentError(message));
        } else {
          client.set('index:current', data, function(error) {
            if (error) {
              var message = chalk.red('Error occured when setting redis key [' + key + '] to current: ' + error);
              return reject(new SilentError(message));
            } else {
              ui.write(chalk.green('\nSuccess\n'));
              ui.write(chalk.gray('Release [' + key + '] successfully activated\n\n'));

              resolve();
            }
          });
        }
      }
    });
  });
};

module.exports = ActivateTask;
