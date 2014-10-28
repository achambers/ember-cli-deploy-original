'use strict';

var Promise     = require('../ext/promise');
var chalk       = require('chalk');
var SilentError = require('../errors/silent');
var ArgsParser  = require('../utilities/args-parser');

module.exports = {
  name: 'activate',
  description: 'Activate a deployed version of index.html',
  works: 'insideProject',

  _tasks: {
    ActivateTask: require('../tasks/activate')
  },

  anonymousOptions: [
    '<key>'
  ],

  availableOptions: [
    { name: 'redis-host', type: String },
    { name: 'redis-port', type: String },
    { name: 'redis-password', type: String }
  ],

  validateAndRun: function(commandArgs) {
    var args = this._parseArgs(commandArgs);

    return this.run(args.options, args.args);
  },

  run: function(commandOptions, rawArgs) {
    var options = {
      key: rawArgs[0],
      redis: {
        host: commandOptions.redisHost,
        port: commandOptions.redisPort,
        password: commandOptions.redisPassword
      }
    };
    var message;

    if (!options.key) {
      message = chalk.yellow('The `ember activate` command requires a deploy key to be specified. For more detrails, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    if (!options.redis.host) {
      message = chalk.yellow('The `ember activate` command requires a redis-host to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    if (!options.redis.port) {
      message = chalk.yellow('The `ember activate` command requires a redis-port to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    var ActivateTask = this._tasks.ActivateTask;
    var activateTask = new ActivateTask({
      ui: this.ui,
      project: this.project
    });

    return activateTask.run(options);
  },

  _parseArgs: function(commandArgs) {
    var parser = new ArgsParser({
      project: this.project,
      ui: this.ui,
      commandName: this.name,
      availableOptions: this.availableOptions
    });

    return parser.parseArgs(commandArgs);
  }
};

