'use strict';

var Promise     = require('../ext/promise');
var chalk       = require('chalk');
var fs          = require('fs');
var env         = require('node-env-file');
var SilentError = require('../errors/silent');
var ArgsParser  = require('../utilities/args-parser');

module.exports = {
  name: 'deploy:assets',
  description: 'Deploys assets to S3',
  works: 'insideProject',

  _tasks: {
    DeployAssetsTask: require('../tasks/deploy-assets')
  },

  availableOptions: [
    { name: 'dist-dir', type: String, default: 'dist' },
    { name: 's3-access-key-id', type: String },
    { name: 's3-secret-access-key', type: String },
    { name: 's3-bucket-name', type: String },
    { name: 's3-region', type: String, default: 'us-east-1' }
  ],

  validateAndRun: function(commandArgs) {
    var args = this._parseArgs(commandArgs);

    return this.run(args.options, args.args);
  },

  run: function(commandOptions, rawArgs) {
    var envPath    = this.project.root + '/.env';
    var options    = {
      distDir: commandOptions.distDir,
      s3: {
        key: commandOptions.s3AccessKeyId,
        secret: commandOptions.s3SecretAccessKey,
        bucket: commandOptions.s3BucketName,
        region: commandOptions.s3Region
      }
    };
    var message;

    if (fs.existsSync(envPath)) {
      env(this.project.root + '/.env' );
    }

    if (!options.s3.key) {
      message = chalk.yellow('The `ember deploy:assets` command requires an s3-access-key-id to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    if (!options.s3.secret) {
      message = chalk.yellow('The `ember deploy:assets` command requires an s3-secret-access-key to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    if (!options.s3.bucket) {
      message = chalk.yellow('The `ember deploy:assets` command requires an s3-bucket-name to be specified.  For more details, use `ember help`\n');

      return Promise.reject(new SilentError(message));
    }

    var DeployAssetsTask = this._tasks.DeployAssetsTask;
    var deployAssetsTask = new DeployAssetsTask({
      ui: this.ui,
      project: this.project
    });

    return deployAssetsTask.run(options);
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
