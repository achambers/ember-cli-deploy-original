'use strict';

var chalk       = require('chalk');
var Promise     = require('../ext/promise');
var SilentError = require('../errors/silent');

function ActivateTask(options) {
  this.project = options.project;
  this.ui      = options.ui;
};

ActivateTask.prototype.run = function(options) {
  var ui            = this.ui;
  var key           = options.key;
  var redisKey      = 'index:' + key;
  var redisHost     = options.redis.host;
  var redisPort     = options.redis.port;
  var redisPassword = options.redis.password;

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
          var message = chalk.red('Data is empty in Redis for redis key [' + key + ']: ' + error);
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
