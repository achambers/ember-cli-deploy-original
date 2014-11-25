'use strict';

module.exports = {
  name: 'activate',
  description: 'Activate a deployed version of index.html',
  works: 'insideProject',

  _tasks: {
    ActivateTask: require('../tasks/activate')
  },

  _registry: require('../utilities/adapter-registry'),

  anonymousOptions: [
    '<key>'
  ],

  availableOptions: [
    { name: 'environment', type: String, default: 'development' }
  ],

  run: function(commandOptions, rawArgs) {
    var project = this.project;
    var ui      = this.ui;
    var key     = rawArgs[0];

    var AdapterRegistry = this._registry;
    var registry = new AdapterRegistry({
      project: project,
      ui: ui
    });

    var ActivateTask = this._tasks.ActivateTask;
    var activateTask = new ActivateTask({
      project: project,
      ui: ui,
      registry: registry
    });

    commandOptions.key = key;

    return activateTask.run(commandOptions);
  },
};

