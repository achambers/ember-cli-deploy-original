//https://github.com/stefanpenner/ember-cli/blob/0410d31c1d06e0202a851fcddd46424b3f5f6a77/lib/errors/silent.js

'use strict';

function SilentError(message) {
  this.name     = 'SilentError';
  this.message  = message;

  if (process.env.EMBER_VERBOSE_ERRORS === 'true') {
      this.stack = (new Error()).stack;
      this.suppressStacktrace = false;
    } else {
        this.suppressStacktrace = true;
      }
}

SilentError.prototype = Error.prototype;
SilentError.prototype.constructor = SilentError;

module.exports = SilentError;
