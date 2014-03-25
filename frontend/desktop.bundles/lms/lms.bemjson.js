({
    block: 'b-page',
    title: 'template',
    head: [
        { elem: 'css', url: '_lms.css', ie: false },
        { elem: 'css', url: '_lms.ie8.css', ie: 8 },
        { elem: 'css', url: '_lms.ie9.css', ie: 9 }
    ],
    content: [
        {
            block: 'b-foot',
            content: {
                elem: 'layout',
                content: [
                    { elem: 'layout-column' },
                    {
                        elem: 'layout-column',
                        elemMods: { type : 'center' },
                        content: [
                        ]
                    },
                    {
                        elem: 'layout-column',
                        elemMods: { type: 'penultima' }
                    },
                    {
                        elem: 'layout-column',
                        elemMods: { type: 'right' },
                        content: [
                            {
                                block: 'b-copyright',
                                start: 2013
                            }
                        ]
                    }
                ]
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url: '_lms.js' }
    ]
})