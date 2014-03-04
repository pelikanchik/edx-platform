var environ = require('bem-environ');

exports.baseLevelPath = require.resolve('bem/lib/levels/project');

exports.getTechs = function() {

    return require('bem').util.extend(this.__base() || {}, {
        blocks: 'level-proto',
        bundles: 'level-proto'
    });

};