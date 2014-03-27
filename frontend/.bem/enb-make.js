module.exports = function(config) {
    config.node('desktop.bundles/lms');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            new (require('enb/techs/file-provider'))({ target: '?.bemjson.js' }),
            new (require('enb/techs/bemdecl-from-bemjson'))(),
            new (require('enb/techs/levels'))({ levels: getLevels(config) }),
            new (require('enb/techs/deps-old'))(),
            new (require('enb/techs/files'))(),
            new (require('enb/techs/js'))(),
            new (require('enb/techs/css'))(),
            new (require('enb/techs/css-ie'))(),
            new (require('enb/techs/css-ie6'))(),
            new (require('enb/techs/css-ie7'))(),
            new (require('enb/techs/css-ie8'))(),
            new (require('enb/techs/css-ie9'))(),
            new (require('enb-bemhtml/techs/bemhtml'))(),
            new (require('enb/techs/html-from-bemjson'))()
        ]);
        nodeConfig.addTargets([
            '?.html', '_?.js', '_?.css', '_?.ie.css', '_?.ie6.css', '_?.ie7.css', '_?.ie8.css', '_?.ie9.css'
        ]);
    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.js', destTarget: '_?.js' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.css', destTarget: '_?.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie.css', destTarget: '_?.ie.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css' })
            ]);
        });
    });
    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/borschik'))({ sourceTarget: '?.js', destTarget: '_?.js', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.css', destTarget: '_?.css', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie.css', destTarget: '_?.ie.css', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css', minify:true, freeze: true  }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css', minify:true, freeze: true  })
            ]);
        });
    });
};

function getLevels(config) {
    return [
        {"path":".bem/lib/lego/bem-bl/blocks-common","check":false},
        {"path":".bem/lib/lego/bem-bl/blocks-desktop","check":false},
        {"path":".bem/lib/lego/blocks-common","check":false},
        {"path":".bem/lib/lego/blocks-desktop","check":false},
        {"path":".bem/lib/bem-components/common.blocks","check":false},
        {"path":".bem/lib/bem-components/desktop.blocks","check":false},
        {"path":".bem/lib/islands-components/common.blocks","check":false},
        {"path":".bem/lib/islands-components/desktop.blocks","check":false},
        {"path":".bem/lib/islands-page/common.blocks","check":false},
        {"path":".bem/lib/islands-page/desktop.blocks","check":false},
        {"path":".bem/lib/islands-search/common.blocks","check":false},
        {"path":".bem/lib/islands-search/desktop.blocks","check":false},
        {"path":".bem/lib/islands-services/common.blocks","check":false},
        {"path":".bem/lib/islands-services/desktop.blocks","check":false},
        {"path":".bem/lib/islands-user/common.blocks","check":false},
        {"path":".bem/lib/islands-user/desktop.blocks","check":false},
        //{"path":"common.blocks","check":true},
        {"path":"desktop.blocks","check":true}
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
