'use strict';

var Promise     = require('../ext/promise');
var chalk       = require('chalk');
var SilentError = require('../errors/silent');
var ArgsParser  = require('../utilities/args-parser');

module.exports = {
  name: 'deploy:index',
  description: 'Deploys index.html to Redis',
  works: 'insideProject',

  _tasks: {
    DeployIndexTask: require('../tasks/deploy-index')
  },

  _utils: {
    GitUtils: require('../utilities/git-utils')
  },

  availableOptions: [
    { name: 'dist-dir', type: String, default: 'dist' },
    { name: 'redis-host', type: String },
    { name: 'redis-port', type: String },
    { name: 'redis-password', type: String },
    { name: 'git-root', type: String, default: ''}
  ],

  validateAndRun: function(commandArgs) {
    var args = this._parseArgs(commandArgs);

    return this.run(args.options, args.args);
  },

  run: function(commandOptions, rawArgs) {
    var options = {
      distDir: commandOptions.distDir,
      redis: {
        host: commandOptions.redisHost,
        port: commandOptions.redisPort,
        password: commandOptions.redisPassword
      },
      gitRoot: commandOptions.gitRoot
    };
    var message;

    if (!options.redis.host) {
      message = chalk.yellow('The `ember deploy:index` command requires a redis-host to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    if (!options.redis.port) {
      message = chalk.yellow('The `ember deploy:index` command requires a redis-port to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    var GitUtils = this._utils.GitUtils;
    var gitUtils = new GitUtils({
      project: this.project,
      gitRoot: options.gitRoot
    });

    options.hash = gitUtils.hash();

    var DeployIndexTask = this._tasks.DeployIndexTask;
    var deployIndexTask = new DeployIndexTask({
      ui: this.ui,
      project: this.project
    });

    return deployIndexTask.run(options);
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
