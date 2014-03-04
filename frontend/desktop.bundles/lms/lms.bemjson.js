({
    block: 'b-page',
    title: 'Привет!',
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
                            {
                                block: 'b-lang-switcher',
                                lang: { code: 'ru', name: 'Ru' },
                                direction: 'up',
                                content: [
                                    {
                                        elem: 'lang',
                                        lang: { code: 'by', name: 'By' },
                                        url: '?lang=by'
                                    },
                                    {
                                        elem: 'lang',
                                        lang: { code: 'kz', name: 'Kz' },
                                        url: '?lang=kz'
                                    },
                                    {
                                        elem: 'lang',
                                        lang: { code: 'ua', name: 'Ua' },
                                        url: '?lang=ua'
                                    },
                                    {
                                        elem: 'lang',
                                        lang: { code: 'en', name: 'En' },
                                        url: '?lang=en'
                                    },
                                    {
                                        elem: 'lang',
                                        lang: { code: 'ru', name: 'Ru' },
                                        url: '?lang=ru',
                                        elemMods: { selected: 'yes' }
                                    }
                                ]
                            }
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
                                start: 2008
                            }
                        ]
                    }
                ]
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url: '_lms.ru.js' }
    ]
})