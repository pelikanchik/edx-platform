var BEM = require('bem');

exports.baseLevelPath = require.resolve('../../.bem/levels/bundles.js');

exports.getConfig = function() {

    return BEM.util.extend(this.__base() || {}, {
        bundleBuildLevels: this.resolvePaths([
            '../../libs/bem-bl/blocks-common',
            '../../libs/bem-bl/blocks-desktop',
            '../../libs/romochka/blocks-common',
            '../../libs/romochka/blocks-desktop',
            '../../common.blocks',
            '../../desktop.blocks'
        ])
    });

};
