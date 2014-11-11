'use strict';

var path = require('path');

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
    { name: 'environment', type: String, default: 'development' }
  ],

  run: function(commandOptions, rawArgs) {
    var key = rawArgs[0];

    var ConfigValidator = require('../validators/activate-config');
    var validator = new ConfigValidator();

    var config = this._config(commandOptions.environment);
    config.key = key;

    var ActivateTask = this._tasks.ActivateTask;
    var activateTask = new ActivateTask({
      ui: this.ui,
      project: this.project
    });

    return validator.validate(config)
      .then(activateTask.run.bind(this));
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

