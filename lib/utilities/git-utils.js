'use strict';

var exec = require('exec');
var Promise = require('../ext/promise');
var SilentError = require('../errors/silent');

var spawn = require('child_process').spawn;
var git = spawn('git', ['rev-parse', '--short=10', 'HEAD'], {cwd: root});
var isWin = /^win/.test(process.platform);

var GitUtils = function (options) {
    this.project = options.project;
};

GitUtils.prototype.hash = function () {
    var root = this.project.root;

    return new Promise(function (resolve, reject) {
        if (isWin) {
            git.stdout.on('data', function(data){
                resolve(data.toString().replace(/\n/g, '').trim());
            })
        } else {
            exec('git rev-parse --short=10 HEAD', {cwd: root}, function (error, out, code) {
                if (error) {
                    reject(new SilientError(error));
                }

                resolve(out.trim());
            });

        }
    });
};

GitUtils.prototype.branch = function () {
    var root = this.project.root;

    return new Promise(function (resolve, reject) {
        if (isWin) {
            git.stdout.on('data', function(data){
                resolve(data.toString().replace(/\n/g, '').trim());
            })
        }else{
            exec('git rev-parse --abbrev-ref HEAD', {cwd: root}, function (error, out, code) {
                if (error) {
                    reject(new SilientError(error));
                }

                resolve(out.trim());
            });

        }
    });
};

module.exports = GitUtils;
