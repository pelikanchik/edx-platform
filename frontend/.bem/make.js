/*global MAKE:true */

var environ = require('bem-environ')(__dirname);
environ.extendMake(MAKE);

process.env.BEM_I18N_LANGS = 'ru';
//process.env.YENV = 'production';

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries : [
        'bem-bl @ 0.3',
        'romochka @ 2.10.24'
    ]

});

MAKE.decl('BundleNode', {

    getTechs: function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'priv.js',
            'bemhtml',
            'css',
            'ie.css',
            'ie8.css',
            'ie9.css',
            'i18n',
            'i18n.js+bemhtml',
            'i18n.html'
        ];
    },

    'create-i18n.js-optimizer-node': function(tech, sourceNode, bundleNode) {
        return this.createBorschikOptimizerNode('js', sourceNode, bundleNode);
    },

    'create-i18n.js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {
        return this['create-js-optimizer-node'].apply(this, arguments);
    },

    'create-i18n.html-node': function(tech, bundleNode, magicNode) {
        return this['create-html-node'].apply(this, arguments);
    }

});
