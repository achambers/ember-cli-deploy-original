'use strict';

var path = require('path');

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
    { name: 'environment', type: String, default: 'development' }
  ],

  run: function(commandOptions, rawArgs) {
    var ConfigValidator = require('../validators/index-config');
    var validator = new ConfigValidator({
      project: this.project
    });

    var GitUtils = this._utils.GitUtils;
    var gitUtils = new GitUtils({
      project: this.project
    });

    var DeployIndexTask = this._tasks.DeployIndexTask;
    var deployIndexTask = new DeployIndexTask({
      ui: this.ui,
      project: this.project
    });

    var config = this._config(commandOptions.environment);

    return gitUtils.hash()
      .then(function(hash) {
        config.hash = hash;

        return validator.validate(config);
      })
      .then(deployIndexTask.run.bind(this));
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
