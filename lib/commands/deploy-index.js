'use strict';

var Promise         = require('../ext/promise');
var chalk           = require('chalk');
var fs              = require('fs');
var env             = require('node-env-file');
var SilentError     = require('../errors/silent');

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
    { name: 'redis-password', type: String }
  ],

  run: function(commandOptions, rawArgs) {
    var envPath      = this.project.root + '/.env';
    var redisOptions = {};
    var options      = {};
    var message;

    if (fs.existsSync(envPath)) {
      env(this.project.root + '/.env' );
    }

    redisOptions.host = commandOptions.redisHost || process.env.REDIS_HOST;

    if (!redisOptions.host) {
      message = chalk.yellow('The `ember deploy:index` command requires a redis-host to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    redisOptions.port = commandOptions.redisPort || process.env.REDIS_PORT;

    if (!redisOptions.port) {
      message = chalk.yellow('The `ember deploy:index` command requires a redis-port to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    redisOptions.password = commandOptions.redisPassword || process.env.REDIS_PASSWORD;

    options.redis = redisOptions;

    options.distDir = commandOptions.distDir;

    var GitUtils = this._utils.GitUtils;
    var gitUtils = new GitUtils({
      project: this.project
    });

    options.hash = gitUtils.hash();

    var DeployIndexTask = this._tasks.DeployIndexTask;
    var deployIndexTask = new DeployIndexTask({
      ui: this.ui,
      project: this.project
    });

    return deployIndexTask.run(options);
  }
};
