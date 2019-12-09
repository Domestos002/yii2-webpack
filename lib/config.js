const path = require('path');
const merge = require('webpack-merge');
const _ = require('lodash');
const entry = require('./entry');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = class Config {
  constructor (config = {}) {
    this.config = config;
    this.settings = _.extend(require('../lib/defaultValues'), this.constructor.load('./yii2-webpack-settings.json'))
  }

  mergeTo (config) {
    this.config = merge.smart(this.config, config);
    return this
  }

  addHtmlPluginToEntries () {
    this.mergeTo({
      plugins: Object.keys(this.config.entry).reduce((result, entryName) => {
        let currentEntry = new entry(entryName, this.settings);
        result.push(currentEntry.getHtmlPluginToEntry());
        return result
      }, [])
    })
    this.mergeTo({
      plugins: [
        new SpriteLoaderPlugin({plainSprite: true}),
        new MiniCssExtractPlugin({
          filename: 'css/[name].[hash].css',
          chunkFilename: 'css/[id].[hash].css',
        })
      ]
    });

    return this
  }

  static load (configPath) {
    try {
      return require(path.resolve(process.cwd(), configPath))
    }
    catch (e) {
      return {}
    }
  }
};
