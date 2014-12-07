var Task = require('ember-cli/lib/models/task');

module.exports = Task.extend({
  run: function(options) {
    var project  = this.project;
    var ui       = this.ui;
    var registry = this.registry;

    var config = new Config({
      project: project,
      environment: options.environment
    });

    var IndexAdapter = registry.indexAdapter();
    var adapter = new IndexAdapter({
      appId: project.name(),
      connection: config.index
    });

    var message;
    return adapter.listVersions().then(function(versions){
      message = versions.map(function(verObj){
        return verObj.key;
      }).join('\n');

      ui.write(message);
    });
  }
});
