# ember-cli-deploy

> An Ember-CLI addon for lightening fast deployment of applications

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

Any of these commands can be passed an optional `--environment` argument which will specify which configuration to use.  If no `--environment` argument is specified it will default to `--environment development`

## Configuration

[ember-cli-deploy][9] will look for a configuration file in your app's `config/deploy` directory with a name based on the `--environment` passed in to the command.  You must specify a config file for each environment you would like to deploy to.  For instance:

Running `ember deploy:assets --environment production` will look for a config file called `config/deploy/production.js`

The configuration file is used to specify the parameters such as the credentials for the asset file host and in memory store.

The configuaration file can specify the following fields:

```javascript
module.exports = {
  distDir: 'dist', //the dir where your app files are build to. (optional, default: 'dist')
  
  assets: {
    accessKeyId: 'some-access-key', //your S3 access token. (required)
    secretAccessKey: 'some-secret', //your S3 secret. (required)
    bucket: 'my-bucket', //your S3 bucket where the assets will be stored. (required)
    region: 'eu-west-1', //the region your S3 bucket lives in. (options, default: 'us-east-1')
    filePattern: '**/*.{js,css}' //the filePattern to search for assets. (optional, default: '**.*{js,css,png,gif,jpg}')
  },
  
  index: {
    host: 'jack.redistogo.com', //the redis host where your index.html is stored. (required)
    port: '6379', //the redis port. (required)
    password: 'some-password' //the redis password. (optional, default: null)
  }
};
```

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
