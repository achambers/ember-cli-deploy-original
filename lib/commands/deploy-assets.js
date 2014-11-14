'use strict';

var path = require('path');

module.exports = {
  name: 'deploy:assets',
  description: 'Deploys assets to S3',
  works: 'insideProject',

  _tasks: {
    DeployAssetsTask: require('../tasks/deploy-assets')
  },

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'dist-dir', type: String, default: 'dist/' }
  ],

  run: function(commandOptions, rawArgs) {
    var ConfigValidator = require('../validators/assets-config');
    var validator = new ConfigValidator({
      project: this.project
    });

    var DeployAssetsTask = this._tasks.DeployAssetsTask;
    var deployAssetsTask = new DeployAssetsTask({
      ui: this.ui,
      project: this.project
    });

    var config = this._config(commandOptions.environment);

    return validator.validate(config)
      .then(function(config) {
        return deployAssetsTask.run(config);
      });
  },

  _config: function(env) {
    var root = this.project.root;
    var configPath = path.join(root, 'config', 'deploy', env);
    var config;

    try {
      config = require(configPath);
    } catch(e) {
      config = {};
    }

    return config;
  }
};
