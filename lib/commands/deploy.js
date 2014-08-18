'use strict';

module.exports = {
  name: 'deploy',
  description: 'Deploys assets to S3 and index.html to Redis',
  works: 'insideProject',

  availableOptions: [
    { name: 'aws-key', type: String },
    { name: 'aws-secret', type: String },
    { name: 'aws-bucket', type: String },
    { name: 'aws-region', type: String, default: 'us-east-1' },
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

