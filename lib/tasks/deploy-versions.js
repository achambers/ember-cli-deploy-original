var Task = require('ember-cli/lib/models/task');
var Config = require('../utilities/configuration');

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
    var self = this;
    return adapter.listVersions().then(function(versions){
      message = versions.map(function(verObj){
        return verObj.key;
      }).join('\n');

      ui.write(self._buildMessage(versions.length, message));
    });
  },

  _buildMessage: function(versionsCount, message){
    var result = 'The previous ';

    return result + versionsCount + " versions uploaded:\n" + message;
  }
});
