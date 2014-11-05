# ember-cli-deploy

> An Ember-CLI addon for lightening fast deployment of applications

## Motivation

This addon was inspired by [Luke Melia][1]'s RailsConf 2014 presentation - [Lightning Fast Deployment of Your Rails-backed JavaScript app][2].

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

## Configuration

Any of the command line options passed in to the following commands can alternatively be either exported as environment variables or specified in a `.env` file.

Simply change the option flag to be `UPPERCASED` and `UNDER_SCORED`, eg:

`--redis-host` would be specified as `REDIS_HOST`

## *ember deploy:assets*

This command is responsible for pushing your assets to an S3 bucket.

### Usage

```shell
ember deploy:assets <options>
```

### Options

#### --dist-dir (optional)
Default: `dist`

Should point to the `dist` directory that contains the built assets.

#### --s3-access-key-id (required)

The access token that has permission to push to your S3 bucket.

#### --s3-secret-access-key (required)

The token secret that belongs to the `s3-access-key-id`.

#### --s3-bucket-name (required)

The S3 bucket to push assets to.

#### --s3-region (optional)
Default: `us-east-1`

#### --file-pattern (optional)

A glob file pattern that specifies the files to be uploaded to S3.

Default: `**/*.{js,css,png,gif,jpg}`

The region that your S3 bucket sits in.

## *ember deploy:index*

This command is responsible for pushing your index.html file to a Redis instance.

### Usage

```shell
ember deploy:index <options>
```

### Options

#### --dist-dir (optional)
Default: `dist`

Should point to the dist directory that contains the built index.html.

#### --redis-host (required)

The host server of the Redis instance to deploy the index.html to.

#### --redis-port (required)

The host port of the Redis instance to deploy the index.html to.

#### --redis-password (optional)
Default: `null`

The password of the Redis instance to deploy the index.html to.

## *ember activate*

This command is responsible for activating a deployed index.html file.  The process of activating the index.html file will update the `index:current` entry in Redis to be the index.html file for the specified `<key>`.

### Usage

```shell
ember activate <key> <options>
```

### Arguments

#### \<key\> (required)

This should be the short commit hash for the a previously deployed index.html file.

### Options

#### --redis-host (required)

The host server of the Redis instance to deploy the index.html to.

#### --redis-port (required)

The host port of the Redis instance to deploy the index.html to.

#### --redis-password (optional)
Default: `null`

The password of the Redis instance to deploy the index.html to.

## Tests

To run the tests, run:

```shell
npm test
```

## Honourable Mentions

The following sites have contributed in some way, shape or form in the creation of this addon.

- [Framework agnostic, fast zero-downtime Javascript app deployment][3]
- [Lightning Fast Deployments With Rails (in the Wild).][4]

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Maintainers

- Aaron Chambers (achambers@gmail.com)

## Release History
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
