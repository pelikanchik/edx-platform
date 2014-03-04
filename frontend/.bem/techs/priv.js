var BEM = require('bem');

exports.baseTechPath = BEM.require.resolve('./techs/v2/js.js');
exports.techMixin = {
    getBuildSuffixesMap: function() {
        return {
            'priv.js': ['priv.js']
        };
    },

    getBuildResult: function(files, suffix, output, opts) {
        return this.__base.apply(this, arguments)
            .then(function(res) {
                res.unshift('var blocks = module.exports;');
                return res;
            });
    }
};
