<hr>
# BREAKING NEWS

This repository is now **deprecated**.

`ember-cli-deploy` and `ember-deploy` are currently in the process of collaborating and merging into the official Ember CLI deployment tool. For all your future Ember CLI deployment needs please look to [ember-cli/ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy).

For existing users of this repo, a migration path will be available shortly.
<hr>

# ember-cli-deploy

> An Ember-CLI addon for lightning fast deployment of applications

## Motivation

This addon was inspired by [Luke Melia][1]'s RailsConf 2014 presentation - [Lightning Fast Deployment of Your Rails-backed JavaScript app][2].

If you haven't seen this presentation already, do yourself a favour and check it out.  If you can't be bothered, the premise of the presentation is about rethinking about where your app and assets are served from.  By serving your index.html from an in-memory store such as Redis and your assets from a CDN such as S3/Cloudfront you can achieve super quick deployment times along with great caching and speed.  Not to mention you will also be able to deploy any branch you like to a production like environment and access it from your production URL via a query param.

[ember-cli-deploy][9] was recently referenced in [ember-cli 101][10], the new book by [@abuiles][11], as the go to library for implementing Luke's ideas.

## Synopsis

This plugin is designed to aid in the deployment workflow of an [Ember CLI][5] application. The workflow is designed to follow on from a successful `ember build` command and runs as follows:

- Create an [Ember CLI][5] build
- Deploy assets to S3
- Deploy index.html to Redis
- (At some point afterwards) Activate a released index.html to be the current live version

## Installation

From within your [Ember CLI][5] application, run:

```shell
npm install --save-dev ember-cli-deploy
```

## Commands

[ember-cli-deploy][9] currently supports the following commands:

- `ember deploy:assets` - Pushes your assets to a static file host.  Currently only S3 is supported but more will be supported in the future
- `ember deploy:index` - Pushes your index.html file to an in memory store.  Currently only Redis is supported.
- `ember activate <key>` - Marks the index.html file for the specified key as the currently active file to be served.
- `ember deploy` - Performs all three of the steps above.
- `ember deploy:versions` - List the previous versions deployed.

Any of these commands can be passed an optional `--environment` argument which will specify which configuration to use.  If no `--environment` argument is specified it will default to `--environment development`

## Configuration

[ember-cli-deploy][9] will look for a configuration file in your app's `config/deploy` directory with a name based on the `--environment` passed in to the command.  You must specify a config file for each environment you would like to deploy to.  For instance:

Running `ember deploy:assets --environment production` will look for a config file called `config/deploy/production.js`

The configuration file is used to specify the parameters such as the credentials for the asset file host and in memory store.

The configuaration file can specify the following fields:

```javascript
module.exports = {
  assets: {
    accessKeyId: 'some-access-key', //your S3 access token. (required)
    secretAccessKey: 'some-secret', //your S3 secret. (required)
    bucket: 'my-bucket', //your S3 bucket where the assets will be stored. (required)
    region: 'eu-west-1', //the region your S3 bucket lives in. (options, default: 'us-east-1')
    filePattern: '**/*.{js,css}' //the filePattern to search for assets. (optional, default: '**/*.{js,css,png,gif,jpg}')
  },

  index: {
    host: 'jack.redistogo.com', //the redis host where your index.html is stored. (required)
    port: '6379', //the redis port. (required)
    password: 'some-password' //the redis password. (optional, default: null)
  }
};
```
You will also need to update your `Brocfile.js` so that the asset host is prepended to the asset urls that ember writes to `index.html`:

```
var app = new EmberApp({
  fingerprint: {
    prepend: 'https://s3-us-west-1.amazonaws.com/my-bucket/'
  }
});
```

## Adapters

[ember-cli-deploy][9] supports the ability for users to choose where they would like to upload their `index.html` and `assets` to.  Luke's [presentation][2] talked about using `Redis` as the in-memory store for the index.html and `S3` for the assets.  However, this doesn't have to be the case.  Through the use of `adapters`, the users of [ember-cli-deploy][9] can choose which backend they would prefer to use.

[ember-cli-deploy][9] will support the concept of two types of adapters, `index-adapter`s and `asset-adapter`s.

### Using an adapter

As adapters are just [ember-cli addons][14], [ember-cli-deploy][9] will automatically detect when they are installed in the parent [Ember CLI][5] project.  To install an adapter, run the following from your [Ember CLI][5] application:

```shell
npm install --save-dev <ember-cli-deploy adapter name>
```

If multiple adapters are installed, [ember-cli-deploy][9] will choose the first one it finds.

### Contributing and creating an adapter

Adapters are simply [ember-cli addons][14] that expose an `adapter` property which returns an adapter class that conforms to the expected interface for either an `index-adapter` or `asset-adapter`.

An example of an adapter addon is [ember-cli-deploy-redis-index-adapter][15]:

```javascript
//index.js

var RedisIndexAdapter = require('./lib/redis-index-adapter');

function EmberCLIDeployRedisIndexAdapter() {
  this.name = 'ember-cli-deploy-redis-index-adapter';
  this.adapter = RedisIndexAdapter;
}

module.exports = EmberCLIDeployRedisIndexAdapter;
```

### Index Adapters

The purpose of the `index-adapter` is to upload the `index.html` to an in-memory store.  An example of such an adapter is as follows:

```javascript
function Adapter(options) {
  this.appId: options.appId;
  this.connection: options.connection
}

Adapter.prototype.upload = function(data) {/* some logic to upload index.html*/};

Adapter.type = 'index-adapter';
```

#### constructor

When constructing an instance of an `index-adatper`, [ember-cli-deploy][9] will initialise it with an `appId` and the `connection` details for the in-memory store, as specified in the `index` property of the current [configuration][16]. An example of this is as follows:

```javascript
// lib/tasks/deploy-index.js

var adapter = new IndexAdapter({
  appId: this.project.name(),
  connection: config.index
});
```

#### Adapter.type (required)

This tells [ember-cli-deploy][9] what type of adapter it is and is a required property.  For Index Adapters, `type` must be set to `index-adapter`.

#### Adapter.prototype.upload(data) (required)

This function must do the actual work.  It must upload the `data` passed to it and return a Promise resolving to the key that the data was uploaded with.

#### Adapter.prototype.setCurrent(key) (required)

This function must set the specified `key` as the current version.

#### Adapter.prototype.listVersions(count) (required)

This function must return an array of the keys of the previously deployed versions.

### Asset Adapters

We haven't quite implemented this feature yet but it isn't far away.

### Current Adapters

The [ember-cli-deploy][9] adapters that currently exist are as follows:

- [ember-cli-deploy-redis-index-adapter][15]

## Serving index.html

A super simple way to serve the index.html from Redis is to spin up your own instance of [achambers/fuzzy-wookie][12]

Simply click the 'Deploy to Heroku' button on the README and you will be creating your own instance on Heroku, complete with Redis addons in seconds.

Once this instance is up and running, put the details of the Redis server into your [ember-cli-deploy][9] configuration and you'll be ready to deploy.

To get the Redis configuration details, run the following command in your console:

```bash
heroku config --app my-app | grep REDISTOGO_URL
```

## Tests

To run the tests, run:

```shell
npm test
```

## Honourable Mentions

The following sites have contributed in some way, shape or form in the creation of this addon.

- [Framework agnostic, fast zero-downtime Javascript app deployment][3]
- [Lightning Fast Deployments With Rails (in the Wild).][4]
- [ember-cli 101][10] by [@abuiles][11]

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Maintainers

- Aaron Chambers (achambers@gmail.com)

## Release History
- [v0.0.6][18]
- [v0.0.5][17]
- [v0.0.4][13]
- [v0.0.3][8]
- [v0.0.2][7]
- [v0.0.1][6]

[1]: http://www.lukemelia.com "Luke Melia"
[2]: http://www.confreaks.com/videos/3324-railsconf-lightning-fast-deployment-of-your-rails-backed-javascript-app "Lightning Fast Deployment of Your Rails-backed JavaScript app"
[3]: https://medium.com/@feifanw/framework-agnostic-fast-zero-downtime-javascript-app-deployment-df40cf105622 "Framework agnostic, fast zero-downtime Javascript app deployment"
[4]: http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/ "Lightning Fast Deployments With Rails (in the Wild)."
[5]: http://ember-cli.com "Ember CLI"
[6]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.1 "Release v0.0.1"
[7]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.2 "Release v0.0.2"
[8]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.3 "Release v0.0.3"
[9]: https://github.com/achambers/ember-cli-deploy "ember-cli-deploy"
[10]: https://leanpub.com/ember-cli-101 "ember-cli 101"
[11]: https://github.com/abuiles "Adolfo Builes"
[12]: https://github.com/achambers/fuzzy-wookie "fuzzy-wookie - ember-cli-deploy server"
[13]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.4 "Release v0.0.4"
[14]: http://www.ember-cli.com/#create-addon "Ember CLI addons"
[15]: https://github.com/achambers/ember-cli-deploy-redis-index-adapter "ember-cli-deploy-redis-index-adapter"
[16]: https://github.com/achambers/ember-cli-deploy#configuration "ember-cli-deploy configuration"
[17]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.5 "Release v0.0.5"
[18]: https://github.com/achambers/ember-cli-deploy/releases/tag/v0.0.6 "Release v0.0.6"
