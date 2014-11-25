'use strict';

module.exports = {
  name: 'deploy:index',
  description: 'Deploys index.html to Redis',
  works: 'insideProject',

  _tasks: {
    DeployIndex: require('../tasks/deploy-index')
  },

  _registry: require('../utilities/adapter-registry'),

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'dist-dir', type: String, default: 'dist/' }
  ],

  run: function(commandOptions, rawArgs) {
    var project = this.project;
    var ui      = this.ui;

    var AdapterRegistry = this._registry;
    var registry = new AdapterRegistry({
      project: project,
      ui: ui
    });

    var DeployIndexTask = this._tasks.DeployIndex;
    var deployIndexTask = new DeployIndexTask({
      project: project,
      ui: ui,
      registry: registry
    });

    return deployIndexTask.run(commandOptions);
  }
};
