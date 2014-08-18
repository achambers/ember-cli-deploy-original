'use strict';

module.exports = {
  name: 'deploy:assets',
  description: 'Deploys assets to S3',
  works: 'insideProject',

  validateAndRun: function(rawArgs) {
    console.log('Validate and run');
  },

  run: function() {
    console.log('Run');
  }
};
