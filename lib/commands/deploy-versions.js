'use strict';

module.exports = {
  name: 'deploy:versions',
  description: 'Lists all versions of the app have been deployed',
  works: 'insideProject',

  _tasks: {
    DeployVersionsTask: require('../tasks/deploy-versions')
  },

  _registry: require('../utilities/adapter-registry'),

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
  ],

  run: function(commandOptions, rawArgs) {
    var project = this.project;
    var ui      = this.ui;

    var AdapterRegistry = this._registry;
    var registry = new AdapterRegistry({
      project: project,
      ui: ui
    });

    var DeployVersionsTask = this._tasks.DeployVersionsTask;
    var deployVersionsTask = new DeployVersionsTask({
      project: project,
      ui: ui,
      registry: registry
    });

    return deployVersionsTask.run(commandOptions);
  }
};
