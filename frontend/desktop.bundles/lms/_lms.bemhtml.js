var BEMHTML = function() {
  var cache,
      xjst = (function(exports) {
    function $1(__$ctx) {
        var __t = __$ctx._mode;
        if (__t === "default") {
            return $2(__$ctx);
        } else if (__t === "js") {
            return $505(__$ctx);
        } else if (__t === "url") {
            if (__$ctx.block === "b-lang-switcher") {
                if (__$ctx.elem === "lang") {
                    return $537(__$ctx);
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "regions") {
            if (__$ctx.block === "i-geodata") {
                return $543(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "") {
            return $550(__$ctx);
        } else if (__t === "mix") {
            return $476(__$ctx);
        } else if (__t === "bem") {
            return $578(__$ctx);
        } else if (__t === "xUACompatible") {
            if (__$ctx.block === "b-page") {
                if (!!__$ctx.elem === false) {
                    return $604(__$ctx);
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "cls") {
            return $609(__$ctx);
        } else if (__t === "doctype") {
            if (__$ctx.block === "b-page") {
                if (!!__$ctx.elem === false) {
                    return $620(__$ctx);
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "js-params") {
            if (__$ctx.block === "b-page") {
                if (!!__$ctx.elem === false) {
                    return $628(__$ctx);
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "attrs") {
            return $406(__$ctx);
        } else if (__t === "public-params") {
            if (__$ctx.block === "i-global") {
                return $634(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "content") {
            return $295(__$ctx);
        } else if (__t === "env") {
            if (__$ctx.block === "i-global") {
                return $642(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "tag") {
            return $154(__$ctx);
        } else if (__t === "jsAttr") {
            return $650(__$ctx);
        } else if (__t === "service-url") {
            if (__$ctx.block === "i-services") {
                return $571(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else {
            return $651(__$ctx);
        }
    }
    function $2(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "i-jquery") {
            if (!(__$ctx["__$anflg13"] !== true) === false) {
                if (!!__$ctx.elem === false) {
                    return $6(__$ctx);
                } else {
                    return $9(__$ctx);
                }
            } else {
                return $9(__$ctx);
            }
        } else if (__t === "b-lang-switcher") {
            if (__$ctx.elem === "lang") {
                if (!(__$ctx["__$anflg9"] !== true) === false) {
                    return $53(__$ctx);
                } else {
                    return $56(__$ctx);
                }
            } else {
                return $56(__$ctx);
            }
        } else if (__t === "b-popupa") {
            if (__$ctx.elem === "content") {
                if (!(__$ctx["__$anflg6"] !== true) === false) {
                    {
                        "";
                        var __r117 = __$ctx["__$anflg6"];
                        __$ctx["__$anflg6"] = true;
                        {
                            "";
                            var __r118 = __$ctx.ctx;
                            __$ctx.ctx = [ {
                                elem: "shadow"
                            }, {
                                elem: "wrap",
                                content: __$ctx.ctx
                            } ];
                            var __r119 = __$ctx._mode;
                            __$ctx._mode = "";
                            $550(__$ctx);
                            __$ctx.ctx = __r118;
                            __$ctx._mode = __r119;
                            "";
                        }
                        __$ctx["__$anflg6"] = __r117;
                        "";
                    }
                    undefined;
                    return;
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "b-dropdowna") {
            return $72(__$ctx);
        } else if (__t === "b-menu") {
            var __t = __$ctx.elem;
            if (__t === "separator") {
                if (!(__$ctx["__$anflg11"] !== true) === false) {
                    if (!(__$ctx.mods && __$ctx.mods.layout === "vert") === false) {
                        if (!!__$ctx.ctx._wrap === false) {
                            {
                                "";
                                var __r135 = __$ctx["__$anflg11"];
                                __$ctx["__$anflg11"] = true;
                                {
                                    "";
                                    var __r136 = __$ctx.ctx;
                                    __$ctx.ctx = {
                                        elem: "layout-vert-separator",
                                        content: __$ctx.ctx
                                    };
                                    var __r137 = __$ctx._mode;
                                    __$ctx._mode = "";
                                    $550(__$ctx);
                                    __$ctx.ctx = __r136;
                                    __$ctx._mode = __r137;
                                    "";
                                }
                                __$ctx["__$anflg11"] = __r135;
                                "";
                            }
                            undefined;
                            return;
                        } else {
                            return $651(__$ctx);
                        }
                    } else {
                        return $651(__$ctx);
                    }
                } else {
                    return $651(__$ctx);
                }
            } else if (__t === "item") {
                if (!(__$ctx["__$anflg10"] !== true) === false) {
                    if (!(__$ctx.mods && __$ctx.mods.layout === "vert") === false) {
                        var _$3nisPositioned = __$ctx.ctx.position;
                        {
                            "";
                            var __r132 = __$ctx["__$anflg10"];
                            __$ctx["__$anflg10"] = true;
                            {
                                "";
                                var __r133 = __$ctx.ctx;
                                __$ctx.ctx = {
                                    elem: "layout-vert-cell",
                                    elemMods: _$3nisPositioned ? {
                                        position: _$3nisPositioned
                                    } : {},
                                    content: __$ctx.ctx
                                };
                                var __r134 = __$ctx._mode;
                                __$ctx._mode = "";
                                $550(__$ctx);
                                __$ctx.ctx = __r133;
                                __$ctx._mode = __r134;
                                "";
                            }
                            __$ctx["__$anflg10"] = __r132;
                            "";
                        }
                        undefined;
                        return;
                    } else {
                        return $651(__$ctx);
                    }
                } else {
                    return $651(__$ctx);
                }
            } else if (__t === "link") {
                if (!(__$ctx["__$anflg3"] !== true) === false) {
                    if (!__$ctx._inFooter === false) {
                        var _$1zctx = __$ctx._.extend(__$ctx.ctx, {
                            block: "b-link",
                            elem: undefined,
                            mix: [ {
                                block: "b-foot",
                                elem: "link"
                            } ]
                        });
                        {
                            "";
                            var __r100 = __$ctx["__$anflg3"];
                            __$ctx["__$anflg3"] = true;
                            {
                                "";
                                var __r101 = __$ctx.ctx;
                                __$ctx.ctx = _$1zctx;
                                var __r102 = __$ctx._mode;
                                __$ctx._mode = "";
                                $550(__$ctx);
                                __$ctx.ctx = __r101;
                                __$ctx._mode = __r102;
                                "";
                            }
                            __$ctx["__$anflg3"] = __r100;
                            "";
                        }
                        undefined;
                        return;
                    } else {
                        return $651(__$ctx);
                    }
                } else {
                    return $651(__$ctx);
                }
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "b-foot") {
            if (__$ctx.elem === "links") {
                return $90(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "i-services") {
            var __t = __$ctx.elem;
            if (__t === "url") {
                __$ctx._buf.push(__$ctx["i-services"].serviceUrl(__$ctx.ctx.id, __$ctx.ctx.region));
                return;
            } else if (__t === "name") {
                __$ctx._buf.push(__$ctx["i-services"].serviceName(__$ctx.ctx.id));
                return;
            } else {
                if (!__$ctx.elem === false) {
                    return "";
                    return;
                } else {
                    return $651(__$ctx);
                }
            }
        } else if (__t === "b-page") {
            if (__$ctx.elem === "css") {
                if (!__$ctx.ctx.hasOwnProperty("ie") === false) {
                    if (!!__$ctx.ctx._ieCommented === false) {
                        return $107(__$ctx);
                    } else {
                        return $112(__$ctx);
                    }
                } else {
                    return $112(__$ctx);
                }
            } else {
                return $112(__$ctx);
            }
        } else if (__t === "i-bem") {
            if (__$ctx.elem === "i18n") {
                return $122(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else if (__t === "i-global") {
            return $125(__$ctx);
        } else if (__t === "i-geodata") {
            return $80(__$ctx);
        } else {
            return $651(__$ctx);
        }
    }
    function $6(__$ctx) {
        var __r143, __r147, __r144, __r145, __r146;
        return "", __r143 = __$ctx["__$anflg13"], __$ctx["__$anflg13"] = true, __r147 = ("", __r144 = __$ctx.ctx, __$ctx.ctx = {
            block: "b-page",
            elem: "js",
            url: __$ctx.ctx.url || (__$ctx.ctx.protocol ? __$ctx.ctx.protocol + ":" : "") + "//yandex.st/jquery/" + __$ctx.mods.version + "/jquery.min.js"
        }, __r145 = __$ctx._mode, __$ctx._mode = "", __r146 = $550(__$ctx), __$ctx.ctx = __r144, __$ctx._mode = __r145, "", __r146), __$ctx["__$anflg13"] = __r143, "", __r147;
        return;
    }
    function $9(__$ctx) {
        if (!(__$ctx["__$anflg12"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                return $12(__$ctx);
            } else {
                return $15(__$ctx);
            }
        } else {
            return $15(__$ctx);
        }
    }
    function $12(__$ctx) {
        var __r138, __r142, __r139, __r140, __r141;
        return "", __r138 = __$ctx["__$anflg12"], __$ctx["__$anflg12"] = true, __r142 = ("", __r139 = __$ctx.ctx, __$ctx.ctx = {
            block: "b-page",
            elem: "js",
            url: __$ctx.ctx.url || (__$ctx.ctx.protocol ? __$ctx.ctx.protocol + ":" : "") + "//yandex.st/jquery/" + __$ctx.mods.version + "/jquery.min.js"
        }, __r140 = __$ctx._mode, __$ctx._mode = "", __r141 = $550(__$ctx), __$ctx.ctx = __r139, __$ctx._mode = __r140, "", __r141), __$ctx["__$anflg12"] = __r138, "", __r142;
        return;
    }
    function $15(__$ctx) {
        if (__$ctx.elem === "core") {
            var __r62, __r63, __r64;
            return "", __r62 = __$ctx._mode, __$ctx._mode = "", __r63 = __$ctx.ctx, __$ctx.ctx = {
                block: "b-page",
                elem: "js",
                url: "//yandex.st/jquery/1.8.3/jquery.min.js"
            }, __r64 = $550(__$ctx), __$ctx._mode = __r62, __$ctx.ctx = __r63, "", __r64;
            return;
        } else {
            return $651(__$ctx);
        }
    }
    function $53(__$ctx) {
        var _$3bctx = __$ctx.ctx, _$3blang = _$3bctx.lang, _$3bargs = null;
        if (_$3blang.code) {
            _$3bargs = {
                short_ename: _$3blang.code == "en" ? "com" : _$3blang.code
            };
        } else {
            if (_$3blang.langCode) {
                _$3bargs = {
                    lang: _$3blang.langCode
                };
            } else {
                if (_$3blang.region) {
                    _$3bargs = _$3blang.region;
                } else {
                    undefined;
                }
            }
        }
        var _$3bregion = __$ctx["i-geodata"].getRegion(_$3bargs);
        _$3bctx.block = __$ctx.block;
        _$3bctx.elem = __$ctx.elem;
        {
            "";
            var __r125 = __$ctx["__$anflg9"];
            __$ctx["__$anflg9"] = true;
            {
                "";
                var __r126 = __$ctx._mode;
                __$ctx._mode = "";
                var __r127 = __$ctx.ctx, __r128 = __r127._lang;
                __r127._lang = {
                    lang: _$3bregion.lang,
                    code: _$3bregion["short_ename"] == "com" ? "en" : _$3bregion["short_ename"],
                    name: _$3bctx.lang.name
                };
                var __r129 = __$ctx.ctx;
                __$ctx.ctx = _$3bctx._link ? _$3bctx : {
                    block: "b-menu",
                    elem: "item",
                    mods: {
                        layout: "vert"
                    },
                    content: _$3bctx
                };
                $550(__$ctx);
                __$ctx._mode = __r126;
                __r127._lang = __r128;
                __$ctx.ctx = __r129;
                "";
            }
            __$ctx["__$anflg9"] = __r125;
            "";
        }
        undefined;
        return;
    }
    function $56(__$ctx) {
        if (!(__$ctx["__$anflg7"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                return $59(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else {
            return $651(__$ctx);
        }
    }
    function $59(__$ctx) {
        {
            "";
            var __r120 = __$ctx["__$anflg7"];
            __$ctx["__$anflg7"] = true;
            {
                "";
                var __r121 = __$ctx.ctx;
                __$ctx.ctx = {
                    block: "b-dropdowna",
                    mix: [ __$ctx._.extend(__$ctx.ctx, {
                        js: true
                    }) ],
                    content: [ {
                        elem: "switcher",
                        content: {
                            block: "b-lang-switcher",
                            elem: "lang",
                            mix: [ {
                                block: "b-link",
                                mods: {
                                    pseudo: "yes"
                                }
                            } ],
                            lang: __$ctx.ctx.lang,
                            selected: "yes",
                            _link: true
                        }
                    }, {
                        block: "b-popupa",
                        mods: {
                            theme: "ffffff",
                            direction: __$ctx.ctx.direction || "up"
                        },
                        content: [ {
                            elem: "tail"
                        }, {
                            elem: "content",
                            mix: [ {
                                block: "b-lang-switcher",
                                elem: "popup-content"
                            } ],
                            content: {
                                block: "b-menu",
                                mods: {
                                    layout: "vert"
                                },
                                mix: [ {
                                    block: "b-dropdowna",
                                    elem: "menu"
                                }, {
                                    block: "b-lang-switcher",
                                    elem: "menu"
                                } ],
                                content: __$ctx.ctx
                            }
                        } ]
                    } ]
                };
                var __r122 = __$ctx._mode;
                __$ctx._mode = "";
                $550(__$ctx);
                __$ctx.ctx = __r121;
                __$ctx._mode = __r122;
                "";
            }
            __$ctx["__$anflg7"] = __r120;
            "";
        }
        undefined;
        return;
    }
    function $72(__$ctx) {
        if (!(__$ctx["__$anflg5"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                {
                    "";
                    var __r114 = __$ctx["__$anflg5"];
                    __$ctx["__$anflg5"] = true;
                    {
                        "";
                        var __r115 = __$ctx._inBDropdowna;
                        __$ctx._inBDropdowna = true;
                        var __r116 = __$ctx._dropdownaColor;
                        __$ctx._dropdownaColor = __$ctx.mods.color || false;
                        $72(__$ctx);
                        __$ctx._inBDropdowna = __r115;
                        __$ctx._dropdownaColor = __r116;
                        "";
                    }
                    __$ctx["__$anflg5"] = __r114;
                    "";
                }
                undefined;
                return;
            } else {
                return $651(__$ctx);
            }
        } else {
            return $651(__$ctx);
        }
    }
    function $80(__$ctx) {
        if (!!__$ctx._userRegion === false) {
            if (!!__$ctx.elem === false) {
                {
                    "";
                    var __r111 = __$ctx._userRegion;
                    __$ctx._userRegion = __$ctx["i-geodata"].getRegion(__$ctx.ctx.region);
                    $80(__$ctx);
                    __$ctx._userRegion = __r111;
                    "";
                }
                undefined;
                return;
            } else {
                return $651(__$ctx);
            }
        } else {
            return $651(__$ctx);
        }
    }
    function $90(__$ctx) {
        {
            "";
            var __r92 = __$ctx._mode;
            __$ctx._mode = "";
            var __r93 = __$ctx.ctx, __r94 = __r93.block;
            __r93.block = "b-menu";
            var __r95 = __$ctx.ctx, __r96 = __r95.mods;
            __r95.mods = {
                layout: "horiz-simple"
            };
            var __r97 = __$ctx.ctx, __r98 = __r97.elem;
            __r97.elem = undefined;
            var __r99 = __$ctx._inFooter;
            __$ctx._inFooter = true;
            $550(__$ctx);
            __$ctx._mode = __r92;
            __r93.block = __r94;
            __r95.mods = __r96;
            __r97.elem = __r98;
            __$ctx._inFooter = __r99;
            "";
        }
        undefined;
        return;
    }
    function $107(__$ctx) {
        var _$1mie = __$ctx.ctx.ie;
        if (_$1mie === true) {
            {
                "";
                var __r83 = __$ctx._mode;
                __$ctx._mode = "";
                var __r84 = __$ctx.ctx;
                __$ctx.ctx = [ 6, 7, 8, 9 ].map(function(v) {
                    return {
                        elem: "css",
                        url: this.ctx.url + ".ie" + v + ".css",
                        ie: "IE " + v
                    };
                }, __$ctx);
                $550(__$ctx);
                __$ctx._mode = __r83;
                __$ctx.ctx = __r84;
                "";
            }
            undefined;
        } else {
            var _$1mhideRule = !_$1mie ? [ "gt IE 9", "<!-->", "<!--" ] : _$1mie === "!IE" ? [ _$1mie, "<!-->", "<!--" ] : [ _$1mie, "", "" ];
            {
                "";
                var __r85 = __$ctx._mode;
                __$ctx._mode = "";
                var __r86 = __$ctx.ctx, __r87 = __r86._ieCommented;
                __r86._ieCommented = true;
                var __r88 = __$ctx.ctx;
                __$ctx.ctx = [ "<!--[if " + _$1mhideRule[0] + "]>", _$1mhideRule[1], __$ctx.ctx, _$1mhideRule[2], "<![endif]-->" ];
                $550(__$ctx);
                __$ctx._mode = __r85;
                __r86._ieCommented = __r87;
                __$ctx.ctx = __r88;
                "";
            }
            undefined;
        }
        return;
    }
    function $112(__$ctx) {
        if (!(__$ctx["__$anflg2"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                return $115(__$ctx);
            } else {
                return $651(__$ctx);
            }
        } else {
            return $651(__$ctx);
        }
    }
    function $115(__$ctx) {
        var __r69, __r70, __r71, __r72;
        var _$12ctx = __$ctx.ctx, _$12dtype = ("", __r69 = __$ctx._mode, __$ctx._mode = "doctype", __r70 = $620(__$ctx), __$ctx._mode = __r69, "", __r70), _$12xUA = ("", __r71 = __$ctx._mode, __$ctx._mode = "xUACompatible", __r72 = $604(__$ctx), __$ctx._mode = __r71, "", __r72), _$12buf = [ _$12dtype, {
            elem: "root",
            content: [ {
                elem: "head",
                content: [ {
                    tag: "meta",
                    attrs: {
                        charset: "utf-8"
                    }
                }, _$12xUA, {
                    tag: "title",
                    content: _$12ctx.title
                }, _$12ctx.favicon ? {
                    elem: "favicon",
                    url: _$12ctx.favicon
                } : "", _$12ctx.meta, {
                    block: "i-ua"
                }, _$12ctx.head ]
            }, _$12ctx ]
        } ];
        {
            "";
            var __r73 = __$ctx["__$anflg2"];
            __$ctx["__$anflg2"] = true;
            {
                "";
                var __r74 = __$ctx.ctx;
                __$ctx.ctx = _$12buf;
                var __r75 = __$ctx._mode;
                __$ctx._mode = "";
                $550(__$ctx);
                __$ctx.ctx = __r74;
                __$ctx._mode = __r75;
                "";
            }
            __$ctx["__$anflg2"] = __r73;
            "";
        }
        undefined;
        return;
    }
    function $122(__$ctx) {
        var __r65, __r66, __r67, __r68;
        if (!__$ctx.ctx) {
            return "";
        } else {
            undefined;
        }
        var _$zctx = __$ctx.ctx, _$zkeyset = _$zctx.keyset, _$zkey = _$zctx.key, _$zparams = _$zctx.params || {};
        if (!(_$zkeyset || _$zkey)) {
            return "";
        } else {
            undefined;
        }
        if (_$zctx.content) {
            var _$zcnt;
            _$zparams.content = (_$zcnt = [], "", __r65 = __$ctx._buf, __$ctx._buf = _$zcnt, __r66 = __$ctx._mode, __$ctx._mode = "", __r67 = __$ctx.ctx, __$ctx.ctx = _$zctx.content, __r68 = $550(__$ctx), __$ctx._buf = __r65, __$ctx._mode = __r66, __$ctx.ctx = __r67, "", __r68, _$zcnt.join(""));
        } else {
            undefined;
        }
        __$ctx._buf.push(BEM.I18N(_$zkeyset, _$zkey, _$zparams));
        return;
    }
    function $125(__$ctx) {
        var __t = __$ctx.elem;
        if (__t === "lego-static-host") {
            return "//yandex.st/lego/2.10-122";
            return;
        } else if (__t === "export-host") {
            return "//export.yandex.ru";
            return;
        } else if (__t === "social-host") {
            return "//social.yandex.ru";
            return;
        } else if (__t === "pass-host") {
            return "//pass.yandex.ru";
            return;
        } else if (__t === "passport-host") {
            return "https://passport.yandex.ru";
            return;
        } else if (__t === "click-host") {
            return "//clck.yandex.ru";
            return;
        } else if (__t === "content-region" || __t === "tld" || __t === "lang") {
            return "ru";
            return;
        } else {
            if (!__$ctx.elem === false) {
                return "";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return $149(__$ctx);
                } else {
                    return $651(__$ctx);
                }
            }
        }
    }
    function $149(__$ctx) {
        var _$hparams = __$ctx.ctx.params || {}, _$hiGlobal = __$ctx["i-global"], _$hisTldChanged = _$hparams.tld && _$hparams.tld !== _$hiGlobal.tld, _$htld, _$hxYaDomain, _$hyaDomain;
        if (_$hisTldChanged) {
            _$htld = _$hparams.tld;
            _$hxYaDomain = _$htld === "tr" ? "yandex.com.tr" : "yandex." + _$htld;
            _$hyaDomain = [ "ua", "by", "kz" ].indexOf(_$htld) != -1 ? "yandex.ru" : _$hxYaDomain;
            _$hiGlobal["content-region"] = _$htld;
            _$hiGlobal["click-host"] = "//clck." + _$hyaDomain;
            _$hiGlobal["passport-host"] = "https://passport." + _$hyaDomain;
            _$hiGlobal["pass-host"] = "//pass." + _$hxYaDomain;
            _$hiGlobal["social-host"] = "//social." + _$hxYaDomain;
            _$hiGlobal["export-host"] = "//export." + _$hxYaDomain;
        } else {
            undefined;
        }
        for (var _$hp in _$hparams) {
            _$hiGlobal[_$hp] = _$hparams[_$hp];
        }
        return;
    }
    function $154(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-copyright") {
            var __t = __$ctx.elem;
            if (__t === "text") {
                return "";
                return;
            } else if (__t === "link") {
                return "a";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-menu") {
            var __t = __$ctx.elem;
            if (__t === "layout-vert-separator" || __t === "layout-vert-cell") {
                if (!(__$ctx.mods && __$ctx.mods.layout === "vert") === false) {
                    return "li";
                    return;
                } else {
                    return $198(__$ctx);
                }
            } else if (__t === "layout-vert") {
                if (!(__$ctx.mods && __$ctx.mods.layout === "vert") === false) {
                    return "ul";
                    return;
                } else {
                    return $198(__$ctx);
                }
            } else if (__t === "separator") {
                return "i";
                return;
            } else if (__t === "item") {
                if (!(__$ctx.elemMods && __$ctx.elemMods.state === "current") === false) {
                    if (!(__$ctx.mods && __$ctx.mods.layout === "horiz-simple") === false) {
                        return "span";
                        return;
                    } else {
                        return $198(__$ctx);
                    }
                } else {
                    return $198(__$ctx);
                }
            } else if (__t === "title") {
                if (!(__$ctx.mods && __$ctx.mods.layout === "horiz-simple") === false) {
                    return "h2";
                    return;
                } else {
                    return "h2";
                    return;
                }
            } else {
                return $198(__$ctx);
            }
        } else if (__t === "b-icon") {
            if (!!__$ctx.elem === false) {
                return "img";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-lang-switcher") {
            if (__$ctx.elem === "lang") {
                if (!(__$ctx.elemMods.selected != "yes") === false) {
                    if (!!__$ctx.ctx.selected === false) {
                        return "a";
                        return;
                    } else {
                        return $216(__$ctx);
                    }
                } else {
                    return $216(__$ctx);
                }
            } else {
                if (!!__$ctx.elem === false) {
                    return "";
                    return;
                } else {
                    return $294(__$ctx);
                }
            }
        } else if (__t === "b-country-flag") {
            if (!!__$ctx.elem === false) {
                return "img";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-popupa") {
            var __t = __$ctx.elem;
            if (__t === "tail") {
                return "i";
                return;
            } else if (__t === "wrap-cell") {
                return "td";
                return;
            } else if (__t === "wrap") {
                return "table";
                return;
            } else if (__t === "shadow") {
                return "i";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-link") {
            if (__$ctx.elem === "inner") {
                return "span";
                return;
            } else {
                if (!(__$ctx.mods && __$ctx.mods.pseudo) === false) {
                    if (!!__$ctx.elem === false) {
                        return __$ctx.ctx.url ? "a" : "span";
                        return;
                    } else {
                        return $247(__$ctx);
                    }
                } else {
                    return $247(__$ctx);
                }
            }
        } else if (__t === "b-foot") {
            var __t = __$ctx.elem;
            if (__t === "layout-column") {
                return "td";
                return;
            } else if (__t === "layout-gap-i") {
                return "i";
                return;
            } else if (__t === "layout-gap") {
                return "td";
                return;
            } else if (__t === "row") {
                return "tr";
                return;
            } else if (__t === "layout") {
                return "table";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js") {
                return "script";
                return;
            } else if (__t === "css") {
                if (!__$ctx.ctx.url === false) {
                    return "link";
                    return;
                } else {
                    return "style";
                    return;
                }
            } else if (__t === "body") {
                return "";
                return;
            } else if (__t === "favicon") {
                return "link";
                return;
            } else if (__t === "meta") {
                return "meta";
                return;
            } else if (__t === "head") {
                return "head";
                return;
            } else if (__t === "root") {
                return "html";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return "body";
                    return;
                } else {
                    return $294(__$ctx);
                }
            }
        } else if (__t === "i-ua") {
            if (!!__$ctx.elem === false) {
                return "script";
                return;
            } else {
                return $294(__$ctx);
            }
        } else if (__t === "b-dropdowna") {
            if (__$ctx.elem === "switcher") {
                return "span";
                return;
            } else {
                return $294(__$ctx);
            }
        } else {
            return $294(__$ctx);
        }
    }
    function $198(__$ctx) {
        if (!!__$ctx.elem === false) {
            return "div";
            return;
        } else {
            return $294(__$ctx);
        }
    }
    function $216(__$ctx) {
        return "span";
        return;
    }
    function $247(__$ctx) {
        if (!!__$ctx.elem === false) {
            return "a";
            return;
        } else {
            return $294(__$ctx);
        }
    }
    function $294(__$ctx) {
        return undefined;
        return;
    }
    function $295(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-copyright") {
            if (__$ctx.elem === "link") {
                return __$ctx.ctx.content || BEM.I18N("b-copyright", "yandex");
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    var _$3ucurrentYear = (new Date).getFullYear(), _$3ustartYear = __$ctx.ctx.start ? __$ctx.ctx.start : _$3ucurrentYear, _$3ucontent = "©&#160;" + _$3ustartYear;
                    _$3ucurrentYear === _$3ustartYear || (_$3ucontent += "&#8211;" + _$3ucurrentYear);
                    _$3ucontent += "&#160;&#160;";
                    return [ _$3ucontent, __$ctx.ctx.content ? __$ctx.ctx.content : {
                        block: "i-bem",
                        elem: "i18n",
                        keyset: "b-copyright",
                        key: "link",
                        content: {
                            block: __$ctx.block,
                            elem: "link"
                        }
                    } ];
                    return;
                } else {
                    return $405(__$ctx);
                }
            }
        } else if (__t === "b-menu") {
            if (!(__$ctx.mods && __$ctx.mods.layout === "vert") === false) {
                if (!!__$ctx.elem === false) {
                    return [ __$ctx.ctx.title, {
                        elem: "layout-vert",
                        content: __$ctx.ctx.content
                    } ];
                    return;
                } else {
                    return $310(__$ctx);
                }
            } else {
                return $310(__$ctx);
            }
        } else if (__t === "b-lang-switcher") {
            return $324(__$ctx);
        } else if (__t === "b-popupa") {
            if (__$ctx.elem === "wrap") {
                return {
                    tag: "tr",
                    content: {
                        elem: "wrap-cell",
                        content: __$ctx.ctx.content
                    }
                };
                return;
            } else {
                if (!(__$ctx.mods && __$ctx.mods["has-close"] === "yes") === false) {
                    if (!!__$ctx.elem === false) {
                        __$ctx._.isArray(__$ctx.ctx.content) || (__$ctx.ctx.content = [ __$ctx.ctx.content ]);
                        __$ctx.ctx.content.push({
                            elem: "close"
                        });
                        return __$ctx.ctx.content;
                        return;
                    } else {
                        return $405(__$ctx);
                    }
                } else {
                    return $405(__$ctx);
                }
            }
        } else if (__t === "b-link") {
            if (!(__$ctx.mods && __$ctx.mods.pseudo) === false) {
                if (!!__$ctx.ctx._wrap === false) {
                    if (!!__$ctx.elem === false) {
                        if (!!__$ctx.mods.inner === false) {
                            {
                                "";
                                var __r112 = __$ctx._mode;
                                __$ctx._mode = "";
                                var __r113 = __$ctx.ctx;
                                __$ctx.ctx = {
                                    elem: "inner",
                                    content: __$ctx.ctx.content,
                                    _wrap: true
                                };
                                $550(__$ctx);
                                __$ctx._mode = __r112;
                                __$ctx.ctx = __r113;
                                "";
                            }
                            undefined;
                            return;
                        } else {
                            return $405(__$ctx);
                        }
                    } else {
                        return $405(__$ctx);
                    }
                } else {
                    return $405(__$ctx);
                }
            } else {
                return $405(__$ctx);
            }
        } else if (__t === "i-geodata") {
            var __t = __$ctx.elem;
            if (__t === "region-parent") {
                return __$ctx._userRegion.parent;
                return;
            } else if (__t === "region-name") {
                return __$ctx._userRegion.name;
                return;
            } else if (__t === "region-short-ename") {
                return __$ctx._userRegion["short_ename"];
                return;
            } else if (__t === "region-ename") {
                return __$ctx._userRegion.ename;
                return;
            } else if (__t === "region-lang") {
                return __$ctx._userRegion.lang;
                return;
            } else if (__t === "region-id") {
                return __$ctx._userRegion.id;
                return;
            } else {
                return $405(__$ctx);
            }
        } else if (__t === "b-foot") {
            var __t = __$ctx.elem;
            if (__t === "layout-gap") {
                return {
                    elem: "layout-gap-i"
                };
                return;
            } else if (__t === "layout") {
                return {
                    bem: false,
                    elem: "row",
                    content: [ {
                        elem: "layout-gap",
                        content: {
                            elem: "layout-gap-i"
                        }
                    }, __$ctx.ctx.content, {
                        elem: "layout-gap",
                        content: {
                            elem: "layout-gap-i"
                        }
                    } ]
                };
                return;
            } else {
                return $405(__$ctx);
            }
        } else if (__t === "b-page") {
            if (!!__$ctx.elem === false) {
                return {
                    elem: "body",
                    content: __$ctx.ctx.content
                };
                return;
            } else {
                return $405(__$ctx);
            }
        } else if (__t === "i-ua") {
            return $393(__$ctx);
        } else {
            return $405(__$ctx);
        }
    }
    function $310(__$ctx) {
        if (__$ctx.elem === "item") {
            if (!(__$ctx.mods && __$ctx.mods.layout === "horiz-simple") === false) {
                if (__$ctx.isLast()) {
                    return __$ctx.ctx.content;
                } else {
                    return [ __$ctx.ctx.content, "&nbsp;· " ];
                }
                return;
            } else {
                return $316(__$ctx);
            }
        } else {
            return $316(__$ctx);
        }
    }
    function $316(__$ctx) {
        if (!(__$ctx.mods && __$ctx.mods.layout === "horiz-simple") === false) {
            if (!!__$ctx.elem === false) {
                return [ __$ctx.ctx.title, __$ctx.ctx.content ];
                return;
            } else {
                return $405(__$ctx);
            }
        } else {
            return $405(__$ctx);
        }
    }
    function $324(__$ctx) {
        if (__$ctx.elem === "lang") {
            return [ {
                block: "b-country-flag",
                mix: [ {
                    block: "b-lang-switcher",
                    elem: "flag"
                }, {
                    mods: {
                        "size-16": __$ctx.ctx._lang.code
                    }
                } ],
                alt: __$ctx.ctx._lang.name
            }, {
                elem: "lang-name",
                tag: "span",
                content: __$ctx.ctx._lang.name
            } ];
            return;
        } else {
            if (!(__$ctx["__$anflg8"] !== true) === false) {
                if (!(__$ctx._.isArray(__$ctx.ctx.content) && __$ctx.ctx.content.length < 4) === false) {
                    return $330(__$ctx);
                } else {
                    return $333(__$ctx);
                }
            } else {
                return $333(__$ctx);
            }
        }
    }
    function $330(__$ctx) {
        var __r123, __r124;
        if (__$ctx.ctx.noMore === true) {
            return "", __r123 = __$ctx["__$anflg8"], __$ctx["__$anflg8"] = true, __r124 = $324(__$ctx), __$ctx["__$anflg8"] = __r123, "", __r124;
        } else {
            undefined;
        }
        return [ {
            block: "b-menu",
            mods: {
                layout: "vert"
            },
            elem: "item",
            content: {
                block: "b-link",
                url: __$ctx["i-services"].serviceUrl("tune") + "/lang/",
                content: __$ctx.ctx.moreText || BEM.I18N("b-lang-switcher", "all")
            }
        }, {
            block: "b-menu",
            mods: {
                layout: "vert"
            },
            elem: "separator"
        }, __$ctx.ctx.content ];
        return;
    }
    function $333(__$ctx) {
        if (!true === false) {
            if (!!__$ctx.elem === false) {
                return __$ctx.ctx.content;
                return;
            } else {
                return $405(__$ctx);
            }
        } else {
            return $405(__$ctx);
        }
    }
    function $393(__$ctx) {
        if (!(__$ctx["__$anflg1"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                var __r60, __r61;
                var _$xc = ("", __r60 = __$ctx["__$anflg1"], __$ctx["__$anflg1"] = true, __r61 = $393(__$ctx), __$ctx["__$anflg1"] = __r60, "", __r61);
                _$xc += [ ";(function(d,e,c,r,n,w,v,f){", "e=d.documentElement;", 'c="className";', 'r="replace";', 'n="createElementNS";', 'f="firstChild";', 'w="http://www.w3.org/2000/svg";', 'e[c]+=" i-ua_svg_"+(!!d[n]&&!!d[n](w,"svg").createSVGRect?"yes":"no");', 'v=d.createElement("div");', 'v.innerHTML="<svg/>";', 'e[c]+=" i-ua_inlinesvg_"+((v[f]&&v[f].namespaceURI)==w?"yes":"no");', "})(document);" ].join("");
                return _$xc;
                return;
            } else {
                return $399(__$ctx);
            }
        } else {
            return $399(__$ctx);
        }
    }
    function $399(__$ctx) {
        if (!!__$ctx.elem === false) {
            return [ ";(function(d,e,c,r){", "e=d.documentElement;", 'c="className";', 'r="replace";', 'e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");', 'if(d.compatMode!="CSS1Compat")', 'e[c]=e[c][r]("i-ua_css_standart","i-ua_css_quirks")', "})(document);" ].join("");
            return;
        } else {
            return $405(__$ctx);
        }
    }
    function $405(__$ctx) {
        return __$ctx.ctx.content;
        return;
    }
    function $406(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-copyright") {
            if (__$ctx.elem === "link") {
                return {
                    href: __$ctx["i-services"].serviceUrl("www")
                };
                return;
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-country-flag") {
            if (!!__$ctx.elem === false) {
                var _$3ta = {
                    src: "//yandex.st/lego/_/La6qi18Z8LwgnZdsAr1qy1GwCwo.gif"
                };
                __$ctx.ctx.alt && (_$3ta.alt = __$ctx.ctx.alt);
                return _$3ta;
                return;
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-icon") {
            if (!!__$ctx.elem === false) {
                var _$3ictx = __$ctx.ctx, _$3ia = {
                    src: "//yandex.st/lego/_/La6qi18Z8LwgnZdsAr1qy1GwCwo.gif",
                    alt: ""
                }, _$3iprops = [ "alt", "width", "height" ], _$3ip;
                _$3ictx.url && (_$3ia.src = _$3ictx.url);
                while (_$3ip = _$3iprops.shift()) {
                    _$3ictx[_$3ip] && (_$3ia[_$3ip] = _$3ictx[_$3ip]);
                }
                return _$3ia;
                return;
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-lang-switcher") {
            if (__$ctx.elem === "lang") {
                if (!(__$ctx.elemMods.selected != "yes") === false) {
                    if (!!__$ctx.ctx.selected === false) {
                        var __r130, __r131;
                        var _$3ectx = __$ctx.ctx, _$3ehref = _$3ectx.url || ("", __r130 = __$ctx._mode, __$ctx._mode = "url", __r131 = $537(__$ctx), __$ctx._mode = __r130, "", __r131);
                        return {
                            href: _$3ehref
                        };
                        return;
                    } else {
                        return $475(__$ctx);
                    }
                } else {
                    return $475(__$ctx);
                }
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-popupa") {
            if (__$ctx.elem === "wrap") {
                return {
                    cellpadding: 0,
                    cellspacing: 0
                };
                return;
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-link") {
            if (!(__$ctx.mods && __$ctx.mods.pseudo) === false) {
                if (!!__$ctx.elem === false) {
                    if (!!__$ctx.ctx.url === false) {
                        return {};
                        return;
                    } else {
                        return $447(__$ctx);
                    }
                } else {
                    return $447(__$ctx);
                }
            } else {
                return $447(__$ctx);
            }
        } else if (__t === "b-foot") {
            if (!!__$ctx.elem === false) {
                return {
                    role: "contentinfo"
                };
                return;
            } else {
                return $475(__$ctx);
            }
        } else if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js") {
                if (!__$ctx.ctx.url === false) {
                    return {
                        src: __$ctx.ctx.url
                    };
                    return;
                } else {
                    return $475(__$ctx);
                }
            } else if (__t === "css") {
                if (!__$ctx.ctx.url === false) {
                    return {
                        rel: "stylesheet",
                        href: __$ctx.ctx.url
                    };
                    return;
                } else {
                    return $475(__$ctx);
                }
            } else if (__t === "favicon") {
                return {
                    rel: "shortcut icon",
                    href: __$ctx.ctx.url
                };
                return;
            } else if (__t === "meta") {
                return __$ctx.ctx.attrs;
                return;
            } else {
                return $475(__$ctx);
            }
        } else {
            return $475(__$ctx);
        }
    }
    function $447(__$ctx) {
        if (!!__$ctx.elem === false) {
            return $449(__$ctx);
        } else {
            return $475(__$ctx);
        }
    }
    function $449(__$ctx) {
        var __r103, __r104, __r105, __r106;
        var _$2ectx = __$ctx.ctx, _$2eprops = [ "title", "target" ], _$2ep = typeof _$2ectx.url, _$2ea = {
            href: _$2ep === "undefined" || _$2ep === "string" ? _$2ectx.url : (_$2ep = [], "", __r103 = __$ctx._buf, __$ctx._buf = _$2ep, __r104 = __$ctx._mode, __$ctx._mode = "", __r105 = __$ctx.ctx, __$ctx.ctx = _$2ectx.url, __r106 = $550(__$ctx), __$ctx._buf = __r103, __$ctx._mode = __r104, __$ctx.ctx = __r105, "", __r106, _$2ep.join(""))
        };
        while (_$2ep = _$2eprops.pop()) {
            _$2ectx[_$2ep] && (_$2ea[_$2ep] = _$2ectx[_$2ep]);
        }
        return _$2ea;
        return;
    }
    function $475(__$ctx) {
        return undefined;
        return;
    }
    function $476(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-country-flag") {
            if (!!__$ctx.elem === false) {
                var _$3rsizeMod = {};
                _$3rsizeMod["size-" + (__$ctx.ctx.mods && __$ctx.ctx.mods.size || 16)] = __$ctx.ctx.country;
                return [ {
                    block: "b-icon"
                }, {
                    mods: _$3rsizeMod
                } ];
                return;
            } else {
                return $504(__$ctx);
            }
        } else if (__t === "b-popupa") {
            if (!!__$ctx.elem === false) {
                var _$2xm = {}, _$2xmods = __$ctx.ctx.mods || {}, _$2xmix;
                _$2xmods.theme || (_$2xm.theme = "ffffff");
                _$2xmods.direction || (_$2xm.direction = "down");
                _$2xm = [ {
                    mods: _$2xm
                } ];
                if (__$ctx._inBDropdowna) {
                    _$2xm.push({
                        block: "b-dropdowna",
                        elem: "popup",
                        elemMods: __$ctx._dropdownaColor && {
                            color: __$ctx._dropdownaColor
                        }
                    });
                    __$ctx._dropdownaColor = false;
                    __$ctx._inBDropdowna = false;
                } else {
                    undefined;
                }
                return _$2xm;
                return;
            } else {
                return $504(__$ctx);
            }
        } else if (__t === "b-dropdowna") {
            if (!!__$ctx.elem === false) {
                return [ {
                    mods: {
                        "is-bem": "yes"
                    }
                } ];
                return;
            } else {
                return $504(__$ctx);
            }
        } else if (__t === "b-page") {
            return $492(__$ctx);
        } else {
            return $504(__$ctx);
        }
    }
    function $492(__$ctx) {
        if (!!__$ctx.ctx._iGlobal === false) {
            if (!!__$ctx.elem === false) {
                return $495(__$ctx);
            } else {
                return $498(__$ctx);
            }
        } else {
            return $498(__$ctx);
        }
    }
    function $495(__$ctx) {
        var __r76, __r77, __r78, __r79, __r80;
        var _$1imix = ("", __r76 = __$ctx.ctx, __r77 = __r76._iGlobal, __r76._iGlobal = true, __r78 = $492(__$ctx), __r76._iGlobal = __r77, "", __r78), _$1ijsParams = ("", __r79 = __$ctx._mode, __$ctx._mode = "js-params", __r80 = $628(__$ctx), __$ctx._mode = __r79, "", __r80);
        _$1imix ? _$1imix.push(_$1ijsParams) : _$1imix = [ _$1ijsParams ];
        return _$1imix;
        return;
    }
    function $498(__$ctx) {
        if (!!__$ctx.elem === false) {
            return [ {
                elem: "body"
            } ];
            return;
        } else {
            return $504(__$ctx);
        }
    }
    function $504(__$ctx) {
        return undefined;
        return;
    }
    function $505(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-menu") {
            if (!(__$ctx.mods && __$ctx.mods["is-bem"] === "yes") === false) {
                if (!!__$ctx.elem === false) {
                    return true;
                    return;
                } else {
                    return $533(__$ctx);
                }
            } else {
                return $533(__$ctx);
            }
        } else if (__t === "b-popupa" || __t === "b-dropdowna") {
            if (!!__$ctx.elem === false) {
                return true;
                return;
            } else {
                return $533(__$ctx);
            }
        } else if (__t === "b-link") {
            if (!(__$ctx.mods && __$ctx.mods.pseudo) === false) {
                if (!!__$ctx.elem === false) {
                    return true;
                    return;
                } else {
                    return $533(__$ctx);
                }
            } else {
                return $533(__$ctx);
            }
        } else {
            return $533(__$ctx);
        }
    }
    function $533(__$ctx) {
        return undefined;
        return;
    }
    function $537(__$ctx) {
        var _$3fGlob = __$ctx["i-global"], _$3furl = __$ctx["i-services"].serviceUrl("tune"), _$3flang = __$ctx.ctx._lang.lang;
        if (_$3fGlob["secret-key"] === undefined) {
            return _$3furl + "/lang/";
        } else {
            undefined;
        }
        return _$3furl + "/api/lang/v1.1/save.xml?intl=" + _$3flang + (_$3fGlob.retpath ? "&retpath=" + encodeURIComponent(_$3fGlob.retpath) : "") + "&sk=" + _$3fGlob["secret-key"];
        return;
    }
    function $543(__$ctx) {
        if (!!__$ctx.elem === false) {
            return $545(__$ctx);
        } else {
            return $651(__$ctx);
        }
    }
    function $545(__$ctx) {
        return {
            "10000": {
                id: "10000",
                lang: "en",
                ename: "Earth",
                short_ename: "com",
                name: "Земля",
                parent: 0
            },
            "225": {
                id: "225",
                lang: "ru",
                ename: "Russia",
                short_ename: "ru",
                name: "Россия",
                parent: "10000"
            },
            "213": {
                id: "213",
                ename: "Moscow",
                short_ename: "msk",
                name: "Москва",
                parent: "225"
            },
            "9999": {
                id: "9999",
                ename: "Yandex",
                short_ename: "yndx",
                name: "Яндекс",
                parent: "213"
            },
            "187": {
                id: "187",
                lang: "uk",
                ename: "Ukraine",
                short_ename: "ua",
                name: "Украина",
                parent: "10000"
            },
            "149": {
                id: "149",
                lang: "be",
                ename: "Belarus",
                short_ename: "by",
                name: "Беларусь",
                parent: "10000"
            },
            "159": {
                id: "159",
                lang: "kk",
                ename: "Kazakhstan",
                short_ename: "kz",
                name: "Казахстан",
                parent: "10000"
            },
            "11119": {
                id: "11119",
                lang: "tt",
                ename: "Tatarstan",
                short_ename: "tt",
                name: "Республика Татарстан",
                parent: "10000"
            },
            "167": {
                id: "167",
                lang: "az",
                ename: "Azerbaijan",
                short_ename: "az",
                name: "Азербайджан",
                parent: "10000"
            },
            "983": {
                id: "983",
                lang: "tr",
                ename: "Turkey",
                short_ename: "tr",
                name: "Турция",
                parent: "10000"
            },
            "20730": {
                id: "20730",
                lang: "en",
                ename: "Mars",
                short_ename: "mars",
                name: "Марс",
                parent: 0,
                hidden: true
            }
        };
        return;
    }
    function $550(__$ctx) {
        if (!(__$ctx["__$anflg4"] !== true) === false) {
            if (!__$ctx["i-global"] === false) {
                if (!!__$ctx["i-geodata"] === false) {
                    return $554(__$ctx);
                } else {
                    return $559(__$ctx);
                }
            } else {
                return $559(__$ctx);
            }
        } else {
            return $559(__$ctx);
        }
    }
    function $554(__$ctx) {
        var __r107, __r108, __r109;
        var _$2f_ctx = __$ctx["i-geodata"] = {}, _$2fiGlobal = __$ctx["i-global"], _$2f_this = __$ctx;
        _$2f_ctx._data = ("", __r107 = __$ctx.block, __$ctx.block = "i-geodata", __r108 = __$ctx._mode, __$ctx._mode = "regions", __r109 = $543(__$ctx), __$ctx.block = __r107, __$ctx._mode = __r108, "", __r109);
        _$2f_ctx._getRegionLang = function(region) {
            return region.lang || _$2f_ctx._getRegionLang(_$2f_ctx._data[region.parent]);
        };
        _$2f_ctx.getRegion = function(region) {
            if (!region) {
                region = {
                    short_ename: _$2fiGlobal["user-region"] || _$2fiGlobal["content-region"]
                };
            } else {
                undefined;
            }
            var id;
            if (!region.id) {
                var regId, field;
                for (regId in _$2f_ctx._data) {
                    for (field in region) {
                        if (region.hasOwnProperty(field) && region[field] === _$2f_ctx._data[regId][field] && !_$2f_ctx._data[regId].hidden) {
                            id = _$2f_ctx._data[regId].id;
                            break;
                        } else {
                            undefined;
                        }
                        if (id) {
                            break;
                        } else {
                            undefined;
                        }
                    }
                }
            } else {
                id = region.id;
            }
            var reg = _$2f_ctx._data[id];
            if (!reg.lang) {
                reg.lang = _$2f_ctx._getRegionLang(reg);
            } else {
                undefined;
            }
            return reg;
        };
        _$2f_ctx.isRegionIn = function(items, field, region) {
            if (field && !_$2f_this._.isSimple(field) && !region) {
                region = field;
                field = false;
            } else {
                undefined;
            }
            if (!field) {
                field = "short_ename";
            } else {
                undefined;
            }
            region = _$2f_ctx.getRegion(region);
            for (var i in items) {
                if (items.hasOwnProperty(i) && items[i] == region[field]) {
                    return region;
                } else {
                    undefined;
                }
            }
            if (region.parent) {
                return _$2f_ctx.isRegionIn(items, field, {
                    id: region.parent
                });
            } else {
                undefined;
            }
            return false;
        };
        {
            "";
            var __r110 = __$ctx["__$anflg4"];
            __$ctx["__$anflg4"] = true;
            $550(__$ctx);
            __$ctx["__$anflg4"] = __r110;
            "";
        }
        undefined;
        return;
    }
    function $559(__$ctx) {
        if (!__$ctx["i-global"] === false) {
            if (!!__$ctx["i-services"] === false) {
                return $562(__$ctx);
            } else {
                return $565(__$ctx);
            }
        } else {
            return $565(__$ctx);
        }
    }
    function $562(__$ctx) {
        var __r89, __r90, __r91;
        var _$1s_ctx = __$ctx["i-services"] = {}, _$1sparams = __$ctx["i-global"];
        _$1s_ctx._data = ("", __r89 = __$ctx.block, __$ctx.block = "i-services", __r90 = __$ctx._mode, __$ctx._mode = "service-url", __r91 = $571(__$ctx), __$ctx.block = __r89, __$ctx._mode = __r90, "", __r91);
        _$1s_ctx.serviceName = function(id) {
            return BEM.I18N("i-services", id || _$1sparams.id);
        };
        _$1s_ctx.serviceUrl = function(id, region) {
            id || (id = _$1sparams.id);
            return _$1s_ctx._data[id](region || _$1sparams["content-region"]);
        };
        applyc(__$ctx);
        undefined;
        return;
    }
    function $565(__$ctx) {
        if (!!__$ctx["i-global"] === false) {
            return $567(__$ctx);
        } else {
            return $651(__$ctx);
        }
    }
    function $567(__$ctx) {
        var __r49, __r50, __r51, __r52, __r53, __r54, __r55;
        var _$fps = {}, _$fes = [ "lang", "tld", "content-region", "click-host", "passport-host", "pass-host", "social-host", "export-host", "login", "lego-static-host" ], _$fe;
        while (_$fe = _$fes.shift()) {
            _$fps[_$fe] = ("", __r49 = __$ctx._mode, __$ctx._mode = "default", __r50 = __$ctx.block, __$ctx.block = "i-global", __r51 = __$ctx.elem, __$ctx.elem = _$fe, __r52 = $125(__$ctx), __$ctx._mode = __r49, __$ctx.block = __r50, __$ctx.elem = __r51, "", __r52);
        }
        __$ctx["i-global"] = __$ctx._.extend(_$fps, ("", __r53 = __$ctx._mode, __$ctx._mode = "env", __r54 = __$ctx.block, __$ctx.block = "i-global", __r55 = $642(__$ctx), __$ctx._mode = __r53, __$ctx.block = __r54, "", __r55));
        applyc(__$ctx);
        undefined;
        return;
    }
    function $571(__$ctx) {
        if (!!__$ctx.elem === false) {
            return $573(__$ctx);
        } else {
            return $651(__$ctx);
        }
    }
    function $573(__$ctx) {
        return {
            serp: function(reg) {
                if (reg === "ru") {
                    return "http://yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://www.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://www.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://yandex.ru";
            },
            mail: function(reg) {
                if (reg === "ru") {
                    return "http://mail.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://mail.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://mail.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://mail.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://mail.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://mail.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://mail.yandex.ru";
            },
            pdd: function(reg) {
                if (reg === "ru") {
                    return "http://pdd.yandex.ru";
                } else {
                    undefined;
                }
                return "http://pdd.yandex.ru";
            },
            zakladki: function(reg) {
                if (reg === "ru") {
                    return "http://zakladki.yandex.ru";
                } else {
                    undefined;
                }
                return "http://zakladki.yandex.ru";
            },
            fotki: function(reg) {
                if (reg === "ru") {
                    return "http://fotki.yandex.ru";
                } else {
                    undefined;
                }
                return "http://fotki.yandex.ru";
            },
            moikrug: function(reg) {
                if (reg === "ru") {
                    return "http://moikrug.ru";
                } else {
                    undefined;
                }
                return "http://moikrug.ru";
            },
            direct: function(reg) {
                if (reg === "ru") {
                    return "http://direct.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://direct.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://direct.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://direct.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://direct.yandex.com";
                } else {
                    undefined;
                }
                return "http://direct.yandex.ru";
            },
            money: function(reg) {
                if (reg === "ru") {
                    return "https://money.yandex.ru";
                } else {
                    undefined;
                }
                return "https://money.yandex.ru";
            },
            lenta: function(reg) {
                if (reg === "ru") {
                    return "http://lenta.yandex.ru";
                } else {
                    undefined;
                }
                return "http://lenta.yandex.ru";
            },
            market: function(reg) {
                if (reg === "ru") {
                    return "http://market.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://market.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://market.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://market.yandex.kz";
                } else {
                    undefined;
                }
                return "http://market.yandex.ru";
            },
            "market.advertising": function(reg) {
                if (reg === "ru") {
                    return "http://welcome.advertising.yandex.ru/market/";
                } else {
                    undefined;
                }
                return "http://welcome.advertising.yandex.ru/market/";
            },
            wow: function(reg) {
                if (reg === "ru") {
                    return "http://my.ya.ru";
                } else {
                    undefined;
                }
                return "http://my.ya.ru";
            },
            tv: function(reg) {
                if (reg === "ru") {
                    return "http://tv.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://tv.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://tv.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://tv.yandex.kz";
                } else {
                    undefined;
                }
                return "http://tv.yandex.ru";
            },
            afisha: function(reg) {
                if (reg === "ru") {
                    return "http://afisha.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://afisha.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://afisha.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://afisha.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://afis.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://afisha.yandex.ru";
            },
            calendar: function(reg) {
                if (reg === "ru") {
                    return "http://calendar.yandex.ru";
                } else {
                    undefined;
                }
                return "http://calendar.yandex.ru";
            },
            nahodki: function(reg) {
                if (reg === "ru") {
                    return "http://nahodki.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://nahodki.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://nahodki.yandex.kz";
                } else {
                    undefined;
                }
                return "http://nahodki.yandex.ru";
            },
            weather: function(reg) {
                if (reg === "ru") {
                    return "http://pogoda.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://pogoda.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://pogoda.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://pogoda.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://hava.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://pogoda.yandex.ru";
            },
            kuda: function(reg) {
                if (reg === "ru") {
                    return "http://kuda.yandex.ru";
                } else {
                    undefined;
                }
                return "http://kuda.yandex.ru";
            },
            video: function(reg) {
                if (reg === "ru") {
                    return "http://video.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://video.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://video.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://video.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://video.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://video.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://video.yandex.ru";
            },
            "video-com": function(reg) {
                if (reg === "ru") {
                    return "http://video.yandex.com";
                } else {
                    undefined;
                }
                return "http://video.yandex.com";
            },
            music: function(reg) {
                if (reg === "ru") {
                    return "http://music.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://music.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://music.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://music.yandex.kz";
                } else {
                    undefined;
                }
                return "http://music.yandex.ru";
            },
            "music-partner": function(reg) {
                if (reg === "ru") {
                    return "http://music-partner.yandex.ru";
                } else {
                    undefined;
                }
                return "http://music-partner.yandex.ru";
            },
            www: function(reg) {
                if (reg === "ru") {
                    return "http://www.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://www.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://www.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://www.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://www.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://www.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://www.yandex.ru";
            },
            search: function(reg) {
                if (reg === "ru") {
                    return "http://yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://yandex.ru";
            },
            review: function(reg) {
                if (reg === "ru") {
                    return "http://yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://www.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://www.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://yandex.ru";
            },
            fresh: function(reg) {
                if (reg === "ru") {
                    return "http://yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://www.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://www.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://yandex.ru";
            },
            news: function(reg) {
                if (reg === "ru") {
                    return "http://news.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://news.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://news.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://news.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://haber.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://news.yandex.ru";
            },
            "news-com": function(reg) {
                if (reg === "ru") {
                    return "http://news.yandex.com";
                } else {
                    undefined;
                }
                return "http://news.yandex.com";
            },
            maps: function(reg) {
                if (reg === "ru") {
                    return "http://maps.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://maps.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://harita.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://maps.yandex.ru";
            },
            "maps-com": function(reg) {
                if (reg === "ru") {
                    return "http://maps.yandex.com";
                } else {
                    undefined;
                }
                return "http://maps.yandex.com";
            },
            probki: function(reg) {
                if (reg === "ru") {
                    return "http://probki.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://probki.yandex.ua";
                } else {
                    undefined;
                }
                return "http://probki.yandex.ru";
            },
            slovari: function(reg) {
                if (reg === "ru") {
                    return "http://slovari.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://slovari.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://slovari.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://slovari.yandex.kz";
                } else {
                    undefined;
                }
                return "http://slovari.yandex.ru";
            },
            images: function(reg) {
                if (reg === "ru") {
                    return "http://images.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://images.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://images.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://images.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://images.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://gorsel.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://images.yandex.ru";
            },
            "images-com": function(reg) {
                if (reg === "ru") {
                    return "http://images.yandex.com";
                } else {
                    undefined;
                }
                return "http://images.yandex.com";
            },
            blogs: function(reg) {
                if (reg === "ru") {
                    return "http://blogs.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://blogs.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://blogs.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://blogs.yandex.kz";
                } else {
                    undefined;
                }
                return "http://blogs.yandex.ru";
            },
            auto: function(reg) {
                if (reg === "ru") {
                    return "http://auto.yandex.ru";
                } else {
                    undefined;
                }
                return "http://auto.yandex.ru";
            },
            adresa: function(reg) {
                if (reg === "ru") {
                    return "http://adresa.yandex.ru";
                } else {
                    undefined;
                }
                return "http://adresa.yandex.ru";
            },
            games: function(reg) {
                if (reg === "ru") {
                    return "http://games.yandex.ru";
                } else {
                    undefined;
                }
                return "http://games.yandex.ru";
            },
            yaca: function(reg) {
                if (reg === "ru") {
                    return "http://yaca.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://yaca.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://yaca.yandex.by";
                } else {
                    undefined;
                }
                return "http://yaca.yandex.ru";
            },
            rasp: function(reg) {
                if (reg === "ru") {
                    return "http://rasp.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://rasp.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://rasp.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://rasp.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://seferler.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://rasp.yandex.ru";
            },
            avia: function(reg) {
                if (reg === "ru") {
                    return "http://ticket.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://ticket.yandex.ua";
                } else {
                    undefined;
                }
                return "http://ticket.yandex.ru";
            },
            ticket: function(reg) {
                return "http://ticket.yandex.ru";
            },
            pvo: function(reg) {
                if (reg === "ru") {
                    return "http://ask.yandex.ru";
                } else {
                    undefined;
                }
                return "http://ask.yandex.ru";
            },
            online: function(reg) {
                if (reg === "ru") {
                    return "http://online.yandex.ru";
                } else {
                    undefined;
                }
                return "http://online.yandex.ru";
            },
            books: function(reg) {
                if (reg === "ru") {
                    return "http://books.yandex.ru";
                } else {
                    undefined;
                }
                return "http://books.yandex.ru";
            },
            site: function(reg) {
                if (reg === "ru") {
                    return "http://site.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://site.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://ozel.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://site.yandex.ru";
            },
            bar: function(reg) {
                if (reg === "ru") {
                    return "http://bar.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://bar.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://bar.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://bar.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://bar.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://bar.yandex.ru";
            },
            widgets: function(reg) {
                if (reg === "ru") {
                    return "http://widgets.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://widgets.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://widgets.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://widgets.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://widgets.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://widgets.yandex.ru";
            },
            wdgt: function(reg) {
                if (reg === "ru") {
                    return "http://wdgt.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://wdgt.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://wdgt.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://wdgt.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://wdgt.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://wdgt.yandex.ru";
            },
            interests: function(reg) {
                if (reg === "ru") {
                    return "http://interests.yandex.ru";
                } else {
                    undefined;
                }
                return "http://interests.yandex.ru";
            },
            kraski: function(reg) {
                if (reg === "ru") {
                    return "http://kraski.yandex.ru";
                } else {
                    undefined;
                }
                return "http://kraski.yandex.ru";
            },
            local: function(reg) {
                if (reg === "ru") {
                    return "http://local.yandex.ru";
                } else {
                    undefined;
                }
                return "http://local.yandex.ru";
            },
            museums: function(reg) {
                if (reg === "ru") {
                    return "http://18.yandex.ru";
                } else {
                    undefined;
                }
                return "http://18.yandex.ru";
            },
            collection: function(reg) {
                if (reg === "ru") {
                    return "http://collection.yandex.ru";
                } else {
                    undefined;
                }
                return "http://collection.yandex.ru";
            },
            company: function(reg) {
                if (reg === "ru") {
                    return "http://company.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://company.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://company.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://company.yandex.ru";
            },
            tests: function(reg) {
                if (reg === "ru") {
                    return "http://tests.yandex.ru";
                } else {
                    undefined;
                }
                return "http://tests.yandex.ru";
            },
            referats: function(reg) {
                if (reg === "ru") {
                    return "http://referats.yandex.ru";
                } else {
                    undefined;
                }
                return "http://referats.yandex.ru";
            },
            terms: function(reg) {
                if (reg === "ru") {
                    return "http://terms.yandex.ru";
                } else {
                    undefined;
                }
                return "http://terms.yandex.ru";
            },
            tune: function(reg) {
                if (reg === "ru") {
                    return "http://tune.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://tune.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://tune.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://tune.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://tune.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://tune.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://tune.yandex.ru";
            },
            api: function(reg) {
                if (reg === "ru") {
                    return "http://api.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://api.yandex.com";
                } else {
                    undefined;
                }
                return "http://api.yandex.ru";
            },
            punto: function(reg) {
                if (reg === "ru") {
                    return "http://punto.yandex.ru";
                } else {
                    undefined;
                }
                return "http://punto.yandex.ru";
            },
            opinion: function(reg) {
                if (reg === "ru") {
                    return "http://opinion.yandex.ru";
                } else {
                    undefined;
                }
                return "http://opinion.yandex.ru";
            },
            perevod: function(reg) {
                if (reg === "ru") {
                    return "http://perevod.yandex.ru";
                } else {
                    undefined;
                }
                return "http://perevod.yandex.ru";
            },
            rabota: function(reg) {
                if (reg === "ru") {
                    return "http://rabota.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://rabota.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://rabota.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://rabota.yandex.kz";
                } else {
                    undefined;
                }
                return "http://rabota.yandex.ru";
            },
            sprav: function(reg) {
                if (reg === "ru") {
                    return "http://sprav.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://sprav.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://sprav.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://sprav.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://rehber.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://sprav.yandex.ru";
            },
            realty: function(reg) {
                if (reg === "ru") {
                    return "http://realty.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://realty.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://realty.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://realty.yandex.kz";
                } else {
                    undefined;
                }
                return "http://realty.yandex.ru";
            },
            advertising: function(reg) {
                if (reg === "ru") {
                    return "http://advertising.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://advertising.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://advertising.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://advertising.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://advertising.yandex.kz";
                } else {
                    undefined;
                }
                return "http://advertising.yandex.ru";
            },
            expert: function(reg) {
                if (reg === "ru") {
                    return "http://expert.yandex.ru";
                } else {
                    undefined;
                }
                return "http://expert.yandex.ru";
            },
            "direct.market": function(reg) {
                if (reg === "ru") {
                    return "http://partner.market.yandex.ru/yandex.market/";
                } else {
                    undefined;
                }
                return "http://partner.market.yandex.ru/yandex.market/";
            },
            ba: function(reg) {
                if (reg === "ru") {
                    return "http://ba.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://ba.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://ba.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://ba.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://ba.yandex.kz";
                } else {
                    undefined;
                }
                return "http://ba.yandex.ru";
            },
            bayan: function(reg) {
                if (reg === "ru") {
                    return "http://bayan.yandex.ru";
                } else {
                    undefined;
                }
                return "http://bayan.yandex.ru";
            },
            partners: function(reg) {
                if (reg === "ru") {
                    return "http://partner.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://partner.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://partner.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://partner.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://partner.yandex.kz";
                } else {
                    undefined;
                }
                return "http://partner.yandex.ru";
            },
            metrika: function(reg) {
                if (reg === "ru") {
                    return "http://metrika.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://metrika.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://metrica.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://metrika.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://metrika.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://metrica.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://metrika.yandex.ru";
            },
            balance: function(reg) {
                if (reg === "ru") {
                    return "http://balance.yandex.ru";
                } else {
                    undefined;
                }
                return "http://balance.yandex.ru";
            },
            wordstat: function(reg) {
                if (reg === "ru") {
                    return "http://wordstat.yandex.ru";
                } else {
                    undefined;
                }
                return "http://wordstat.yandex.ru";
            },
            webmaster: function(reg) {
                if (reg === "ru") {
                    return "http://webmaster.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://webmaster.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://webmaster.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://webmaster.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://webmaster.yandex.ru";
            },
            server: function(reg) {
                if (reg === "ru") {
                    return "http://company.yandex.ru/technology/server/";
                } else {
                    undefined;
                }
                return "http://company.yandex.ru/technology/server/";
            },
            stat: function(reg) {
                if (reg === "ru") {
                    return "http://stat.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://stat.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://stat.yandex.by";
                } else {
                    undefined;
                }
                return "http://stat.yandex.ru";
            },
            mobile: function(reg) {
                if (reg === "ru") {
                    return "http://mobile.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://mobile.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://mobil.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://mobile.yandex.ru";
            },
            help: function(reg) {
                if (reg === "ru") {
                    return "http://help.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://help.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://help.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://yardim.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://help.yandex.ru";
            },
            feedback: function(reg) {
                if (reg === "ru") {
                    return "http://feedback.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://feedback.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://feedback.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://feedback.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://feedback.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://contact.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://feedback.yandex.ru";
            },
            start: function(reg) {
                if (reg === "ru") {
                    return "http://help.yandex.ru/start/";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://help.yandex.ua/start/";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://help.yandex.com/start/";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://yardim.yandex.com.tr/start";
                } else {
                    undefined;
                }
                return "http://help.yandex.ru/start/";
            },
            cityday: function(reg) {
                if (reg === "ru") {
                    return "http://cityday.yandex.ru";
                } else {
                    undefined;
                }
                return "http://cityday.yandex.ru";
            },
            openid: function(reg) {
                if (reg === "ru") {
                    return "http://openid.yandex.ru";
                } else {
                    undefined;
                }
                return "http://openid.yandex.ru";
            },
            oauth: function(reg) {
                if (reg === "ru") {
                    return "http://oauth.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://oauth.yandex.com";
                } else {
                    undefined;
                }
                return "http://oauth.yandex.ru";
            },
            nano: function(reg) {
                if (reg === "ru") {
                    return "http://nano.yandex.ru";
                } else {
                    undefined;
                }
                return "http://nano.yandex.ru";
            },
            partnersearch: function(reg) {
                if (reg === "ru") {
                    return "http://yandex.ru";
                } else {
                    undefined;
                }
                return "http://yandex.ru";
            },
            city: function(reg) {
                if (reg === "ru") {
                    return "http://city.yandex.ru";
                } else {
                    undefined;
                }
                return "http://city.yandex.ru";
            },
            goroda: function(reg) {
                if (reg === "ru") {
                    return "http://goroda.yandex.ru";
                } else {
                    undefined;
                }
                return "http://goroda.yandex.ru";
            },
            toster: function(reg) {
                if (reg === "ru") {
                    return "http://toster.yandex.ru";
                } else {
                    undefined;
                }
                return "http://toster.yandex.ru";
            },
            love: function(reg) {
                if (reg === "ru") {
                    return "http://love.yandex.ru";
                } else {
                    undefined;
                }
                return "http://love.yandex.ru";
            },
            rk: function(reg) {
                if (reg === "ru") {
                    return "http://rk.yandex.ru";
                } else {
                    undefined;
                }
                return "http://rk.yandex.ru";
            },
            lost: function(reg) {
                if (reg === "ru") {
                    return "http://lost.yandex.ru";
                } else {
                    undefined;
                }
                return "http://lost.yandex.ru";
            },
            soft: function(reg) {
                if (reg === "ru") {
                    return "http://soft.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://soft.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://soft.yandex.ru";
            },
            passport: function(reg) {
                if (reg === "ru") {
                    return "https://passport.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "https://passport.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "https://passport.yandex.com.tr";
                } else {
                    undefined;
                }
                return "https://passport.yandex.ru";
            },
            "maps-wiki": function(reg) {
                if (reg === "ru") {
                    return "http://nk.yandex.ru";
                } else {
                    undefined;
                }
                return "http://nk.yandex.ru";
            },
            "404": function(reg) {
                if (reg === "ru") {
                    return "http://404.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://404.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://404.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://404.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://404.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://404.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://404.yandex.ru";
            },
            i: function(reg) {
                if (reg === "ru") {
                    return "http://i.yandex.ru";
                } else {
                    undefined;
                }
                return "http://i.yandex.ru";
            },
            desktop: function(reg) {
                if (reg === "ru") {
                    return "http://desktop.yandex.ru";
                } else {
                    undefined;
                }
                return "http://desktop.yandex.ru";
            },
            ff: function(reg) {
                if (reg === "ru") {
                    return "http://ff.yandex.ru";
                } else {
                    undefined;
                }
                return "http://ff.yandex.ru";
            },
            fx: function(reg) {
                if (reg === "ru") {
                    return "http://fx.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://fx.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://fx.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://fx.yandex.ru";
            },
            ie: function(reg) {
                if (reg === "ru") {
                    return "http://ie.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://ie.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://ie.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://ie.yandex.ru";
            },
            "bar-ie": function(reg) {
                if (reg === "ru") {
                    return "http://bar.yandex.ru/ie";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://bar.yandex.ua/ie";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://bar.yandex.com/ie";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://bar.yandex.by/ie";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://bar.yandex.kz/ie";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://bar.yandex.com.tr/ie";
                } else {
                    undefined;
                }
                return "http://bar.yandex.ru/ie";
            },
            "bar-ie9": function(reg) {
                if (reg === "ru") {
                    return "http://bar.yandex.ru/ie";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://bar.yandex.ua/ie";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://bar.yandex.com/ie";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://bar.yandex.by/ie";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://bar.yandex.kz/ie";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://bar.yandex.com.tr/ie";
                } else {
                    undefined;
                }
                return "http://bar.yandex.ru/ie";
            },
            internet: function(reg) {
                if (reg === "ru") {
                    return "http://internet.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://internet.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://internet.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://internet.yandex.ru";
            },
            keyboard: function(reg) {
                if (reg === "ru") {
                    return "http://www.yandex.ru/index_engl_qwerty.html";
                } else {
                    undefined;
                }
                return "http://www.yandex.ru/index_engl_qwerty.html";
            },
            metro: function(reg) {
                if (reg === "ru") {
                    return "http://metro.yandex.ru";
                } else {
                    undefined;
                }
                return "http://metro.yandex.ru";
            },
            pulse: function(reg) {
                if (reg === "ru") {
                    return "http://blogs.yandex.ru/pulse";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://blogs.yandex.ua/pulse";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://blogs.yandex.by/pulse";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://blogs.yandex.kz/pulse";
                } else {
                    undefined;
                }
                return "http://blogs.yandex.ru/pulse";
            },
            school: function(reg) {
                if (reg === "ru") {
                    return "http://school.yandex.ru";
                } else {
                    undefined;
                }
                return "http://school.yandex.ru";
            },
            so: function(reg) {
                if (reg === "ru") {
                    return "http://so.yandex.ru";
                } else {
                    undefined;
                }
                return "http://so.yandex.ru";
            },
            time: function(reg) {
                if (reg === "ru") {
                    return "http://time.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://time.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://time.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://time.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://time.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://saat.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://time.yandex.ru";
            },
            xmlsearch: function(reg) {
                if (reg === "ru") {
                    return "http://xml.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://xml.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://xml.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://xml.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://xml.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://xml.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://xml.yandex.ru";
            },
            catalogwdgt: function(reg) {
                if (reg === "ru") {
                    return "http://www.yandex.ru/catalog";
                } else {
                    undefined;
                }
                return "http://www.yandex.ru/catalog";
            },
            opera: function(reg) {
                if (reg === "ru") {
                    return "http://opera.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://opera.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://opera.yandex.ru";
            },
            uslugi: function(reg) {
                if (reg === "ru") {
                    return "http://uslugi.yandex.ru";
                } else {
                    undefined;
                }
                return "http://uslugi.yandex.ru";
            },
            backapv: function(reg) {
                if (reg === "ru") {
                    return "http://backapv.yandex.ru";
                } else {
                    undefined;
                }
                return "http://backapv.yandex.ru";
            },
            chrome: function(reg) {
                if (reg === "ru") {
                    return "http://chrome.yandex.ru";
                } else {
                    undefined;
                }
                return "http://chrome.yandex.ru";
            },
            browser: function(reg) {
                if (reg === "ru") {
                    return "http://browser.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://browser.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://browser.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://browser.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://browser.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://browser.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://browser.yandex.ru";
            },
            aziada: function(reg) {
                if (reg === "ru") {
                    return "http://aziada2011.yandex.kz";
                } else {
                    undefined;
                }
                return "http://aziada2011.yandex.kz";
            },
            translate: function(reg) {
                if (reg === "ru") {
                    return "http://translate.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://translate.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://translate.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://translate.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://translate.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://ceviri.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://translate.yandex.ru";
            },
            subs: function(reg) {
                if (reg === "ru") {
                    return "http://subs.yandex.ru";
                } else {
                    undefined;
                }
                return "http://subs.yandex.ru";
            },
            all: function(reg) {
                if (reg === "ru") {
                    return "http://www.yandex.ru/all";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://www.yandex.ua/all";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://www.yandex.com/all";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://www.yandex.by/all";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://www.yandex.kz/all";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://www.yandex.com.tr/all";
                } else {
                    undefined;
                }
                return "http://www.yandex.ru/all";
            },
            large: function(reg) {
                if (reg === "ru") {
                    return "http://large.yandex.ru";
                } else {
                    undefined;
                }
                return "http://large.yandex.ru";
            },
            geocontext: function(reg) {
                if (reg === "ru") {
                    return "http://geocontext.yandex.ru";
                } else {
                    undefined;
                }
                return "http://geocontext.yandex.ru";
            },
            root: function(reg) {
                if (reg === "ru") {
                    return "http://root.yandex.ru";
                } else {
                    undefined;
                }
                return "http://root.yandex.ru";
            },
            yamb: function(reg) {
                if (reg === "ru") {
                    return "https://yamb.yandex.ru";
                } else {
                    undefined;
                }
                return "https://yamb.yandex.ru";
            },
            legal: function(reg) {
                if (reg === "ru") {
                    return "http://legal.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://legal.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://legal.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://legal.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://legal.yandex.ru";
            },
            taxi: function(reg) {
                if (reg === "ru") {
                    return "https://taxi.yandex.ru";
                } else {
                    undefined;
                }
                return "https://taxi.yandex.ru";
            },
            social: function(reg) {
                if (reg === "ru") {
                    return "https://social.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "https://social.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "https://social.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "https://social.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "https://social.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "https://social.yandex.com.tr";
                } else {
                    undefined;
                }
                return "https://social.yandex.ru";
            },
            contest: function(reg) {
                if (reg === "ru") {
                    return "http://contest.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://contest.yandex.com";
                } else {
                    undefined;
                }
                return "http://contest.yandex.ru";
            },
            peoplesearch: function(reg) {
                if (reg === "ru") {
                    return "http://people.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://people.yandex.ua";
                } else {
                    undefined;
                }
                return "http://people.yandex.ru";
            },
            disk: function(reg) {
                if (reg === "ru") {
                    return "http://disk.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "com") {
                    return "http://disk.yandex.com";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://disk.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://disk.yandex.ru";
            },
            sport: function(reg) {
                if (reg === "ru") {
                    return "http://sport.yandex.ru";
                } else {
                    undefined;
                }
                if (reg === "by") {
                    return "http://sport.yandex.by";
                } else {
                    undefined;
                }
                if (reg === "ua") {
                    return "http://sport.yandex.ua";
                } else {
                    undefined;
                }
                if (reg === "kz") {
                    return "http://sport.yandex.kz";
                } else {
                    undefined;
                }
                if (reg === "tr") {
                    return "http://spor.yandex.com.tr";
                } else {
                    undefined;
                }
                return "http://sport.yandex.ru";
            },
            literacy: function(reg) {
                if (reg === "ru") {
                    return "http://literacy.yandex.ru";
                } else {
                    undefined;
                }
                return "http://literacy.yandex.ru";
            },
            appsearch: function(reg) {
                if (reg === "ru") {
                    return "//appsearch.yandex.ru";
                } else {
                    undefined;
                }
                return "//appsearch.yandex.ru";
            },
            ege: function(reg) {
                if (reg === "ru") {
                    return "//ege.yandex.ru";
                } else {
                    undefined;
                }
                return "//ege.yandex.ru";
            }
        };
        return;
    }
    function $578(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js" || __t === "css" || __t === "favicon" || __t === "meta" || __t === "head" || __t === "root") {
                return false;
                return;
            } else {
                return $600(__$ctx);
            }
        } else if (__t === "i-ua") {
            if (!!__$ctx.elem === false) {
                return false;
                return;
            } else {
                return $600(__$ctx);
            }
        } else {
            return $600(__$ctx);
        }
    }
    function $600(__$ctx) {
        return undefined;
        return;
    }
    function $604(__$ctx) {
        return {
            tag: "meta",
            attrs: {
                "http-equiv": "X-UA-Compatible",
                content: "IE=EmulateIE7, IE=edge"
            }
        };
        return;
    }
    function $609(__$ctx) {
        if (__$ctx.block === "b-page") {
            if (__$ctx.elem === "root") {
                return "i-ua_js_no i-ua_css_standard";
                return;
            } else {
                return $616(__$ctx);
            }
        } else {
            return $616(__$ctx);
        }
    }
    function $616(__$ctx) {
        return undefined;
        return;
    }
    function $620(__$ctx) {
        return __$ctx.ctx.doctype || "<!DOCTYPE html>";
        return;
    }
    function $628(__$ctx) {
        var __r56, __r57, __r58, __r59;
        var _$t_this = __$ctx["i-global"], _$tjs = {}, _$tblock = {
            block: "i-global",
            js: _$tjs
        }, _$te;
        for (_$te in _$t_this) {
            if (_$t_this.hasOwnProperty(_$te) && ("", __r56 = __$ctx._mode, __$ctx._mode = "public-params", __r57 = __$ctx.block, __$ctx.block = "i-global", __r58 = __$ctx.elem, __$ctx.elem = _$te, __r59 = $634(__$ctx), __$ctx._mode = __r56, __$ctx.block = __r57, __$ctx.elem = __r58, "", __r59)) {
                _$tjs[_$te] = _$t_this[_$te];
            } else {
                undefined;
            }
        }
        return _$tblock;
        return;
    }
    function $634(__$ctx) {
        if (!__$ctx.elem === false) {
            return {
                id: 1,
                lang: 1,
                tld: 1,
                "content-region": 1,
                "user-region": 1,
                login: 1,
                displayName: 1,
                index: 1,
                yandexuid: 1,
                "passport-host": 1,
                "pass-host": 1,
                "passport-msg": 1,
                "static-host": 1,
                "lego-static-host": 1,
                "social-host": 1,
                clck: 1,
                "click-host": 1,
                "export-host": 1,
                "i-host": 1,
                "social-retpath": 1,
                "lego-path": 1,
                sid: 1,
                retpath: 1,
                uid: 1
            }[__$ctx.elem] || false;
            return;
        } else {
            return $651(__$ctx);
        }
    }
    function $642(__$ctx) {
        if (!!__$ctx.elem === false) {
            return {};
            return;
        } else {
            return $651(__$ctx);
        }
    }
    function $650(__$ctx) {
        return undefined;
        return;
    }
    function $651(__$ctx) {
        if (!__$ctx.ctx === false) {
            if (!__$ctx.ctx.link === false) {
                if (!!__$ctx._.isSimple(__$ctx.ctx) === false) {
                    return $655(__$ctx);
                } else {
                    return $660(__$ctx);
                }
            } else {
                return $660(__$ctx);
            }
        } else {
            return $660(__$ctx);
        }
    }
    function $655(__$ctx) {
        var __r47, __r48;
        function _$6follow() {
            if (this.ctx.link === "no-follow") {
                return undefined;
            } else {
                undefined;
            }
            var data = this._links[this.ctx.link];
            return "", __r47 = this.ctx, this.ctx = data, __r48 = $1(__$ctx), this.ctx = __r47, "", __r48;
        }
        if (!cache || !__$ctx._cacheLog) {
            return _$6follow.call(__$ctx);
        } else {
            undefined;
        }
        var _$6contents = __$ctx._buf.slice(__$ctx._cachePos).join("");
        __$ctx._cachePos = __$ctx._buf.length;
        __$ctx._cacheLog.push(_$6contents, {
            log: __$ctx._localLog.slice(),
            link: __$ctx.ctx.link
        });
        var _$6res = _$6follow.call(__$ctx);
        __$ctx._cachePos = __$ctx._buf.length;
        return _$6res;
        return;
    }
    function $660(__$ctx) {
        if (!cache === false) {
            if (!__$ctx.ctx === false) {
                if (!__$ctx.ctx.cache === false) {
                    return $664(__$ctx);
                } else {
                    return $669(__$ctx);
                }
            } else {
                return $669(__$ctx);
            }
        } else {
            return $669(__$ctx);
        }
    }
    function $664(__$ctx) {
        var _$5cached;
        function _$5setProperty(obj, key, value) {
            if (key.length === 0) {
                return undefined;
            } else {
                undefined;
            }
            if (Array.isArray(value)) {
                var target = obj;
                for (var i = 0; i < value.length - 1; i++) {
                    target = target[value[i]];
                }
                value = target[value[i]];
            } else {
                undefined;
            }
            var host = obj, previous;
            for (var i = 0; i < key.length - 1; i++) {
                host = host[key[i]];
            }
            previous = host[key[i]];
            host[key[i]] = value;
            return previous;
        }
        if (_$5cached = cache.get(__$ctx.ctx.cache)) {
            var _$5oldLinks = __$ctx._links;
            if (__$ctx.ctx.links) {
                __$ctx._links = __$ctx.ctx.links;
            } else {
                undefined;
            }
            for (var _$5i = 0; _$5i < _$5cached.log.length; _$5i++) {
                if (typeof _$5cached.log[_$5i] === "string") {
                    __$ctx._buf.push(_$5cached.log[_$5i]);
                    continue;
                } else {
                    undefined;
                }
                var _$5log = _$5cached.log[_$5i], _$5reverseLog;
                _$5reverseLog = _$5log.log.map(function(entry) {
                    return {
                        key: entry[0],
                        value: _$5setProperty(this, entry[0], entry[1])
                    };
                }, __$ctx).reverse();
                {
                    "";
                    var __r37 = __$ctx.ctx, __r38 = __r37.cache;
                    __r37.cache = null;
                    var __r39 = __$ctx._cacheLog;
                    __$ctx._cacheLog = null;
                    var __r40 = __$ctx.ctx, __r41 = __r40.link;
                    __r40.link = _$5log.link;
                    $1(__$ctx);
                    __r37.cache = __r38;
                    __$ctx._cacheLog = __r39;
                    __r40.link = __r41;
                    "";
                }
                undefined;
                _$5reverseLog.forEach(function(entry) {
                    _$5setProperty(this, entry.key, entry.value);
                }, __$ctx);
            }
            __$ctx._links = _$5oldLinks;
            return _$5cached.res;
        } else {
            undefined;
        }
        var _$5cacheLog = [], _$5res;
        {
            "";
            var __r42 = __$ctx.ctx, __r43 = __r42.cache;
            __r42.cache = null;
            var __r44 = __$ctx._cachePos;
            __$ctx._cachePos = __$ctx._buf.length;
            var __r45 = __$ctx._cacheLog;
            __$ctx._cacheLog = _$5cacheLog;
            var __r46 = __$ctx._localLog;
            __$ctx._localLog = [];
            {
                _$5res = $1(__$ctx);
                var _$5tail = __$ctx._buf.slice(__$ctx._cachePos).join("");
                if (_$5tail) {
                    _$5cacheLog.push(_$5tail);
                } else {
                    undefined;
                }
            }
            __r42.cache = __r43;
            __$ctx._cachePos = __r44;
            __$ctx._cacheLog = __r45;
            __$ctx._localLog = __r46;
            "";
        }
        cache.set(__$ctx.ctx.cache, {
            log: _$5cacheLog,
            res: _$5res
        });
        return _$5res;
        return;
    }
    function $669(__$ctx) {
        var __t = __$ctx._mode;
        if (__t === "default") {
            return $671(__$ctx);
        } else if (__t === "") {
            if (!__$ctx._.isSimple(__$ctx.ctx) === false) {
                __$ctx._listLength--;
                var _$3ctx = __$ctx.ctx;
                (_$3ctx && _$3ctx !== true || _$3ctx === 0) && __$ctx._buf.push(_$3ctx);
                return;
            } else {
                if (!!__$ctx.ctx === false) {
                    __$ctx._listLength--;
                    return;
                } else {
                    if (!__$ctx._.isArray(__$ctx.ctx) === false) {
                        return $680(__$ctx);
                    } else {
                        if (!true === false) {
                            return $683(__$ctx);
                        } else {
                            return $e(__$ctx);
                        }
                    }
                }
            }
        } else {
            return $e(__$ctx);
        }
    }
    function $671(__$ctx) {
        var __r20, __r8, __r12, __r13, __r14, __r15, __r16, __r17, __r18, __r19, __r9, __r21, __r22, __r23, __r26, __r27, __r28, __r29, __r30, __r31;
        var _$4_this = __$ctx, _$4BEM_ = _$4_this.BEM, _$4v = __$ctx.ctx, _$4buf = __$ctx._buf, _$4tag;
        _$4tag = ("", __r8 = __$ctx._mode, __$ctx._mode = "tag", __r9 = $154(__$ctx), __$ctx._mode = __r8, "", __r9);
        typeof _$4tag != "undefined" || (_$4tag = _$4v.tag);
        typeof _$4tag != "undefined" || (_$4tag = "div");
        if (_$4tag) {
            var _$4jsParams, _$4js;
            if (__$ctx.block && _$4v.js !== false) {
                _$4js = ("", __r12 = __$ctx._mode, __$ctx._mode = "js", __r13 = $505(__$ctx), __$ctx._mode = __r12, "", __r13);
                _$4js = _$4js ? __$ctx._.extend(_$4v.js, _$4js === true ? {} : _$4js) : _$4v.js === true ? {} : _$4v.js;
                _$4js && ((_$4jsParams = {})[_$4BEM_.INTERNAL.buildClass(__$ctx.block, _$4v.elem)] = _$4js);
            } else {
                undefined;
            }
            _$4buf.push("<", _$4tag);
            var _$4isBEM = ("", __r14 = __$ctx._mode, __$ctx._mode = "bem", __r15 = $578(__$ctx), __$ctx._mode = __r14, "", __r15);
            typeof _$4isBEM != "undefined" || (_$4isBEM = typeof _$4v.bem != "undefined" ? _$4v.bem : _$4v.block || _$4v.elem);
            var _$4cls = ("", __r16 = __$ctx._mode, __$ctx._mode = "cls", __r17 = $609(__$ctx), __$ctx._mode = __r16, "", __r17);
            _$4cls || (_$4cls = _$4v.cls);
            var _$4addJSInitClass = _$4v.block && _$4jsParams;
            if (_$4isBEM || _$4cls) {
                _$4buf.push(' class="');
                if (_$4isBEM) {
                    _$4BEM_.INTERNAL.buildClasses(__$ctx.block, _$4v.elem, _$4v.elemMods || _$4v.mods, _$4buf);
                    var _$4mix = ("", __r18 = __$ctx._mode, __$ctx._mode = "mix", __r19 = $476(__$ctx), __$ctx._mode = __r18, "", __r19);
                    _$4v.mix && (_$4mix = _$4mix ? _$4mix.concat(_$4v.mix) : _$4v.mix);
                    if (_$4mix) {
                        var _$4visited = {};
                        function _$4visitedKey(block, elem) {
                            return (block || "") + "__" + (elem || "");
                        }
                        _$4visited[_$4visitedKey(__$ctx.block, __$ctx.elem)] = true;
                        if (!__$ctx._.isArray(_$4mix)) {
                            _$4mix = [ _$4mix ];
                        } else {
                            undefined;
                        }
                        for (var _$4i = 0; _$4i < _$4mix.length; _$4i++) {
                            var _$4mixItem = _$4mix[_$4i];
                            if (!_$4mixItem) {
                                continue;
                            } else {
                                undefined;
                            }
                            var _$4hasItem = _$4mixItem.block || _$4mixItem.elem, _$4block = _$4mixItem.block || _$4mixItem._block || _$4_this.block, _$4elem = _$4mixItem.elem || _$4mixItem._elem || _$4_this.elem;
                            _$4hasItem && _$4buf.push(" ");
                            _$4BEM_.INTERNAL[_$4hasItem ? "buildClasses" : "buildModsClasses"](_$4block, _$4mixItem.elem || _$4mixItem._elem || (_$4mixItem.block ? undefined : _$4_this.elem), _$4mixItem.elemMods || _$4mixItem.mods, _$4buf);
                            if (_$4mixItem.js) {
                                (_$4jsParams || (_$4jsParams = {}))[_$4BEM_.INTERNAL.buildClass(_$4block, _$4mixItem.elem)] = _$4mixItem.js === true ? {} : _$4mixItem.js;
                                _$4addJSInitClass || (_$4addJSInitClass = _$4block && !_$4mixItem.elem);
                            } else {
                                undefined;
                            }
                            if (_$4hasItem && !_$4visited[_$4visitedKey(_$4block, _$4elem)]) {
                                _$4visited[_$4visitedKey(_$4block, _$4elem)] = true;
                                var _$4nestedMix = ("", __r20 = __$ctx.block, __$ctx.block = _$4block, __r21 = __$ctx.elem, __$ctx.elem = _$4elem, __r22 = __$ctx._mode, __$ctx._mode = "mix", __r23 = $476(__$ctx), __$ctx.block = __r20, __$ctx.elem = __r21, __$ctx._mode = __r22, "", __r23);
                                if (_$4nestedMix) {
                                    for (var _$4j = 0; _$4j < _$4nestedMix.length; _$4j++) {
                                        var _$4nestedItem = _$4nestedMix[_$4j];
                                        if (!_$4nestedItem.block && !_$4nestedItem.elem || !_$4visited[_$4visitedKey(_$4nestedItem.block, _$4nestedItem.elem)]) {
                                            _$4nestedItem._block = _$4block;
                                            _$4nestedItem._elem = _$4elem;
                                            _$4mix.splice(_$4i + 1, 0, _$4nestedItem);
                                        } else {
                                            undefined;
                                        }
                                    }
                                } else {
                                    undefined;
                                }
                            } else {
                                undefined;
                            }
                        }
                    } else {
                        undefined;
                    }
                } else {
                    undefined;
                }
                _$4cls && _$4buf.push(_$4isBEM ? " " : "", _$4cls);
                _$4addJSInitClass && _$4buf.push(" i-bem");
                _$4buf.push('"');
            } else {
                undefined;
            }
            if (_$4jsParams) {
                var _$4jsAttr = ("", __r26 = __$ctx._mode, __$ctx._mode = "jsAttr", __r27 = $650(__$ctx), __$ctx._mode = __r26, "", __r27);
                _$4buf.push(" ", _$4jsAttr || "onclick", '="return ', __$ctx._.attrEscape(JSON.stringify(_$4jsParams)), '"');
            } else {
                undefined;
            }
            var _$4attrs = ("", __r28 = __$ctx._mode, __$ctx._mode = "attrs", __r29 = $406(__$ctx), __$ctx._mode = __r28, "", __r29);
            _$4attrs = __$ctx._.extend(_$4attrs, _$4v.attrs);
            if (_$4attrs) {
                var _$4name;
                for (_$4name in _$4attrs) {
                    if (_$4attrs[_$4name] === undefined) {
                        continue;
                    } else {
                        undefined;
                    }
                    _$4buf.push(" ", _$4name, '="', __$ctx._.attrEscape(_$4attrs[_$4name]), '"');
                }
            } else {
                undefined;
            }
        } else {
            undefined;
        }
        if (__$ctx._.isShortTag(_$4tag)) {
            _$4buf.push("/>");
        } else {
            _$4tag && _$4buf.push(">");
            var _$4content = ("", __r30 = __$ctx._mode, __$ctx._mode = "content", __r31 = $295(__$ctx), __$ctx._mode = __r30, "", __r31);
            if (_$4content || _$4content === 0) {
                var _$4isBEM = __$ctx.block || __$ctx.elem;
                {
                    "";
                    var __r32 = __$ctx._notNewList;
                    __$ctx._notNewList = false;
                    var __r33 = __$ctx.position;
                    __$ctx.position = _$4isBEM ? 1 : __$ctx.position;
                    var __r34 = __$ctx._listLength;
                    __$ctx._listLength = _$4isBEM ? 1 : __$ctx._listLength;
                    var __r35 = __$ctx.ctx;
                    __$ctx.ctx = _$4content;
                    var __r36 = __$ctx._mode;
                    __$ctx._mode = "";
                    $550(__$ctx);
                    __$ctx._notNewList = __r32;
                    __$ctx.position = __r33;
                    __$ctx._listLength = __r34;
                    __$ctx.ctx = __r35;
                    __$ctx._mode = __r36;
                    "";
                }
                undefined;
            } else {
                undefined;
            }
            _$4tag && _$4buf.push("</", _$4tag, ">");
        }
        return;
    }
    function $680(__$ctx) {
        var _$1v = __$ctx.ctx, _$1l = _$1v.length, _$1i = 0, _$1prevPos = __$ctx.position, _$1prevNotNewList = __$ctx._notNewList;
        if (_$1prevNotNewList) {
            __$ctx._listLength += _$1l - 1;
        } else {
            __$ctx.position = 0;
            __$ctx._listLength = _$1l;
        }
        __$ctx._notNewList = true;
        while (_$1i < _$1l) {
            var _$1newCtx = _$1v[_$1i++];
            {
                "";
                var __r7 = __$ctx.ctx;
                __$ctx.ctx = _$1newCtx == null ? "" : _$1newCtx;
                $550(__$ctx);
                __$ctx.ctx = __r7;
                "";
            }
            undefined;
        }
        _$1prevNotNewList || (__$ctx.position = _$1prevPos);
        return;
    }
    function $683(__$ctx) {
        var _$0vBlock = __$ctx.ctx.block, _$0vElem = __$ctx.ctx.elem, _$0block = __$ctx._currBlock || __$ctx.block;
        __$ctx.ctx || (__$ctx.ctx = {});
        {
            "";
            var __r0 = __$ctx._mode;
            __$ctx._mode = "default";
            var __r1 = __$ctx._links;
            __$ctx._links = __$ctx.ctx.links || __$ctx._links;
            var __r2 = __$ctx.block;
            __$ctx.block = _$0vBlock || (_$0vElem ? _$0block : undefined);
            var __r3 = __$ctx._currBlock;
            __$ctx._currBlock = _$0vBlock || _$0vElem ? undefined : _$0block;
            var __r4 = __$ctx.elem;
            __$ctx.elem = __$ctx.ctx.elem;
            var __r5 = __$ctx.mods;
            __$ctx.mods = (_$0vBlock ? __$ctx.ctx.mods : __$ctx.mods) || {};
            var __r6 = __$ctx.elemMods;
            __$ctx.elemMods = __$ctx.ctx.elemMods || {};
            {
                __$ctx.block || __$ctx.elem ? __$ctx.position = (__$ctx.position || 0) + 1 : __$ctx._listLength--;
                $2(__$ctx);
                undefined;
            }
            __$ctx._mode = __r0;
            __$ctx._links = __r1;
            __$ctx.block = __r2;
            __$ctx._currBlock = __r3;
            __$ctx.elem = __r4;
            __$ctx.mods = __r5;
            __$ctx.elemMods = __r6;
            "";
        }
        return;
    }
    function $e(__$ctx) {
        throw new Error(this);
        return;
    }
    !function oninit() {
        (function(global, bem_) {
            if (bem_.I18N) {
                return undefined;
            } else {
                undefined;
            }
            global.BEM = bem_;
            var i18n = bem_.I18N = function(keyset, key) {
                return key;
            };
            i18n.keyset = function() {
                return i18n;
            };
            i18n.key = function(key) {
                return key;
            };
            i18n.lang = function() {
                return undefined;
            };
        })(this, typeof BEM === "undefined" ? {} : BEM);
    }();
    !function oninit() {
        var BEM_ = {}, toString = Object.prototype.toString, SHORT_TAGS = {
            area: 1,
            base: 1,
            br: 1,
            col: 1,
            command: 1,
            embed: 1,
            hr: 1,
            img: 1,
            input: 1,
            keygen: 1,
            link: 1,
            meta: 1,
            param: 1,
            source: 1,
            wbr: 1
        };
        (function(BEM, undefined) {
            var MOD_DELIM = "_", ELEM_DELIM = "__", NAME_PATTERN = "[a-zA-Z0-9-]+";
            function buildModPostfix(modName, modVal, buffer) {
                buffer.push(MOD_DELIM, modName, MOD_DELIM, modVal);
            }
            function buildBlockClass(name, modName, modVal, buffer) {
                buffer.push(name);
                modVal && buildModPostfix(modName, modVal, buffer);
            }
            function buildElemClass(block, name, modName, modVal, buffer) {
                buildBlockClass(block, undefined, undefined, buffer);
                buffer.push(ELEM_DELIM, name);
                modVal && buildModPostfix(modName, modVal, buffer);
            }
            BEM.INTERNAL = {
                NAME_PATTERN: NAME_PATTERN,
                MOD_DELIM: MOD_DELIM,
                ELEM_DELIM: ELEM_DELIM,
                buildModPostfix: function(modName, modVal, buffer) {
                    var res = buffer || [];
                    buildModPostfix(modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildClass: function(block, elem, modName, modVal, buffer) {
                    var typeOf = typeof modName;
                    if (typeOf == "string") {
                        if (typeof modVal != "string") {
                            buffer = modVal;
                            modVal = modName;
                            modName = elem;
                            elem = undefined;
                        } else {
                            undefined;
                        }
                    } else {
                        if (typeOf != "undefined") {
                            buffer = modName;
                            modName = undefined;
                        } else {
                            if (elem && typeof elem != "string") {
                                buffer = elem;
                                elem = undefined;
                            } else {
                                undefined;
                            }
                        }
                    }
                    if (!(elem || modName || buffer)) {
                        return block;
                    } else {
                        undefined;
                    }
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, modName, modVal, res) : buildBlockClass(block, modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildModsClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    if (mods) {
                        var modName;
                        for (modName in mods) {
                            if (!mods.hasOwnProperty(modName)) {
                                continue;
                            } else {
                                undefined;
                            }
                            var modVal = mods[modName];
                            if (modVal == null) {
                                continue;
                            } else {
                                undefined;
                            }
                            modVal = mods[modName] + "";
                            if (!modVal) {
                                continue;
                            } else {
                                undefined;
                            }
                            res.push(" ");
                            if (elem) {
                                buildElemClass(block, elem, modName, modVal, res);
                            } else {
                                buildBlockClass(block, modName, modVal, res);
                            }
                        }
                    } else {
                        undefined;
                    }
                    return buffer ? res : res.join("");
                },
                buildClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, undefined, undefined, res) : buildBlockClass(block, undefined, undefined, res);
                    this.buildModsClasses(block, elem, mods, buffer);
                    return buffer ? res : res.join("");
                }
            };
        })(BEM_);
        var buildEscape = function() {
            var ts = {
                '"': "&quot;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;"
            }, f = function(t) {
                return ts[t] || t;
            };
            return function(r) {
                r = new RegExp(r, "g");
                return function(s) {
                    return ("" + s).replace(r, f);
                };
            };
        }();
        function BEMContext(context, apply_) {
            this.ctx = typeof context === null ? "" : context;
            this.apply = apply_;
            this._buf = [];
            this._ = this;
            this._start = true;
            this._mode = "";
            this._listLength = 0;
            this._notNewList = false;
            this.position = 0;
            this.block = undefined;
            this.elem = undefined;
            this.mods = undefined;
            this.elemMods = undefined;
        }
        BEMContext.prototype.isArray = function isArray(obj) {
            return toString.call(obj) === "[object Array]";
        };
        BEMContext.prototype.isSimple = function isSimple(obj) {
            var t = typeof obj;
            return t === "string" || t === "number" || t === "boolean";
        };
        BEMContext.prototype.isShortTag = function isShortTag(t) {
            return SHORT_TAGS.hasOwnProperty(t);
        };
        BEMContext.prototype.extend = function extend(o1, o2) {
            if (!o1 || !o2) {
                return o1 || o2;
            } else {
                undefined;
            }
            var res = {}, n;
            for (n in o1) {
                o1.hasOwnProperty(n) && (res[n] = o1[n]);
            }
            for (n in o2) {
                o2.hasOwnProperty(n) && (res[n] = o2[n]);
            }
            return res;
        };
        BEMContext.prototype.identify = function() {
            var cnt = 0, id = BEM_["__id"] = +(new Date), expando = "__" + id, get = function() {
                return "uniq" + id + ++cnt;
            };
            return function(obj, onlyGet) {
                if (!obj) {
                    return get();
                } else {
                    undefined;
                }
                if (onlyGet || obj[expando]) {
                    return obj[expando];
                } else {
                    return obj[expando] = get();
                }
            };
        }();
        BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
        BEMContext.prototype.attrEscape = buildEscape('["&<>]');
        BEMContext.prototype.BEM = BEM_;
        BEMContext.prototype.isFirst = function isFirst() {
            return this.position === 1;
        };
        BEMContext.prototype.isLast = function isLast() {
            return this.position === this._listLength;
        };
        BEMContext.prototype.generateId = function generateId() {
            return this.identify(this.ctx);
        };
        exports.apply = BEMContext.apply = function _apply() {
            var ctx = new BEMContext(this, apply);
            ctx.apply();
            return ctx._buf.join("");
        };
    }();
    return exports;
    exports.apply = apply;
    function apply(ctx) {
        return applyc(ctx || this);
    }
    function applyc(__$ctx) {
        return $1(__$ctx);
    }
    return exports;
})(typeof exports === "undefined" ? {} : exports);;
  return function(options) {
    var context = this;
    if (!options) options = {};
    cache = options.cache;
    return function() {
      if (context === this) context = undefined;
      return xjst.apply.call(
[context]
      );
    }.call(null);
  };
}();
typeof exports === "undefined" || (exports.BEMHTML = BEMHTML);