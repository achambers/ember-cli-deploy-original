'use strict';

module.exports = {
  name: 'activate',
  description: 'Activate a deployed version of index.html',
  works: 'insideProject',

  anonymousOptions: [
    '<key>'
  ],

  availableOptions: [
    { name: 'redis-host', type: String, default: '127.0.0.1' },
    { name: 'redis-port', type: String, default: '6379' },
    { name: 'redis-password', type: String }
  ],

  run: function(commandOptions, rawArgs) {
    console.log(commandOptions);
    console.log(rawArgs);
    console.log('Run');
  }
};

