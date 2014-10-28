'use strict';

var MockClient = function(port, host, options, throwSetError, throwGetError, getData) {
  this._port = port;
  this._host = host;
  this._options = options;
  this._events = {};
  this._throwSetError = throwSetError;
  this._throwGetError = throwGetError;
  this._getData = getData;
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
  if (this._throwSetError) {
    callback('error occured');
  } else {
    callback(null, 'OK');
  }
};

MockClient.prototype.get = function(key, callback) {
  if (this._throwGetError) {
    callback('error occured');
  } else {
    callback(null, this._getData);
  }
};

var MockRedis = function() {
  this._client = undefined;
  this._throwSetError = false;
  this._throwGetError = false;
  this._getData = 'hello';
};

MockRedis.prototype.createClient = function(port, host, options) {
  this._client = new MockClient(port, host, options, this._throwSetError, this._throwGetError, this._getData);

  return this._client;
};

MockRedis.prototype.client = function() {
  return this._client;
}

MockRedis.prototype.throwSetError = function(throwError) {
  this._throwSetError = !!throwError;
};

MockRedis.prototype.throwGetError = function(throwError) {
  this._throwGetError = !!throwError;
};

MockRedis.prototype.returnData = function(data) {
  this._getData = data;
};

module.exports= MockRedis;

