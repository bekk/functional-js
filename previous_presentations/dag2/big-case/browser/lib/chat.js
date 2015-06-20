
var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var humanize = require('humanize');
var config = require('../config');
var toArray = require('lodash-node/modern/collections/toArray');

var reemit = function (client, type) {
  return function () {
    var args = toArray(arguments);
    args.unshift(type)
    client.emit.apply(client, args);
  };
};

var Chat = function () {
  this.connected = false;
  var client = this;
  client.socket = io(config.ws);

  client.socket.on('connect', function(){
    client.connected = true;
    client.emit('connected');
  });
  client.socket.on('message', reemit(client, 'message'));
  client.socket.on('part', reemit(client, 'part'));
  client.socket.on('join', reemit(client, 'join'));
  return client;
};
inherits(Chat, EventEmitter);

Chat.prototype.join = function (username) {
  if (!this.connected) {
    this.emit('error', new Error('Not connected yet.'));
    return this;
  }
  if (this.username) {
    this.emit('error', new Error('Already connected and logged in as ' + this.username));
    return this;
  }

  this.username = username;
  this.socket.emit('join', username);
  this.emit('join', username);
  return this;
};

Chat.prototype.message = function (obj) {
  if (!this.connected || !this.username) {
    this.emit('error', new Error('Not connected yet. Join by using /join <username>'));
    return this;
  }
  if (!obj.message) {
    this.emit('error', new Error('No message given.'));
    return this;
  }
  var data = {
    username: this.username,
    message: obj.message,
    picture: obj.picture,
    time: humanize.date('d.m.Y - H:i:s')
  };
  this.socket.emit('message', data);
  this.emit('message', data);
  return this;
};

var chat = module.exports = new Chat();