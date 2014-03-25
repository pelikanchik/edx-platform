([
{
    block: 'i-global',
    params: {
        'index': true,
        'lang' : 'uk',
        'passport-host': 'my-passport.com'
    }
},
{
    block: 'b-page',
    title: 'заголовок',
    head: [
        {
            elem: 'css',
            url: '_10_i-global_params.css'
        },
        { elem: 'css', url: '_10_i-global_params.ie6.css', ie: 'IE 6' },
        { elem: 'css', url: '_10_i-global_params.ie7.css', ie: 'IE 7' },
        { elem: 'css', url: '_10_i-global_params.ie8.css', ie: 'IE 8' },
        { elem: 'css', url: '_10_i-global_params.ie9.css', ie: 'IE 9' },
        { block: 'i-jquery', elem: 'core' },
        {
            elem: 'js',
            url: '_10_i-global_params.js'
        }
    ],
    content: [ ]
}
])
