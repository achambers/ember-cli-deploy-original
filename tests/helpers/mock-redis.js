'use strict';

var MockClient = function(port, host, options, throwError) {
  this._port = port;
  this._host = host;
  this._options = options;
  this._events = {};
  this._throwError = throwError;
};

MockClient.prototype.port = function() {
  return this._port;
};

MockClient.prototype.host = function() {
  return this._host;
};

MockClient.prototype.options = function() {
  return this._options;
};

MockClient.prototype.on = function(type, callback) {
  this._events[type] = callback;
};

MockClient.prototype.set = function(key, data, callback) {
  if (this._throwError) {
    callback('error occured');
  } else {
    callback(null, 'OK');
  }
};

var MockRedis = function() {
  this._client = undefined;
  this._throwError = false;
};

MockRedis.prototype.createClient = function(port, host, options) {
  this._client = new MockClient(port, host, options, this._throwError);

  return this._client;
};

MockRedis.prototype.client = function() {
  return this._client;
}

MockRedis.prototype.throwError = function(throwError) {
  this._throwError = !!throwError;
};

module.exports= MockRedis;

