var Template = require('bem/lib/template');

exports.techModule = module;

exports.newFileContent = function (vars) {

    return Template.process([
        "({",
        "    block: 'b-page',",
        "    title: '{{bemBlockName}}',",
        "    head: [",
        "        { elem: 'css', url: '_{{bemBlockName}}.css', ie: false },",
        "        { elem: 'css', url: '_{{bemBlockName}}.ie8.css', ie: 8 },",
        "        { elem: 'css', url: '_{{bemBlockName}}.ie9.css', ie: 9 }",
        "    ],",
        "    content: [",
        "        'block content',",
        "        { block: 'i-jquery', mods: { version: '1.8.3' },",
        "        { elem: 'js', url:'_{{bemBlockName}}.js' }",
        "    ]",
        "})"], vars);
};