/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__inherit/i-jquery__inherit.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__identify/i-jquery__identify.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__is-empty-object/i-jquery__is-empty-object.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__debounce/i-jquery__debounce.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__observable/i-jquery__observable.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-bem/i-bem.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-ecma/__object/i-ecma__object.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-ecma/__array/i-ecma__array.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-ecma/__function/i-ecma__function.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-bem/__internal/i-bem__internal.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__cookie/i-jquery__cookie.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__decodeuri/i-jquery__decodeuri.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/i-bem/html/i-bem__html.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-ecma/__json/i-ecma__json.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-bem/__dom/i-bem__dom.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-ecma/__string/i-ecma__string.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-common/check-session/i-common__check-session.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-global/i-global.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-counter/i-counter.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-common/cookie/i-common__cookie.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-common/init/i-common__init.js*/;
/*borschik:include:../../libs/romochka/blocks-common/i-common/i-common.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-bem/__dom/_init/i-bem__dom_init_auto.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/i-oframebust/i-oframebust.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/i-oframebust/_type/i-oframebust_type_referrer.js*/;
/*borschik:include:../../libs/bem-bl/blocks-common/i-jquery/__leftclick/i-jquery__leftclick.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-link/b-link.js*/;
/*borschik:include:../../libs/bem-bl/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-dropdowna/b-dropdowna.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-popupa/b-popupa.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/i-popup/i-popup.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/i-popup/_autoclosable/i-popup_autoclosable_yes.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-dropdowna/switcher/b-dropdowna__switcher.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-lang-switcher/b-lang-switcher.js*/;
/*borschik:include:../../desktop.blocks/b-lang-switcher/b-lang-switcher.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-icon/b-icon.js*/;
/*borschik:include:../../libs/romochka/blocks-desktop/b-menu/_is-bem/b-menu_is-bem_yes.js*/;


/* global BEM, i18n */
(function(global_, bem_, undefined) {

// Check if BEM.I18N was already initialized
if(typeof bem_.I18N === 'function' && bem_.I18N._proto) {
    return bem_.I18N;
}

/**
 * Support tanker-like syntax of keys in `i-bem__i18n`
 * @example
 *  i18n['prj']['keyset']['key'](params)
 */
if(typeof i18n === 'undefined') {
    /* jshint -W020 */
    i18n = {};
    /* jshint +W020 */
}

/* jshint -W020 */
BEM = bem_;
/* jshint +W020 */

var MOD_DELIM = '_',
    ELEM_DELIM = '__',
    DEFAULT_LANG = 'ru',
    cache = {},
    // {String[]} A stack used for restoring context of dynamic keysets
    stack = [],
    debug = false,
    // @see http://whattheheadsaid.com/2011/04/internet-explorer-9s-problematic-console-object
    hasConsole = typeof console !== 'undefined' && typeof console.log === 'function';

function log() {
    if(debug && hasConsole) {
        console.log.apply(console, arguments);
    }
}

function bemName(decl) {
    typeof decl === 'string' && (decl = { block: decl });

    return decl.block +
        (decl.elem ? (ELEM_DELIM + decl.elem) : '') +
        (decl.modName ? MOD_DELIM + decl.modName + MOD_DELIM + decl.modVal : '');
}

function bemParse(name) {
    var bemitem = {};

    name.split(ELEM_DELIM).forEach(function(item, i) {
        var keys = [ i ? 'elem' : 'block', 'mod', 'val' ];

        item.split(MOD_DELIM).forEach(function(part, j) {
            bemitem[keys[j]] = part;
        });
    });

    return bemitem;
}

function _pushStack(name) {
    if(!name) return false;
    return stack.push(name);
}

function _popStack() {
    return stack.length && stack.pop();
}


/**
 * @constructor
 */
function _i18n() {
    this._lang = '';
    this._prj = 'lego'; // FIXME: bem-bl?
    this._keyset = '';
    this._key = '';
}

_i18n.prototype = {

    lang : function(name) {
        this._lang = name;
        return this;
    },

    project : function(name) {
        this._prj = name;
        return this;
    },

    keyset : function(name, saveCtx) {
        saveCtx && _pushStack(this._keyset);

        this._keyset = bemName(name);
        return this;
    },

    key : function(name) {
        this._key = name;
        return this;
    },

    /**
     * FIXME: Move legacy-syntax support into separat method
     * @param {Object|Function} v
     */
    decl : function(v) {
        var bemitem = bemParse(this._keyset),
            // tanker legacy syntax
            prj = bemitem.block === 'i-tanker' ? 'tanker' : this._prj,
            keyset = bemitem.elem || this._keyset,
            key = this._key;

        prj = i18n[prj] || (i18n[prj] = {});
        keyset = prj[keyset] || (prj[keyset] = {});
        keyset[key] = typeof v === 'function' ? v : (function(p) { return (v); });

        // `BEM.I18N` syntax
        var l = cache[this._lang] || (cache[this._lang] = {}),
            k = l[this._keyset] || (l[this._keyset] = {});

        k[key] = v;
    },

    val : function(params, ctx) {
        var value = cache[this._lang] && cache[this._lang][this._keyset],
            debugString = 'keyset: ' + this._keyset + ' key: ' + this._key + ' (lang: ' + this._lang + ')';

        if(!value) {
            log('[I18N_NO_KEYSET] %s', debugString);
            return '';
        }

        value = value[this._key];

        var valtype = typeof value;
        if(valtype === 'undefined') {
            log("[I18N_NO_VALUE] %s", debugString);
            return '';
        }

        if(valtype === 'string') {
            return value;
        }

        ctx || (ctx = this);
        // TODO: try/catch
        return value.call(ctx, params);
    },

    _cache : function() { return cache; }

};

/**
 * @namespace
 * @lends BEM.I18N
 */
bem_.I18N = (function(base) {

    /**
     * Shortcut to get key value
     *
     * @param {String|Object} keyset
     * @param {String} key
     * @param {Object} [params]
     * @returns {String}
     */
    var klass = function(keyset, key, params) {
        return klass.keyset(keyset).key(key, params);
    };

    klass._proto = base;

    /**
     * @param {String} name
     * @returns {BEM.I18N}
     */
    klass.project = function(name) {
        this._proto.project(name);
        return this;
    };

    /**
     * @param {String} name
     * @returns {BEM.I18N}
     */
    klass.keyset = function(name) {
        this._proto.keyset(name, true);
        return this;
    };

    /**
     * @param {String} name Key name
     * @param {Object} params
     * @returns {String}
     */
    klass.key = function(name, params) {
        var proto = this._proto,
            result,
            ksetRestored;

        proto.lang(this._lang).key(name);

        // TODO: kiss
        result = proto.val.call(proto, params, klass);

        // restoring keyset's context
        // NOTE: should not save current ctx, `saveCtx = false`
        ksetRestored = _popStack();
        ksetRestored && proto.keyset(ksetRestored, false);

        return result;
    };

    /**
     * Declaration of translations
     *
     * @param {String|Object} bemitem
     * @param {Object} keysets
     * @param {Object} [params] declaration params
     * @returns {BEM.I18N}
     */
    klass.decl = function(bemitem, keysets, params) {
        var proto = this._proto,
            k;

        params || (params = {});
        params.lang && proto.lang(params.lang);

        proto.keyset(bemitem);

        for(k in keysets) {
            if(keysets.hasOwnProperty(k)) {
                proto.key(k).decl(keysets[k]);
            }
        }

        return this;
    };

    /**
     * Get/set current language
     *
     * @param {String} [lang]
     * @returns {String}
     */
    klass.lang = function(lang) {
        typeof lang !== 'undefined' && (this._lang = lang);
        return this._lang;
    };

    klass.debug = function(flag) {
        debug = !!flag;
    };

    klass.lang(DEFAULT_LANG);

    return klass;

}(new _i18n()));

})(this, typeof BEM === 'undefined' ? {} : BEM);


BEM.I18N.decl('b-copyright', {"link": function(params) { return 'ООО «' + params["content"] + '»' },"yandex": 'Яндекс'}, {
"lang": "ru"
});

BEM.I18N.decl('b-foot', {"about": 'О компании',"advert": 'Реклама',"agreement": 'Пользовательское соглашение',"beta": 'β-версия',"copyright-notice": '',"design": 'Дизайн',"design-artlebedev": 'Студия Артемия Лебедева',"design-artlebedev-url": 'http:\/\/www.artlebedev.ru',"mobile": 'Мобильная версия',"privacy-policy": '',"services-button-value": 'Перейти',"stat": 'Статистика',"terms-of-service": '',"termsofuse": 'Лицензия на поиск',"vacancies": 'Вакансии',"yandex-is-local": 'Яндекс локален',"yandex-is-not-local": 'Как сделать Яндекс локальным'}, {
"lang": "ru"
});

BEM.I18N.decl('b-lang-switcher', {"all": 'ещё'}, {
"lang": "ru"
});

BEM.I18N.decl('i-services', {"404": '404',"adresa": 'Адреса',"advertising": 'Реклама',"afisha": 'Афиша',"all": 'Все сервисы',"api": 'API',"appsearch": 'Приложения',"auto": 'Авто',"avia": 'Авиабилеты',"aziada": 'Азиада',"ba": 'Баян',"backapv": 'Партнер Я.Карт',"balance": 'Баланс',"bar": 'Бар',"bar-ie": 'Бар для ИЕ',"bar-ie9": 'Бар для ИЕ9',"bayan": 'Баннеры Яндекса',"blogs": 'Блоги',"books": 'Книги',"browser": 'Браузер',"calendar": 'Календарь',"captcha": 'ой...',"catalogwdgt": 'Каталог виджетов',"chrome": 'Хром с поиском Яндекса',"city": 'Города',"cityday": 'День города',"collection": 'Коллекция',"company": 'Компания',"contest": 'Contest',"desktop": 'Персональный поиск',"direct": 'Директ',"direct.market": 'Маркет',"disk": 'Диск',"ege": 'ЕГЭ',"expert": 'Эксперт',"feedback": 'Обратная связь',"ff": 'ФФ с поиском Яндекса',"fotki": 'Фотки',"fresh": 'Свежее',"games": 'Игрушки',"geocontext": 'Геоконтекст',"goroda": 'Города',"help": 'Помощь',"i": 'Мои сервисы',"ie": 'ИЕ с поиском Яндекса',"images": 'Картинки',"images-com": 'Картинки',"interests": 'Интересы',"internet": 'Интернет',"keyboard": 'Клавиатура',"kraski": 'Краски',"kuda": 'Куда все идут',"large": 'Яндекс для слабовидящих',"legal": 'Правовые документы',"lenta": 'Лента',"libra": 'Библиотека',"literacy": 'Неделя борьбы за грамотность',"local": 'Локальная сеть',"lost": 'Незабудки',"love": 'День взаимного тяготения — 13 августа',"mail": 'Почта',"maps": 'Карты',"maps-wiki": 'Народная карта',"market": 'Маркет',"market.advertising": 'Маркет',"metrika": 'Метрика',"metro": 'Метро',"mobile": 'Мобильный',"moikrug": 'Мой Круг',"money": 'Деньги',"museums": 'Дни исторического и культурного наследия',"music": 'Музыка',"music-partner": 'Музыка: статистика',"nahodki": 'Мои находки',"nano": 'Нано',"newhire": 'Наниматор',"news": 'Новости',"oauth": 'Авторизация',"online": 'Онлайн',"openid": 'OpenID',"opera": 'Opera Software',"opinion": 'Цитаты',"partners": 'Рекламная сеть',"partnersearch": 'Поиск для партнеров',"passport": 'Паспорт',"pdd": 'Почта для домена',"peoplesearch": 'Люди',"perevod": 'Перевод',"probki": 'Пробки',"pulse": 'блоги: пульс',"punto": 'Punto switcher',"pvo": 'Ответы',"rabota": 'Работа',"ramazan": '',"rasp": 'Расписания',"realty": 'Недвижимость',"referats": 'Рефераты',"rk": 'Есть вопросы?',"root": 'Яндекс.Олимпиада для Unix администраторов',"school": 'Школа',"search": 'Поиск',"server": 'Сервер',"site": 'Поиск для сайта',"slovari": 'Словари',"so": 'Самооборона',"social": 'Социализм',"soft": 'Программы',"sport": 'Спорт',"sprav": 'Справочник',"start": 'Стартовая страница',"stat": 'Статистика',"subs": 'Подписки',"taxi": 'Такси',"terms": 'Разговорник',"tests": 'Тесты и опросы',"tickets": 'Билеты',"time": 'Яндекс.Время',"toster": 'Тосты',"translate": 'Перевод',"tune": 'Настройки',"tv": 'Телепрограмма',"uslugi": 'Услуги',"video": 'Видео',"video-com": 'Видео',"wdgt": 'Виджеты',"weather": 'Погода',"webmaster": 'Вебмастер',"widgets": 'Виджеты',"wordstat": 'Статистика',"wow": 'Я.ру',"www": 'Поиск',"xmlsearch": 'XML',"yaca": 'Каталог',"yamb": 'Медийные баннеры',"zakladki": 'Закладки'}, {
"lang": "ru"
});

BEM.I18N.lang('ru');
