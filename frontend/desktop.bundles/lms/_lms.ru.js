/* ../../libs/bem-bl/blocks-common/i-jquery/__inherit/i-jquery__inherit.js begin */
/**
 * Inheritance plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.3.5
 */

(function($) {

var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
    emptyBase = function() {},
    objCreate = Object.create || function(ptp) {
        var inheritance = function() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
    needCheckProps = true,
    testPropObj = { toString : '' };

for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
    testPropObj.hasOwnProperty(i) && (needCheckProps = false);
}

var specProps = needCheckProps? ['toString', 'valueOf'] : null;

function override(base, result, add) {

    var hasSpecProps = false;
    if(needCheckProps) {
        var addList = [];
        $.each(specProps, function() {
            add.hasOwnProperty(this) && (hasSpecProps = true) && addList.push({
                name : this,
                val  : add[this]
            });
        });
        if(hasSpecProps) {
            $.each(add, function(name) {
                addList.push({
                    name : name,
                    val  : this
                });
            });
            add = addList;
        }
    }

    $.each(add, function(name, prop) {
        if(hasSpecProps) {
            name = prop.name;
            prop = prop.val;
        }
        if($.isFunction(prop) &&
           (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {

            var baseMethod = base[name] || function() {};
            result[name] = function() {
                var baseSaved = this.__base;
                this.__base = baseMethod;
                var result = prop.apply(this, arguments);
                this.__base = baseSaved;
                return result;
            };

        }
        else {
            result[name] = prop;
        }

    });

}

$.inherit = function() {

    var args = arguments,
        hasBase = $.isFunction(args[0]),
        base = hasBase? args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        result = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } : function() {};

    if(!hasBase) {
        result.prototype = props;
        result.prototype.__self = result.prototype.constructor = result;
        return $.extend(result, staticProps);
    }

    $.extend(result, base);

    var basePtp = base.prototype,
        resultPtp = result.prototype = objCreate(basePtp);

    resultPtp.__self = resultPtp.constructor = result;

    override(basePtp, resultPtp, props);
    staticProps && override(base, result, staticProps);

    return result;

};

$.inheritSelf = function(base, props, staticProps) {

    var basePtp = base.prototype;

    override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;

};

})(jQuery);

/* ../../libs/bem-bl/blocks-common/i-jquery/__inherit/i-jquery__inherit.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__identify/i-jquery__identify.js begin */
/**
 * Identify plugin
 *
 * @version 1.0.0
 */

(function($) {

var counter = 0,
    expando = '__' + (+new Date),
    get = function() {
        return 'uniq' + ++counter;
    };

/**
 * Makes unique ID
 * @param {Object} [obj] Object that needs to be identified
 * @param {Boolean} [onlyGet=false] Return a unique value only if it had already been assigned before
 * @returns {String} ID
 */
$.identify = function(obj, onlyGet) {

    if(!obj) return get();

    var key = 'uniqueID' in obj? 'uniqueID' : expando; // Use when possible. native uniqueID for elements in IE

    return onlyGet || key in obj?
        obj[key] :
        obj[key] = get();

};

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__identify/i-jquery__identify.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__is-empty-object/i-jquery__is-empty-object.js begin */
(function($) {

$.isEmptyObject || ($.isEmptyObject = function(obj) {
        for(var i in obj) return false;
        return true;
    });

})(jQuery);

/* ../../libs/bem-bl/blocks-common/i-jquery/__is-empty-object/i-jquery__is-empty-object.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__debounce/i-jquery__debounce.js begin */
/**
 * Debounce and throttle function's decorator plugin 1.0.6
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

    debounce : function(fn, timeout, invokeAsap, ctx) {

        if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;

        return function() {

            var args = arguments;
            ctx = ctx || this;

            invokeAsap && !timer && fn.apply(ctx, args);

            clearTimeout(timer);

            timer = setTimeout(function() {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);

        };

    },

    throttle : function(fn, timeout, ctx) {

        var timer, args, needInvoke;

        return function() {

            args = arguments;
            needInvoke = true;
            ctx = ctx || this;

            timer || (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();

        };

    }

});

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__debounce/i-jquery__debounce.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__observable/i-jquery__observable.js begin */
/**
 * Observable plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 * @requires $.identify
 * @requires $.inherit
 */

(function($) {

var storageExpando = '__' + (+new Date) + 'storage',
    getFnId = function(fn, ctx) {
        return $.identify(fn) + (ctx? $.identify(ctx) : '');
    },
    Observable = /** @lends $.observable.prototype */{

        /**
         * Builds full event name
         * @protected
         * @param {String} e Event type
         * @returns {String}
         */
        buildEventName : function(e) {

            return e;

        },

        /**
         * Adding event handler
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        on : function(e, data, fn, ctx, _special) {

            if(typeof e == 'string') {
                if($.isFunction(data)) {
                    ctx = fn;
                    fn = data;
                    data = undefined;
                }

                var id = getFnId(fn, ctx),
                    storage = this[storageExpando] || (this[storageExpando] = {}),
                    eList = e.split(' '),
                    i = 0,
                    eStorage;

                while(e = eList[i++]) {
                    e = this.buildEventName(e);
                    eStorage = storage[e] || (storage[e] = { ids : {}, list : {} });

                    if(!(id in eStorage.ids)) {
                        var list = eStorage.list,
                            item = { fn : fn, data : data, ctx : ctx, special : _special };
                        if(list.last) {
                            list.last.next = item;
                            item.prev = list.last;
                        } else {
                            list.first = item;
                        }

                        eStorage.ids[id] = list.last = item;
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.on(e, fn, data, _special);
                });
            }

            return this;

        },

        onFirst : function(e, data, fn, ctx) {

            return this.on(e, data, fn, ctx, { one : true });

        },

        /**
         * Removing event handler(s)
         * @param {String} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        un : function(e, fn, ctx) {

            if(typeof e == 'string' || typeof e == 'undefined') {
                var storage = this[storageExpando];
                if(storage) {
                    if(e) { // if event type was passed
                        var eList = e.split(' '),
                            i = 0,
                            eStorage;
                        while(e = eList[i++]) {
                            e = this.buildEventName(e);
                            if(eStorage = storage[e]) {
                                if(fn) {  // if specific handler was passed
                                    var id = getFnId(fn, ctx),
                                        ids = eStorage.ids;
                                    if(id in ids) {
                                        var list = eStorage.list,
                                            item = ids[id],
                                            prev = item.prev,
                                            next = item.next;

                                        if(prev) {
                                            prev.next = next;
                                        }
                                        else if(item === list.first) {
                                            list.first = next;
                                        }

                                        if(next) {
                                            next.prev = prev;
                                        }
                                        else if(item === list.last) {
                                            list.last = prev;
                                        }

                                        delete ids[id];
                                    }
                                } else {
                                    delete this[storageExpando][e];
                                }
                            }
                        }
                    } else {
                        delete this[storageExpando];
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.un(e, fn, ctx);
                });
            }

            return this;

        },

        /**
         * Fires event handlers
         * @param {String|$.Event} e Event
         * @param {Object} [data] Additional data
         * @returns {$.observable}
         */
        trigger : function(e, data) {

            var _this = this,
                storage = _this[storageExpando],
                rawType;

            typeof e === 'string'?
                e = $.Event(_this.buildEventName(rawType = e)) :
                e.type = _this.buildEventName(rawType = e.type);

            e.target || (e.target = _this);

            if(storage && (storage = storage[e.type])) {
                var item = storage.list.first,
                    ret;
                while(item) {
                    e.data = item.data;
                    ret = item.fn.call(item.ctx || _this, e, data);
                    if(typeof ret !== 'undefined') {
                        e.result = ret;
                        if(ret === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }

                    item.special && item.special.one &&
                        _this.un(rawType, item.fn, item.ctx);
                    item = item.next;
                }
            }

            return this;

        }

    };

$.observable = $.inherit(Observable, Observable);

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__observable/i-jquery__observable.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/i-bem.js begin */
/** @requires jquery.inherit */
/** @requires jquery.isEmptyObject */
/** @requires jquery.identify */
/** @requires jquery.observable */

(function($, undefined) {

/**
 * Storage for deferred functions
 * @private
 * @type Array
 */
var afterCurrentEventFns = [],

/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
    blocks = {},

/**
 * Communication channels
 * @static
 * @private
 * @type Object
 */
    channels = {};

/**
 * Builds the name of the handler method for setting a modifier
 * @static
 * @private
 * @param {String} elemName Element name
 * @param {String} modName Modifier name
 * @param {String} modVal Modifier value
 * @returns {String}
 */
function buildModFnName(elemName, modName, modVal) {

    return (elemName? '__elem_' + elemName : '') +
           '__mod' +
           (modName? '_' + modName : '') +
           (modVal? '_' + modVal : '');

}

/**
 * Transforms a hash of modifier handlers to methods
 * @static
 * @private
 * @param {Object} modFns
 * @param {Object} props
 * @param {String} [elemName]
 */
function modFnsToProps(modFns, props, elemName) {

    $.isFunction(modFns)?
        (props[buildModFnName(elemName, '*', '*')] = modFns) :
        $.each(modFns, function(modName, modFn) {
            $.isFunction(modFn)?
                (props[buildModFnName(elemName, modName, '*')] = modFn) :
                $.each(modFn, function(modVal, modFn) {
                    props[buildModFnName(elemName, modName, modVal)] = modFn;
                });
        });

}

function buildCheckMod(modName, modVal) {

    return modVal?
        Array.isArray(modVal)?
            function(block) {
                var i = 0, len = modVal.length;
                while(i < len)
                    if(block.hasMod(modName, modVal[i++]))
                        return true;
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };

}

/** @namespace */
this.BEM = $.inherit($.observable, /** @lends BEM.prototype */ {

    /**
     * @class Base block for creating BEM blocks
     * @constructs
     * @private
     * @param {Object} mods Block modifiers
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(mods, params, initImmediately) {

        var _this = this;

        /**
         * Cache of block modifiers
         * @private
         * @type Object
         */
        _this._modCache = mods || {};

        /**
         * Current modifiers in the stack
         * @private
         * @type Object
         */
        _this._processingMods = {};

        /**
         * The block's parameters, taking into account the defaults
         * @protected
         * @type Object
         */
        _this._params = params; // это нужно для правильной сборки параметров у блока из нескольких нод
        _this.params = null;

        initImmediately !== false?
            _this._init() :
            _this.afterCurrentEvent(function() {
                _this._init();
            });

    },

    /**
     * Initializes the block
     * @private
     */
    _init : function() {

        if(!this._initing && !this.hasMod('js', 'inited')) {
            this._initing = true;

            if(!this.params) {
                this.params = $.extend(this.getDefaultParams(), this._params);
                delete this._params;
            }

            this.setMod('js', 'inited');
            delete this._initing;
            this.hasMod('js', 'inited') && this.trigger('init');
        }

        return this;

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx=this] Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Executes the function in the context of the block, after the "current event"
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx] Context
     */
    afterCurrentEvent : function(fn, ctx) {

        this.__self.afterCurrentEvent(this.changeThis(fn, ctx));

    },

    /**
     * Executes the block's event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .__self.trigger(e, data);

        return this;

    },

    buildEvent : function(e) {

        typeof e == 'string' && (e = $.Event(e));
        e.block = this;

        return e;

    },

    /**
     * Checks whether a block or nested element has a modifier
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {Boolean}
     */
    hasMod : function(elem, modName, modVal) {

        var len = arguments.length,
            invert = false;

        if(len == 1) {
            modVal = '';
            modName = elem;
            elem = undefined;
            invert = true;
        }
        else if(len == 2) {
            if(typeof elem == 'string') {
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
            else {
                modVal = '';
                invert = true;
            }
        }

        var res = this.getMod(elem, modName) === modVal;
        return invert? !res : res;

    },

    /**
     * Returns the value of the modifier of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {

        var type = typeof elem;
        if(type === 'string' || type === 'undefined') { // elem either omitted or undefined
            modName = elem || modName;
            var modCache = this._modCache;
            return modName in modCache?
                modCache[modName] :
                modCache[modName] = this._extractModVal(modName);
        }

        return this._getElemMod(modName, elem);

    },

    /**
     * Returns the value of the modifier of the nested element
     * @private
     * @param {String} modName Modifier name
     * @param {Object} elem Nested element
     * @param {Object} [elem] Nested element name
     * @returns {String} Modifier value
     */
    _getElemMod : function(modName, elem, elemName) {

        return this._extractModVal(modName, elem, elemName);

    },

    /**
     * Returns values of modifiers of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} [modName1, ..., modNameN] Modifier names
     * @returns {Object} Hash of modifier values
     */
    getMods : function(elem) {

        var hasElem = elem && typeof elem != 'string',
            _this = this,
            modNames = [].slice.call(arguments, hasElem? 1 : 0),
            res = _this._extractMods(modNames, hasElem? elem : undefined);

        if(!hasElem) { // caching
            modNames.length?
                modNames.forEach(function(name) {
                    _this._modCache[name] = res[name];
                }):
                _this._modCache = res;
        }

        return res;

    },

    /**
     * Sets the modifier for a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(typeof modVal == 'undefined') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        }

        var _this = this;

        if(!elem || elem[0]) {

            var modId = (elem && elem[0]? $.identify(elem[0]) : '') + '_' + modName;

            if(this._processingMods[modId]) return _this;

            var elemName,
                curModVal = elem?
                    _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
                    _this.getMod(modName);

            if(curModVal === modVal) return _this;

            this._processingMods[modId] = true;

            var needSetMod = true,
                modFnParams = [modName, modVal, curModVal];

            elem && modFnParams.unshift(elem);

            [['*', '*'], [modName, '*'], [modName, modVal]].forEach(function(mod) {
                needSetMod = _this._callModFn(elemName, mod[0], mod[1], modFnParams) !== false && needSetMod;
            });

            !elem && needSetMod && (_this._modCache[modName] = modVal);

            needSetMod && _this._afterSetMod(modName, modVal, curModVal, elem, elemName);

            delete this._processingMods[modId];
        }

        return _this;

    },

    /**
     * Function after successfully changing the modifier of the block/nested element
     * @protected
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {Object} [elem] Nested element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {},

    /**
     * Sets a modifier for a block/nested element, depending on conditions.
     * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
     * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal1 First modifier value
     * @param {String} [modVal2] Second modifier value
     * @param {Boolean} [condition] Condition
     * @returns {BEM}
     */
    toggleMod : function(elem, modName, modVal1, modVal2, condition) {

        if(typeof elem == 'string') { // if this is a block
            condition = modVal2;
            modVal2 = modVal1;
            modVal1 = modName;
            modName = elem;
            elem = undefined;
        }
        if(typeof modVal2 == 'undefined') {
            modVal2 = '';
        } else if(typeof modVal2 == 'boolean') {
            condition = modVal2;
            modVal2 = '';
        }

        var modVal = this.getMod(elem, modName);
        (modVal == modVal1 || modVal == modVal2) &&
            this.setMod(
                elem,
                modName,
                typeof condition === 'boolean'?
                    (condition? modVal1 : modVal2) :
                    this.hasMod(elem, modName, modVal1)? modVal2 : modVal1);

        return this;

    },

    /**
     * Removes a modifier from a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {BEM}
     */
    delMod : function(elem, modName) {

        if(!modName) {
            modName = elem;
            elem = undefined;
        }

        return this.setMod(elem, modName, '');

    },

    /**
     * Executes handlers for setting modifiers
     * @private
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var modFnName = buildModFnName(elemName, modName, modVal);
        return this[modFnName]?
           this[modFnName].apply(this, modFnParams) :
           undefined;

    },

    /**
     * Retrieves the value of the modifier
     * @private
     * @param {String} modName Modifier name
     * @param {Object} [elem] Element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem) {

        return '';

    },

    /**
     * Retrieves name/value for a list of modifiers
     * @private
     * @param {Array} modNames Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by name
     */
    _extractMods : function(modNames, elem) {

        return {};

    },

    /**
     * Returns a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        return this.__self.channel(id, drop);

    },

    /**
     * Returns a block's default parameters
     * @returns {Object}
     */
    getDefaultParams : function() {

        return {};

    },

    /**
     * Helper for cleaning up block properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var args = [].slice.call(arguments);
        typeof obj == 'string' && args.unshift(this);
        this.__self.del.apply(this.__self, args);
        return this;

	},

    /**
     * Deletes a block
     */
    destruct : function() {}

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Storage for block declarations (hash by block name)
     * @static
     * @protected
     * @type Object
     */
    blocks : blocks,

    /**
     * Declares blocks and creates a block class
     * @static
     * @protected
     * @param {String|Object} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.modName] Modifier name
     * @param {String} [decl.modVal] Modifier value
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     */
    decl : function(decl, props, staticProps) {

        if(typeof decl == 'string')
            decl = { block : decl };
        else if(decl.name) {
            decl.block = decl.name;
        }

        if(decl.baseBlock && !blocks[decl.baseBlock])
            throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');

        props || (props = {});

        if(props.onSetMod) {
            modFnsToProps(props.onSetMod, props);
            delete props.onSetMod;
        }

        if(props.onElemSetMod) {
            $.each(props.onElemSetMod, function(elemName, modFns) {
                modFnsToProps(modFns, props, elemName);
            });
            delete props.onElemSetMod;
        }

        var baseBlock = blocks[decl.baseBlock || decl.block] || this;

        if(decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            $.each(props, function(name, prop) {
                $.isFunction(prop) &&
                    (props[name] = function() {
                        var method;
                        if(checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== props[name] &&
                                (method = this.__base);
                        }
                        return method?
                            method.apply(this, arguments) :
                            undefined;
                    });
            });
        }

        if(staticProps && typeof staticProps.live === 'boolean') {
            var live = staticProps.live;
            staticProps.live = function() {
                return live;
            };
        }

        var block;
        decl.block == baseBlock._name?
            // makes a new "live" if the old one was already executed
            (block = $.inheritSelf(baseBlock, props, staticProps))._processLive(true) :
            (block = blocks[decl.block] = $.inherit(baseBlock, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        return false;

    },

    /**
     * Factory method for creating an instance of the block named
     * @static
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {BEM}
     */
    create : function(block, params) {

        typeof block == 'string' && (block = { block : block });

        return new blocks[block.block](block.mods, params);

    },

    /**
     * Returns the name of the current block
     * @static
     * @protected
     * @returns {String}
     */
    getName : function() {

        return this._name;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {Object} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {},

    /**
     * Adds a function to the queue for executing after the "current event"
     * @static
     * @protected
     * @param {Function} fn
     * @param {Object} ctx
     */
    afterCurrentEvent : function(fn, ctx) {

        afterCurrentEventFns.push({ fn : fn, ctx : ctx }) == 1 &&
            setTimeout(this._runAfterCurrentEventFns, 0);

    },

    /**
     * Executes the queue
     * @private
     */
    _runAfterCurrentEventFns : function() {

        var fnsLen = afterCurrentEventFns.length;
        if(fnsLen) {
            var fnObj,
                fnsCopy = afterCurrentEventFns.splice(0, fnsLen);

            while(fnObj = fnsCopy.shift()) fnObj.fn.call(fnObj.ctx || this);
        }

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} ctx Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Helper for cleaning out properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var delInThis = typeof obj == 'string',
            i = delInThis? 0 : 1,
            len = arguments.length;
        delInThis && (obj = this);

        while(i < len) delete obj[arguments[i++]];

        return this;

	},

    /**
     * Returns/destroys a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        if(typeof id == 'boolean') {
            drop = id;
            id = undefined;
        }

        id || (id = 'default');

        if(drop) {
            if(channels[id]) {
                channels[id].un();
                delete channels[id];
            }
            return;
        }

        return channels[id] || (channels[id] = new $.observable());

    }

});

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-bem/i-bem.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__object/i-ecma__object.js begin */
(function() {

/**
 * Возвращает массив свойств объекта
 * @param {Object} obj объект
 * @returns {Array}
 */
Object.keys || (Object.keys = function(obj) {
    var res = [];

    for(var i in obj) obj.hasOwnProperty(i) &&
        res.push(i);

    return res;
});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__object/i-ecma__object.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__array/i-ecma__array.js begin */
(function() {

var ptp = Array.prototype,
    toStr = Object.prototype.toString,
    methods = {

        /**
         * Finds the index of an element in an array
         * @param {Object} item
         * @param {Number} [fromIdx] Starting from index (length - 1 - fromIdx, if fromIdx < 0)
         * @returns {Number} Element index or -1, if not found
         */
        indexOf : function(item, fromIdx) {

            fromIdx = +(fromIdx || 0);

            var t = this, len = t.length;

            if(len > 0 && fromIdx < len) {
                fromIdx = fromIdx < 0? Math.ceil(fromIdx) : Math.floor(fromIdx);
                fromIdx < -len && (fromIdx = 0);
                fromIdx < 0 && (fromIdx = fromIdx + len);

                while(fromIdx < len) {
                    if(fromIdx in t && t[fromIdx] === item)
                        return fromIdx;
                    ++fromIdx;
                }
            }

            return -1;

        },

        /**
         * Calls the callback for each element
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         */
        forEach : function(callback, ctx) {

            var i = -1, t = this, len = t.length;
            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

        },

        /**
         * Creates array B from array A so that B[i] = callback(A[i])
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         * @returns {Array}
         */
        map : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = new Array(len);

            while(++i < len) i in t &&
                (res[i] = ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

            return res;

        },

        /**
         * Creates an array containing only the elements from the source array that the callback returns true for. 
         * @param {Function} callback Called for each element
         * @param {Object} [ctx] Callback context
         * @returns {Array}
         */
        filter : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = [];

            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)) && res.push(t[i]);

            return res;

        },

        /**
         * Wraps the array using an accumulator
         * @param {Function} callback Called for each element
         * @param {Object} [initialVal] Initial value of the accumulator
         * @returns {Object} Accumulator
         */
        reduce : function(callback, initialVal) {

            var i = -1, t = this, len = t.length,
                res;

            if(arguments.length < 2) {
                while(++i < len) {
                    if(i in t) {
                        res = t[i];
                        break;
                    }
                }
            }
            else {
                res = initialVal;
            }

            while(++i < len) i in t &&
                (res = callback(res, t[i], i, t));

            return res;

        },

        /**
         * Checks whether at least one element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Callback context
         * @returns {Boolean}
         */
        some : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && (ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return true;

            return false;

        },

        /**
         * Checks whether every element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Context of the callback call
         * @returns {Boolean}
         */
        every : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && !(ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return false;

            return true;

        }

    };

for(var name in methods)
    ptp[name] || (ptp[name] = methods[name]);

Array.isArray || (Array.isArray = function(obj) {
    return toStr.call(obj) === '[object Array]';
});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__array/i-ecma__array.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__function/i-ecma__function.js begin */
(function() {

var slice = Array.prototype.slice;

Function.prototype.bind || (Function.prototype.bind = function(ctx) {

    var fn = this,
        args = slice.call(arguments, 1);

    return function () {
        return fn.apply(ctx, args.concat(slice.call(arguments)));
    }

});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__function/i-ecma__function.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__internal/i-bem__internal.js begin */
/** @fileOverview Module for internal BEM helpers */
/** @requires BEM */

(function(BEM, $, undefined) {

/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Separator between names of a block and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable element and modifier names
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

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

    NAME_PATTERN : NAME_PATTERN,

    MOD_DELIM : MOD_DELIM,
    ELEM_DELIM : ELEM_DELIM,

    buildModPostfix : function(modName, modVal, buffer) {

        var res = buffer || [];
        buildModPostfix(modName, modVal, res);
        return buffer? res : res.join('');

    },

    /**
     * Builds the class of a block or element with a modifier
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClass : function(block, elem, modName, modVal, buffer) {

        var typeOf = typeof modName;
        if(typeOf == 'string') {
            if(typeof modVal != 'string' && typeof modVal != 'number') {
                buffer = modVal;
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
        } else if(typeOf != 'undefined') {
            buffer = modName;
            modName = undefined;
        } else if(elem && typeof elem != 'string') {
            buffer = elem;
            elem = undefined;
        }

        if(!(elem || modName || buffer)) { // оптимизация для самого простого случая
            return block;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, modName, modVal, res) :
            buildBlockClass(block, modName, modVal, res);

        return buffer? res : res.join('');

    },

    /**
     * Builds full classes for a buffer or element with modifiers
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {Object} [mods] Modifiers
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClasses : function(block, elem, mods, buffer) {

        if(elem && typeof elem != 'string') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, undefined, undefined, res) :
            buildBlockClass(block, undefined, undefined, res);

        mods && $.each(mods, function(modName, modVal) {
            if(modVal) {
                res.push(' ');
                elem?
                    buildElemClass(block, elem, modName, modVal, res) :
                    buildBlockClass(block, modName, modVal, res);
            }
        });

        return buffer? res : res.join('');

        /*var typeOf = typeof elem;
        if(typeOf != 'string' && typeOf != 'undefined') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }
        if($.isArray(mods)) {
            buffer = mods;
            mods = undefined;
        }

        var res = buffer || [];
        buildClasses(block, elem, mods, res);
        return buffer? res : res.join('');*/

    }

}

})(BEM, jQuery);
/* ../../libs/bem-bl/blocks-common/i-bem/__internal/i-bem__internal.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__cookie/i-jquery__cookie.js begin */
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
/* ../../libs/bem-bl/blocks-common/i-jquery/__cookie/i-jquery__cookie.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__decodeuri/i-jquery__decodeuri.js begin */
/**
 * Plugin for decoding URI-escaped strings in CP1251 encoding
 *
 * Copyright (c) 2011-2012 Roman Rozhdestvenskiy (sbmaxx@gmail.com)
 */
(function($) {

// Equivalency table for cp1251 and utf8.
var map = { "%D0": "%D0%A0","%C0": "%D0%90","%C1": "%D0%91","%C2": "%D0%92","%C3": "%D0%93","%C4": "%D0%94","%C5": "%D0%95","%A8": "%D0%81","%C6": "%D0%96","%C7": "%D0%97","%C8": "%D0%98","%C9": "%D0%99","%CA": "%D0%9A","%CB": "%D0%9B","%CC": "%D0%9C","%CD": "%D0%9D","%CE": "%D0%9E","%CF": "%D0%9F","%D1": "%D0%A1","%D2": "%D0%A2","%D3": "%D0%A3","%D4": "%D0%A4","%D5": "%D0%A5","%D6": "%D0%A6","%D7": "%D0%A7","%D8": "%D0%A8","%D9": "%D0%A9","%DA": "%D0%AA","%DB": "%D0%AB","%DC": "%D0%AC","%DD": "%D0%AD","%DE": "%D0%AE","%DF": "%D0%AF","%E0": "%D0%B0","%E1": "%D0%B1","%E2": "%D0%B2","%E3": "%D0%B3","%E4": "%D0%B4","%E5": "%D0%B5","%B8": "%D1%91","%E6": "%D0%B6","%E7": "%D0%B7","%E8": "%D0%B8","%E9": "%D0%B9","%EA": "%D0%BA","%EB": "%D0%BB","%EC": "%D0%BC","%ED": "%D0%BD","%EE": "%D0%BE","%EF": "%D0%BF","%F0": "%D1%80","%F1": "%D1%81","%F2": "%D1%82","%F3": "%D1%83","%F4": "%D1%84","%F5": "%D1%85","%F6": "%D1%86","%F7": "%D1%87","%F8": "%D1%88","%F9": "%D1%89","%FA": "%D1%8A","%FB": "%D1%8B","%FC": "%D1%8C","%FD": "%D1%8D","%FE": "%D1%8E","%FF": "%D1%8F" };

function convert(str) {
    // Symbol code in cp1251 (hex) : symbol code in utf8)
    return str.replace(/%.{2}/g, function($0) { return map[$0] || $0; });
}

function decode(func, str) {

    var decoded = '';
    // try/catch block for getting the encoding of the source string
    // error is thrown if a non-UTF8 string is input
    // if the string was not decoded, it is returned without changes
    try {
        decoded = func(str);
    } catch (e) {
        try {
            decoded = func(convert(str));
        } catch (e) {
            decoded = str;
        }
    }
    return decoded;

}

$.extend({

    decodeURI : function(str) {
        return decode(decodeURI, str);
    },

    decodeURIComponent : function(str) {
        return decode(decodeURIComponent, str);
    }

});

})(jQuery);

/* ../../libs/bem-bl/blocks-common/i-jquery/__decodeuri/i-jquery__decodeuri.js end */
;
/* ../../libs/romochka/blocks-desktop/i-bem/html/i-bem__html.js begin */
/** @requires BEM */
/** @requires BEM.INTERNAL */
/** @requires jquery.stringify */

(function(BEM, $, undefined) {

var INTERNAL = BEM.INTERNAL,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,
    SHORT_TAGS = { // хэш для быстрого определения, является ли тэг коротким
        area : 1, base : 1, br : 1, col : 1, command : 1, embed : 1, hr : 1, img : 1,
        input : 1, keygen : 1, link : 1, meta : 1, param : 1, source : 1, wbr : 1 },
    buildClass = INTERNAL.buildClass,
    buildClasses = INTERNAL.buildClasses,
    decls = {};

function addPropToDecl(decl, name, fn) {

    (decl[name] || (decl[name] = [])).unshift(fn);

}

function buildDeclFn(fn, desc) {

    return desc.modName?
        function(ctx) {
            (ctx._curBlock.mods || {})[desc.modName] === desc.modVal && fn(ctx);
        } :
        fn;

}

function join(a, b) {

    var isArrayB = $.isArray(b),
        res;

    $.isArray(a)?
        isArrayB? res = a.concat(b) : (res = a).push(b) :
        isArrayB? (res = b).unshift(a) : res = [a, b];

    return res;

}

var attrEscapes = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' },
    attrEscapesRE = /["&<>]/g;
function escapeAttr(attrVal) {
    return attrVal.replace(attrEscapesRE, function(needToEscape) {
        return attrEscapes[needToEscape];
    });
}

/**
 * @namespace
 * @name BEM.HTML
 */
BEM.HTML = {

    /**
     * Декларация
     * @protected
     * @param {String|Object} decl имя блока (простой синтаксис) или описание
     * @param {String} decl.block имя блока
     * @param {String} [decl.modName] имя модификатора
     * @param {String} [decl.modVal] значение модификатора
     * @param {Object} props свойства
     */
    decl : function(desc, props) {

        typeof desc == 'string' && (desc = { block : desc });
        desc.name && (desc.block = desc.name);

        var decl = decls[desc.block] || (decls[desc.block] = {});

        props.onBlock && addPropToDecl(decl, '_block', buildDeclFn(props.onBlock, desc));

        if(props.onElem) {
            $.isFunction(props.onElem)?
                addPropToDecl(decl, '_elem', buildDeclFn(props.onElem, desc)) :
                $.each(props.onElem, function(elem, fn) {
                    addPropToDecl(decl, '_elem' + (elem === '*'? '' : ELEM_DELIM + elem), buildDeclFn(fn, desc));
                });
        }

    },

    /**
     * Строит HTML-представление
     * @param {Object|Array} params JSON-описание
     */
    build : function(params) {

        var builder = new this.Ctx(params);
        builder._buildAll();
        return builder._flush();

    },

    Ctx : $.inherit(/** @lends BEM.HTML.Ctx.prototype */{
        /**
         * @class Внутренний класс контекста билдера HTML-представления
         * @constructs
         * @param {Object|Array|String} params параметры
         */
        __constructor : function(params) {

            /**
             * буфер
             * @private
             * @type Array
             */
            this._buffer = [];

            /**
             * текущие параметры
             * @private
             * @type Object
             */
            this._params = params;

            /**
             * туннелированные параметры
             * @private
             * @type Object
             */
            this._tParams = null;

            this._tParamsChanges = null;

            /**
             * имя текущего блока
             * @private
             * @type String
             */
            this._curBlock = undefined;

        },

        /**
         * Возвращает позицию контекста
         * @returns {Number}
         */
        pos : function() {

            return this._params._pos;

        },

        /**
         * Проверяет, является ли текущий контекст первым
         * @returns {Boolean}
         */
        isFirst : function() {

            return this._params._pos === 1;

        },

        /**
         * Проверяет, является ли текущий контекст последним
         * @returns {Boolean}
         */
        isLast : function() {

            var params = this._params;
            return params._pos === params._siblingsCount;

        },

        /**
         * Возвращает/устанавливает параметры контекста
         * @param {Object} [params] параметры
         */
        params : function(params) {

            var _this = this;
            if(typeof params == 'undefined') return _this._params;

            _this._params = params;
            return _this;

        },

        /**
         * Возвращает/устанавливает один параметр контекста
         * @param {String} name имя параметра
         * @param {String} [val] значение параметра
         * @param {Boolean} [force=false] установить параметр независимо от его наличия в контексте
         * @param {Boolean} [needExtend=false] расширять параметр
         */
        param : function(name, val, force, needExtend) {

            var _this = this,
                params = _this._params;

            if(typeof val == 'undefined') return params[name];

            if(force || !(name in params)) {
                params[name] = val;
            } else if(needExtend) {
                params[name] = $.extend(val, params[name]);
            }

            return _this;

        },

        /**
         * Возвращает/устанавливает html-атрибуты контекста (шорткат к params('attrs', val))
         * @param {Object} [val] хэш атрибутов
         * @param {Boolean} [force=false]
         */
        attrs : function(val, force) {

            return this.param('attrs', val, force, true);

        },

        /**
         * Возвращает/устанавливает один html-атрибут контекста
         * @param {String} name имя атрибута
         * @param {String} [val] значение атрибута
         * @param {Boolean} [force=false]
         */
        attr : function(name, val, force) {

            var _this = this;
            if(typeof val == 'undefined') return (_this._params.attrs || {})[name];

            var attrs = _this._params.attrs;
            attrs?
                (force || !(name in attrs)) && (attrs[name] = val) :
                (_this._params.attrs = {})[name] = val;

            return _this;

        },

        /**
         * Возвращает/устанавливает имя html-тэга контекста (шорткат к params('tag', val))
         * @param {String} [val] тэг
         * @param {Boolean} [force=false]
         */
        tag : function(val, force) {

            return this.param('tag', val, force);

        },

        /**
         * Возвращает/устанавливает дополнительные CSS-классы контекста (шорткат к params('cls', val))
         * @param {String} [val] CSS-класс
         * @param {Boolean} [force=false]
         */
        cls : function(val, force) {

            return this.param('cls', val, force);

        },

        /**
         * Возвращает/устанавливает модификаторы контекста (шорткат к params('mods', val))
         * @param {Object} [val] хэш модификаторов
         * @param {Boolean} [force=false]
         */
        mods : function(val, force) {

            return this.param('mods', val, force, true);

        },

        /**
         * Возвращает/устанавливает один модификатор контекста
         * @param {String} name имя модификатора
         * @param {String} [val] значение модификатора
         * @param {Boolean} [force=false]
         */
        mod : function(name, val, force) {

            var _this = this;
            if(typeof val == 'undefined') return (_this._params.mods || {})[name];

            var mods = _this._params.mods;
            mods?
                (force || !(name in mods)) && (mods[name] = val) :
                (_this._params.mods = {})[name] = val;

            return _this;

        },

        /**
         * Возвращает/добавляет/устанавливает миксы
         * @param {Array} [val] миксы
         * @param {Boolean} [force=false]
         */
        mix : function(val, force) {

            var _this = this,
                params = _this._params;

            if(typeof val == 'undefined') return params.mix;

            if(force || !('mix' in params)) {
                params.mix = val;
            } else {
                params.mix = params.mix.concat(val);
            }

            return _this;

        },

        /**
         * Возвращает/устанавливает js-параметры контекста (шорткат к params('js', val))
         * @param {Boolean|Object} [val] параметры
         */
        js : function(val) {

            return this.param('js', val);

        },

        /**
         * Возвращает/устанавливает контент контекста (шорткат к params('content', val))
         * @param {String|Object|Array} [val] контент
         * @param {Boolean} [force=false] установить контент независимо от его наличия
         */
        content : function(val, force) {

            return this.param('content', val, force);

        },

        /**
         * Оборачивает контент контекста (например, другим элементом)
         * @param {Object} obj
         */
        wrapContent : function(obj) {

            var _this = this,
                params = _this._params;

            obj.content = params.content;
            params.content = obj;

            return _this;

        },

        /**
         * Добавляет контент перед контентом контекста (например, еще один элемент)
         * @param {Object|Array} obj
         */
        beforeContent : function(obj) {

            var _this = this,
                params = _this._params;

            params.content = join(obj, params.content);

            return _this;

        },

        /**
         * Добавляет контент после контента контекста (например, еще один элемент)
         * @param {Object|Array} obj
         */
        afterContent : function(obj) {

            var _this = this,
                params = _this._params;

            params.content = join(params.content, obj);

            return _this;

        },

        /**
         * Оборачивает контекста (например, другим элементом или блоком)
         * @param {Object} obj
         */
        wrap : function(obj) {

            var _this = this,
                params = _this._params;

            obj.block || (obj._curBlock = _this._curBlock);
            obj.content = params._wrapper? params._wrapper : params;
            params._wrapper = obj;

            return _this;

        },

        /**
         * Возвращает/устанавливает один туннелированный параметр контекста
         * @param {String} name имя параметра
         * @param {String} [val] значение параметра
         */
        tParam : function(name, val) {

            var _this = this,
                tParams = _this._tParams || (_this._tParams = {});

            if(typeof val == 'undefined') return tParams[name];

            var tParamsChanges = _this._tParamsChanges || (_this._tParamsChanges = {});

            name in tParamsChanges || (tParamsChanges[name] = tParams[name]);

            tParams[name] = val;

            return _this;

        },

        /**
         * Генерирует уникальный идентификатор
         * returns {String}
         */
        generateId : function() {

            return $.identify();

        },

        /**
         * Останавливает применение более базовых шаблонов
         */
        stop : function() {

            this._params._isStopped = true;

        },

        /**
         * Выполняет одну итерацию билда в зависимости от типа контекста
         * @private
         */
        _buildAll : function() {

            var _this = this,
                buffer = _this._buffer,
                params = _this._params,
                paramsType = typeof params;

            if(paramsType == 'string' || paramsType == 'number') {
                buffer.push(params);
            } else if($.isArray(params)) {
                var i = 0, len = params.length, currParams, currParamsType;
                while(i < len) {
                     _this._params = currParams = params[i++];
                    currParamsType = typeof currParams;
                    if(currParamsType == 'string' || currParamsType == 'number') {
                        buffer.push(currParams);
                    } else if(currParams) {
                        currParams._pos = i;
                        currParams._siblingsCount = len;
                        _this._buildByDecl();
                    }
                }
            } else if(params) {
                _this._params._pos = _this._params._siblingsCount = 1;
                _this._buildByDecl();
            }

        },

        /**
         * Дефолтный билд
         * @private
         */
        _build : function() {

            var _this = this,
                buffer = _this._buffer,
                params = _this._params,
                tag = params.tag || 'div',
                jsParams,
                isBEM = params.block || params.elem,
                curBlock = isBEM && (params.block || _this._curBlock.block),
                addInitingCls = false;

            if(params.js) {
                (jsParams = {})[buildClass(curBlock, params.elem)] = params.js === true? {} : params.js;
                addInitingCls = !params.elem;
            }

            buffer.push('<', tag);

            if(isBEM || params.cls) {
                buffer.push(' class="');
                if(isBEM) {
                    buildClasses(curBlock, params.elem, params.mods, buffer);
                    params.mix && $.each(params.mix, function(i, mix) {
                        if(mix) {
                            buffer.push(' ');
                            buildClasses(mix.block, mix.elem, mix.mods, buffer);
                            if(mix.js) {
                                (jsParams || (jsParams = {}))[buildClass(mix.block, mix.elem)] = mix.js === true? {} : mix.js;
                                addInitingCls || (addInitingCls = !mix.elem);
                            }
                        }
                    });
                }

                params.cls && buffer.push(isBEM? ' ' : '', params.cls);

                addInitingCls && buffer.push(' i-bem');
                buffer.push('"');
            }

            jsParams && buffer.push(
                ' onclick="return ',
                escapeAttr(JSON.stringify(jsParams)),
                '"');

            params.attrs && $.each(params.attrs, function(name, val) {
                typeof val != 'undefined' && val !== null && val !== false && buffer.push(
                    ' ',
                    name,
                    '="',
                    val.toString().replace(/"/g, "&quot;"),
                    '"');
            });

            if(SHORT_TAGS[tag]) {
                buffer.push('/>');
            } else {
                buffer.push('>');

                if(typeof params.content != 'undefined') {
                    _this._params = params.content;
                    _this._buildAll();
                }

                buffer.push('</', tag, '>');
            }

        },

        /**
         * Очищает буфер и возвращает его содержимое
         * @private
         * @returns {String} содержимое буфера
         */
        _flush : function() {

            var res = this._buffer.join('');
            delete this._buffer;
            return res;

        },

        _buildByDecl : function() {

            var _this = this,
                currBlock = _this._curBlock,
                params = _this._params;

            params._curBlock && (_this._curBlock = params._curBlock);
            params.block && (_this._curBlock = params);

            if(!params._wrapper) {
                if(params.block || params.elem) {
                    var decl = decls[_this._curBlock.block];
                    if(decl) {
                        var fns;
                        if(params.elem) {
                            fns = decl['_elem' + ELEM_DELIM + params.elem];
                            decl._elem && (fns = (fns? fns.concat(decl._elem) : decl._elem));
                        } else {
                            fns = decl._block;
                        }

                        if(fns) {
                            var i = 0, fn;
                            while(fn = fns[i++]) {
                                fn(_this);
                                if(params._isStopped) break;
                            }
                        }
                    }
                }

                if(params._wrapper) {
                    params._curBlock = _this._curBlock;
                    _this._params = params._wrapper;
                    return _this._buildAll();
                }
            }

            var tParamsChanges = _this._tParamsChanges;
                _this._tParamsChanges = null;

            _this._build();

            _this._curBlock = currBlock;

            if(tParamsChanges) {
                var tParams = _this._tParams;
                $.each(tParamsChanges, function(name, val) {
                    typeof val == 'undefined'?
                        delete tParams[name] :
                        tParams[name] = val;
                });
            }

        }

    })

};

})(BEM, jQuery);

/* ../../libs/romochka/blocks-desktop/i-bem/html/i-bem__html.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__json/i-ecma__json.js begin */
(function(undefined) {

if(window.JSON) return;

var _toString = Object.prototype.toString,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    meta = {
        '\b' : '\\b',
        '\t' : '\\t',
        '\n' : '\\n',
        '\f' : '\\f',
        '\r' : '\\r',
        '"'  : '\\"',
        '\\' : '\\\\'
    },
    stringify;

window.JSON = {
    stringify : stringify = function(val) {
        if(val === null) {
            return 'null';
        }
        if(typeof val === 'undefined') {
            return undefined;
        }
        switch(_toString.call(val)) {
            case '[object String]':
                escapable.lastIndex = 0;
                return '"' +
                    (escapable.test(val)?
                        val.replace(escapable, function(a) {
                            var c = meta[a];
                            return typeof c === 'string'? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        }) :
                        val) +
                    '"';
            case '[object Number]':
            case '[object Boolean]':
                return '' + val;
            case '[object Array]':
                var res = '[', i = 0, len = val.length, strVal;
                while(i < len) {
                    strVal = stringify(val[i]);
                    res += (i++? ',' : '') + (typeof strVal === 'undefined'? 'null' : strVal);
                }
                return res + ']';
            case '[object Object]':
                if(_toString.call(val.toJSON) === '[object Function]') {
                    return stringify(val.toJSON());
                }
                var res = '{', i = 0, strVal;
                for(var key in val) {
                    if(val.hasOwnProperty(key)) {
                        strVal = stringify(val[key]);
                        typeof strVal !== 'undefined' && (res += (i++? ',' : '') + '"' + key + '":' + strVal);
                    }
                }
                return res + '}';
            default:
                return undefined;
        }
    }
};
})();

/* ../../libs/bem-bl/blocks-common/i-ecma/__json/i-ecma__json.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/i-bem__dom.js begin */
/** @requires BEM */
/** @requires BEM.INTERNAL */

(function(BEM, $, undefined) {

var win = $(window),
    doc = $(document),

/**
 * Storage for DOM elements by unique key
 * @private
 * @type Object
 */
    uniqIdToDomElems = {},

/**
 * Storage for blocks by unique key
 * @static
 * @private
 * @type Object
 */
    uniqIdToBlock = {},

/**
 * Storage for block parameters
 * @private
 * @type Object
 */
    domElemToParams = {},

/**
 * Storage for liveCtx event handlers
 * @private
 * @type Object
 */
    liveEventCtxStorage = {},

/**
 * Storage for liveClass event handlers
 * @private
 * @type Object
 */
    liveClassEventStorage = {},

    blocks = BEM.blocks,

    INTERNAL = BEM.INTERNAL,

    NAME_PATTERN = INTERNAL.NAME_PATTERN,

    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,

    buildModPostfix = INTERNAL.buildModPostfix,
    buildClass = INTERNAL.buildClass;

/**
 * Initializes blocks on a DOM element
 * @private
 * @param {jQuery} domElem DOM element
 * @param {String} uniqInitId ID of the "initialization wave"
 */
function init(domElem, uniqInitId) {

    var domNode = domElem[0];
    $.each(getParams(domNode), function(blockName, params) {
        processParams(params, domNode, blockName, uniqInitId);
        var block = uniqIdToBlock[params.uniqId];
        if(block) {
            if(block.domElem.index(domNode) < 0) {
                block.domElem = block.domElem.add(domElem);
                $.extend(block._params, params);
            }
        } else {
            initBlock(blockName, domElem, params);
        }
    });

}

/**
 * Initializes a specific block on a DOM element, or returns the existing block if it was already created
 * @private
 * @param {String} blockName Block name
 * @param {jQuery} domElem DOM element
 * @param {Object} [params] Initialization parameters
 * @param {Boolean} [forceLive] Force live initialization
 * @param {Function} [callback] Handler to call after complete initialization
 */
function initBlock(blockName, domElem, params, forceLive, callback) {

    if(typeof params == 'boolean') {
        callback = forceLive;
        forceLive = params;
        params = undefined;
    }

    var domNode = domElem[0];
    params = processParams(params || getParams(domNode)[blockName], domNode, blockName);

    var uniqId = params.uniqId;
    if(uniqIdToBlock[uniqId]) {
        return uniqIdToBlock[uniqId]._init();
    }

    uniqIdToDomElems[uniqId] = uniqIdToDomElems[uniqId]?
        uniqIdToDomElems[uniqId].add(domElem) :
        domElem;

    var parentDomNode = domNode.parentNode;
    if(!parentDomNode || parentDomNode.nodeType === 11) { // jquery doesn't unique disconnected node
        $.unique(uniqIdToDomElems[uniqId]);
    }

    var blockClass = blocks[blockName] || DOM.decl(blockName, {}, { live : true });
    if(!(blockClass._liveInitable = !!blockClass._processLive()) || forceLive || params.live === false) {
        var block = new blockClass(uniqIdToDomElems[uniqId], params, !!forceLive);
        delete uniqIdToDomElems[uniqId];
        callback && callback.apply(block, Array.prototype.slice.call(arguments, 4));
        return block;
    }

}

/**
 * Processes and adds necessary block parameters
 * @private
 * @param {Object} params Initialization parameters
 * @param {HTMLElement} domNode DOM node
 * @param {String} blockName Block name
 * @param {String} [uniqInitId] ID of the "initialization wave"
 */
function processParams(params, domNode, blockName, uniqInitId) {

    (params || (params = {})).uniqId ||
        (params.uniqId = (params.id? blockName + '-id-' + params.id : $.identify()) + (uniqInitId || $.identify()));

    var domUniqId = $.identify(domNode),
        domParams = domElemToParams[domUniqId] || (domElemToParams[domUniqId] = {});

    domParams[blockName] || (domParams[blockName] = params);

    return params;

}

/**
 * Helper for searching for a DOM element using a selector inside the context, including the context itself
 * @private
 * @param {jQuery} ctx Context
 * @param {String} selector CSS selector
 * @param {Boolean} [excludeSelf=false] Exclude context from search
 * @returns {jQuery}
 */
function findDomElem(ctx, selector, excludeSelf) {

    var res = ctx.find(selector);
    return excludeSelf?
       res :
       res.add(ctx.filter(selector));

}

/**
 * Returns parameters of a block's DOM element
 * @private
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function getParams(domNode) {

    var uniqId = $.identify(domNode);
    return domElemToParams[uniqId] ||
           (domElemToParams[uniqId] = extractParams(domNode));

}

/**
 * Retrieves block parameters from a DOM element
 * @private
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function extractParams(domNode) {

    var fn = domNode.onclick || domNode.ondblclick;
    if(!fn && domNode.tagName.toLowerCase() == 'body') { // LEGO-2027 in FF onclick doesn't work on body
        var elem = $(domNode),
            attr = elem.attr('onclick') || elem.attr('ondblclick');
        attr && (fn = Function(attr));
    }
    return fn? fn() : {};

}

/**
 * Cleans up all the BEM storages associated with a DOM node
 * @private
 * @param {HTMLElement} domNode DOM node
 */
function cleanupDomNode(domNode) {

    delete domElemToParams[$.identify(domNode)];
    domNode.onclick = null;

}

/**
 * Uncople DOM node from the block. If this is the last node, then destroys the block.
 * @private
 * @param {BEM.DOM} block block
 * @param {HTMLElement} domNode DOM node
 */
function removeDomNodeFromBlock(block, domNode) {

    block.domElem.length === 1?
        block.destruct(true) :
        block.domElem = block.domElem.not(domNode);

}

/**
 * Returns a DOM node for calculating the window size in IE
 * @returns {HTMLElement}
 */
function getClientNode() {

    return doc[0][$.support.boxModel? 'documentElement' : 'body'];

}

/**
 * Returns a block on a DOM element and initializes it if necessary
 * @param {String} blockName Block name
 * @param {Object} params Block parameters
 * @returns {BEM}
 */
$.fn.bem = function(blockName, params) {
    return initBlock(blockName, this, params, true);
};

/**
 * @namespace
 * @name BEM.DOM
 */
var DOM = BEM.DOM = BEM.decl('i-bem__dom',/** @lends BEM.DOM.prototype */{
    /**
     * @class Base block for creating BEM blocks that have DOM representation
     * @constructs
     * @private
     * @param {jQuery} domElem DOM element that the block is created on
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(domElem, params, initImmediately) {

        var _this = this;

        /**
         * Block's DOM elements
         * @protected
         * @type jQuery
         */
        _this.domElem = domElem;

        /**
         * Cache for names of events on DOM elements
         * @private
         * @type Object
         */
        _this._eventNameCache = {};

        /**
         * Cache for elements
         * @private
         * @type Object
         */
        _this._elemCache = {};

        /**
         * Unique block ID
         * @private
         * @type String
         */
        uniqIdToBlock[_this._uniqId = params.uniqId || $.identify(_this)] = _this;

        /**
         * Flag for whether it's necessary to unbind from the document and window when destroying the block
         * @private
         * @type Boolean
         */
        _this._needSpecialUnbind = false;

        _this.__base(null, params, initImmediately);

    },

    /**
     * Finds blocks inside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksInside : function(elem, block) {

        return this._findBlocks('find', elem, block);

    },

    /**
     * Finds the first block inside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockInside : function(elem, block) {

        return this._findBlocks('find', elem, block, true);

    },

    /**
     * Finds blocks outside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksOutside : function(elem, block) {

        return this._findBlocks('parents', elem, block);

    },

    /**
     * Finds the first block outside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockOutside : function(elem, block) {

        return this._findBlocks('closest', elem, block)[0] || null;

    },

    /**
     * Finds blocks on DOM elements of the current block or its elements
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksOn : function(elem, block) {

        return this._findBlocks('', elem, block);

    },

    /**
     * Finds the first block on DOM elements of the current block or its elements
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockOn : function(elem, block) {

        return this._findBlocks('', elem, block, true);

    },

    _findBlocks : function(select, elem, block, onlyFirst) {

        if(!block) {
            block = elem;
            elem = undefined;
        }

        var ctxElem = elem?
                (typeof elem == 'string'? this.findElem(elem) : elem) :
                this.domElem,
            isSimpleBlock = typeof block == 'string',
            blockName = isSimpleBlock? block : (block.block || block.blockName),
            selector = '.' +
                (isSimpleBlock?
                    buildClass(blockName) :
                    buildClass(blockName, block.modName, block.modVal)) +
                (onlyFirst? ':first' : ''),
            domElems = ctxElem.filter(selector);

        select && (domElems = domElems.add(ctxElem[select](selector)));

        if(onlyFirst) {
            return domElems[0]? initBlock(blockName, domElems.eq(0), true) : null;
        }

        var res = [],
            uniqIds = {};

        $.each(domElems, function(i, domElem) {
            var block = initBlock(blockName, $(domElem), true);
            if(!uniqIds[block._uniqId]) {
                uniqIds[block._uniqId] = true;
                res.push(block);
            }
        });

        return res;

    },

    /**
     * Adds an event handler for any DOM element
     * @protected
     * @param {jQuery} domElem DOM element where the event will be listened for
     * @param {String|Object} event Event name or event object
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToDomElem : function(domElem, event, fn) {

        var _this = this;

        fn?
            domElem.bind(
                _this._buildEventName(event),
                function(e) {
                    (e.data || (e.data = {})).domElem = $(this);
                    return fn.apply(_this, arguments);
                }
            ) :
            $.each(event, function(event, fn) {
                _this.bindToDomElem(domElem, event, fn);
            });

        return _this;

    },

    /**
     * Adds an event handler to the document
     * @protected
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToDoc : function(event, fn) {

        this._needSpecialUnbind = true;
        return this.bindToDomElem(doc, event, fn);

    },

    /**
     * Adds an event handler to the window
     * @protected
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToWin : function(event, fn) {

        var _fn = fn,
            currentHeight,
            currentWidth;

        if (event === 'resize') {

            fn = function() {

                var height = win.height(),
                    width = win.width();

                if (currentHeight !== height || currentWidth !== width) {

                    currentHeight = height;
                    currentWidth = width;

                    _fn.apply(this, arguments);

                }


            }

        }

        this._needSpecialUnbind = true;
        return this.bindToDomElem(win, event, fn);

    },

    /**
     * Adds an event handler to the block's main DOM elements or its nested elements
     * @protected
     * @param {jQuery|String} [elem] Element
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindTo : function(elem, event, fn) {

        if(!event || $.isFunction(event)) { // if there is no element
            fn = event;
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.bindToDomElem(elem, event, fn);

    },

    /**
     * Removes event handlers from any DOM element
     * @protected
     * @param {jQuery} domElem DOM element where the event was being listened for
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromDomElem : function(domElem, event) {

        domElem.unbind(this._buildEventName(event));
        return this;

    },

    /**
     * Removes event handler from document
     * @protected
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromDoc : function(event) {

        return this.unbindFromDomElem(doc, event);

    },

    /**
     * Removes event handler from window
     * @protected
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromWin : function(event) {

        return this.unbindFromDomElem(win, event);

    },

    /**
     * Removes event handlers from the block's main DOM elements or its nested elements
     * @protected
     * @param {jQuery|String} [elem] Nested element
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFrom : function(elem, event) {

        if(!event) {
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.unbindFromDomElem(elem, event);

    },

    /**
     * Builds a full name for an event
     * @private
     * @param {String} event Event name
     * @returns {String}
     */
    _buildEventName : function(event) {

        var _this = this;
        return event.indexOf(' ') > 1?
            event.split(' ').map(function(e) {
                return _this._buildOneEventName(e);
            }).join(' ') :
            _this._buildOneEventName(event);

    },

    /**
     * Builds a full name for a single event
     * @private
     * @param {String} event Event name
     * @returns {String}
     */
    _buildOneEventName : function(event) {

        var _this = this,
            eventNameCache = _this._eventNameCache;

        if(event in eventNameCache) return eventNameCache[event];

        var uniq = '.' + _this._uniqId;

        if(event.indexOf('.') < 0) return eventNameCache[event] = event + uniq;

        var lego = '.bem_' + _this.__self._name;

        return eventNameCache[event] = event.split('.').map(function(e, i) {
            return i == 0? e + lego : lego + '_' + e;
        }).join('') + uniq;

    },

    /**
     * Triggers block event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .domElem && this._ctxTrigger(e, data);

        return this;

    },

    _ctxTrigger : function(e, data) {

        var _this = this,
            storage = liveEventCtxStorage[_this.__self._buildCtxEventName(e.type)],
            ctxIds = {};

        storage && _this.domElem.each(function() {
            var ctx = this,
                counter = storage.counter;
            while(ctx && counter) {
                var ctxId = $.identify(ctx, true);
                if(ctxId) {
                    if(ctxIds[ctxId]) break;
                    var storageCtx = storage.ctxs[ctxId];
                    if(storageCtx) {
                        $.each(storageCtx, function(uniqId, handler) {
                            handler.fn.call(
                                handler.ctx || _this,
                                e,
                                data);
                        });
                        counter--;
                    }
                    ctxIds[ctxId] = true;
                }
                ctx = ctx.parentNode;
            }
        });

    },

    /**
     * Sets a modifier for a block/nested element
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(elem && typeof modVal != 'undefined' && elem.length > 1) {
            var _this = this;
            elem.each(function() {
                var item = $(this);
                item.__bemElemName = elem.__bemElemName;
                _this.setMod(item, modName, modVal);
            });
            return _this;
        }
        return this.__base(elem, modName, modVal);

    },

    /**
     * Retrieves modifier value from the DOM node's CSS class
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery} [elem] Nested element
     * @param {String} [elemName] Name of the nested element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem, elemName) {

        var domNode = (elem || this.domElem)[0],
            matches;

        domNode &&
            (matches = domNode.className
                .match(this.__self._buildModValRE(modName, elemName || elem)));

        return matches? matches[2] : '';

    },

    /**
     * Retrieves a name/value list of modifiers
     * @private
     * @param {Array} [modNames] Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by names
     */
    _extractMods : function(modNames, elem) {

        var res = {},
            extractAll = !modNames.length,
            countMatched = 0;

        ((elem || this.domElem)[0].className
            .match(this.__self._buildModValRE(
                '(' + (extractAll? NAME_PATTERN : modNames.join('|')) + ')',
                elem,
                'g')) || []).forEach(function(className) {
                    var iModVal = (className = className.trim()).lastIndexOf(MOD_DELIM),
                        iModName = className.substr(0, iModVal - 1).lastIndexOf(MOD_DELIM);
                    res[className.substr(iModName + 1, iModVal - iModName - 1)] = className.substr(iModVal + 1);
                    ++countMatched;
                });

        // empty modifier values are not reflected in classes; they must be filled with empty values
        countMatched < modNames.length && modNames.forEach(function(modName) {
            modName in res || (res[modName] = '');
        });

        return res;

    },

    /**
     * Sets a modifier's CSS class for a block's DOM element or nested element
     * @private
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {jQuery} [elem] Element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {

        var _self = this.__self,
            classPrefix = _self._buildModClassPrefix(modName, elemName),
            classRE = _self._buildModValRE(modName, elemName),
            needDel = modVal === '';

        (elem || this.domElem).each(function() {
            var className = this.className;
            className.indexOf(classPrefix) > -1?
                this.className = className.replace(
                    classRE,
                    (needDel? '' : '$1' + classPrefix + modVal)) :
                needDel || $(this).addClass(classPrefix + modVal);
        });

        elemName && this
            .dropElemCache(elemName, modName, oldModVal)
            .dropElemCache(elemName, modName, modVal);

    },

    /**
     * Finds elements nested in a block
     * @protected
     * @param {String|jQuery} [ctx=this.domElem] Element where search is being performed
     * @param {String} names Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    findElem : function(ctx, names, modName, modVal) {

        if(arguments.length % 2) { // if the number of arguments is one or three
            modVal = modName;
            modName = names;
            names = ctx;
            ctx = this.domElem;
        } else if(typeof ctx == 'string') {
            ctx = this.findElem(ctx);
        }

        var _self = this.__self,
            selector = '.' +
                names.split(' ').map(function(name) {
                    return buildClass(_self._name, name, modName, modVal);
                }).join(',.');
        return findDomElem(ctx, selector);

    },

    /**
     * Finds elements nested in a block
     * @protected
     * @param {String} name Nested element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    _elem : function(name, modName, modVal) {

        var key = name + buildModPostfix(modName, modVal),
            res;

        if(!(res = this._elemCache[key])) {
            res = this._elemCache[key] = this.findElem(name, modName, modVal);
            res.__bemElemName = name;
        }

        return res;

    },

    /**
     * Lazy search for elements nested in a block (caches results)
     * @protected
     * @param {String} names Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    elem : function(names, modName, modVal) {

        if(modName && typeof modName != 'string') {
            modName.__bemElemName = names;
            return modName;
        }

        if(names.indexOf(' ') < 0) {
            return this._elem(names, modName, modVal);
        }

        var res = $([]),
            _this = this;
        names.split(' ').forEach(function(name) {
            res = res.add(_this._elem(name, modName, modVal));
        });
        return res;

    },

    /**
     * Clearing the cache for elements
     * @protected
     * @param {String} [names] Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM}
     */
    dropElemCache : function(names, modName, modVal) {

        if(names) {
            var _this = this,
                modPostfix = buildModPostfix(modName, modVal);
            names.indexOf(' ') < 0?
                delete _this._elemCache[names + modPostfix] :
                names.split(' ').forEach(function(name) {
                    delete _this._elemCache[name + modPostfix];
                });
        } else {
            this._elemCache = {};
        }

        return this;

    },

    /**
     * Retrieves parameters of a block element
     * @param {String|jQuery} elem Element
     * @returns {Object} Parameters
     */
    elemParams : function(elem) {

        var elemName;
        if(typeof elem ==  'string') {
            elemName = elem;
            elem = this.elem(elem);
        } else {
            elemName = this.__self._extractElemNameFrom(elem);
        }

        return extractParams(elem[0])[buildClass(this.__self.getName(), elemName)] || {};

    },

    /**
     * Elemify given element
     * @param {jQuery} elem Element
     * @param {String} elemName Name
     * @returns {jQuery}
     */
    elemify : function(elem, elemName) {
        (elem = $(elem)).__bemElemName = elemName;
        return elem;
    },

    /**
     * Checks whether a DOM element is in a block
     * @protected
     * @param {jQuery} domElem DOM element
     * @returns {Boolean}
     */
    containsDomElem : function(domElem) {

        var res = false;

        this.domElem.each(function() {
            return !(res = domElem.parents().andSelf().index(this) > -1);
        });

        return res;

    },

    /**
     * Builds a CSS selector corresponding to a block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return this.__self.buildSelector(elem, modName, modVal);

    },

    /**
     * Deletes a block
     * @param {Boolean} [keepDOM=false] Whether to keep the block's DOM nodes in the document
     */
    destruct : function(keepDOM) {

        var _this = this,
            _self = _this.__self;

        _this._isDestructing = true;

        _this._needSpecialUnbind && _self.doc.add(_self.win).unbind('.' + _this._uniqId);

        _this.dropElemCache().domElem.each(function(i, domNode) {
            var params = getParams(domNode);
            $.each(params, function(blockName, blockParams) {
                var block = uniqIdToBlock[blockParams.uniqId];
                block?
                    block._isDestructing || removeDomNodeFromBlock(block, domNode) :
                    delete uniqIdToDomElems[blockParams.uniqId];
            });
            cleanupDomNode(domNode);
        });

        keepDOM || _this.domElem.remove();

        delete uniqIdToBlock[_this.un()._uniqId];
        delete _this.domElem;
        delete _this._elemCache;

        _this.__base();

    }

}, /** @lends BEM.DOM */{

    /**
     * Scope
     * Will be set on onDomReady to tag `body`
     * @protected
     * @type jQuery
     */
    scope : null,

    /**
     * Document shortcut
     * @protected
     * @type jQuery
     */
    doc : doc,

    /**
     * Window shortcut
     * @protected
     * @type jQuery
     */
    win : win,

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        var _this = this,
            res = _this._liveInitable;

        if('live' in _this) {
            var noLive = typeof res == 'undefined';

            if(noLive ^ heedLive) {
                res = _this.live() !== false;
                _this.live = function() {};
            }
        }

        return res;

    },

    /**
     * Initializes blocks on a fragment of the DOM tree
     * @static
     * @protected
     * @param {jQuery} [ctx=document] Root DOM node
     * @returns {jQuery} ctx Initialization context
     */
    init : function(ctx, callback, callbackCtx) {

        if(!ctx || $.isFunction(ctx)) {
            callbackCtx = callback;
            callback = ctx;
            ctx = doc;
        }

        var uniqInitId = $.identify();
        findDomElem(ctx, '.i-bem').each(function() {
            init($(this), uniqInitId);
        });

        callback && this.afterCurrentEvent(
            function() {
                callback.call(callbackCtx || this, ctx);
            });

        // makes initialization completely synchronous
        this._runAfterCurrentEventFns();

        return ctx;

    },

    /**
     * Destroys blocks on a fragment of the DOM tree
     * @static
     * @protected
     * @param {Boolean} [keepDOM=false] Whether to keep DOM nodes in the document
     * @param {jQuery} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the context
     */
    destruct : function(keepDOM, ctx, excludeSelf) {

        if(typeof keepDOM != 'boolean') {
            excludeSelf = ctx;
            ctx = keepDOM;
            keepDOM = undefined;
        }

        findDomElem(ctx, '.i-bem', excludeSelf).each(function(i, domNode) {
            var params = getParams(this);
            $.each(params, function(blockName, blockParams) {
                if(blockParams.uniqId) {
                    var block = uniqIdToBlock[blockParams.uniqId];
                    block?
                        removeDomNodeFromBlock(block, domNode) :
                        delete uniqIdToDomElems[blockParams.uniqId];
                }
            });
            cleanupDomNode(this);
        });
        keepDOM || (excludeSelf? ctx.empty() : ctx.remove());

    },

    /**
     * Replaces a fragment of the DOM tree inside the context, destroying old blocks and intializing new ones
     * @static
     * @protected
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content New content
     * @param {Function} [callback] Handler to be called after initialization
     * @param {Object} [callbackCtx] Handler's context
     */
    update : function(ctx, content, callback, callbackCtx) {

        this.destruct(ctx, true);
        this.init(ctx.html(content), callback, callbackCtx);

    },

    /**
     * Changes a fragment of the DOM tree including the context and initializes blocks.
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    replace : function(ctx, content) {

        this.destruct(true, ctx);
        this.init($(content).replaceAll(ctx));

    },

    /**
     * Adds a fragment of the DOM tree at the end of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    append : function(ctx, content) {

        this.init($(content).appendTo(ctx));

    },

    /**
     * Adds a fragment of the DOM tree at the beginning of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    prepend : function(ctx, content) {

        this.init($(content).prependTo(ctx));

    },

    /**
     * Adds a fragment of the DOM tree before the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     */
    before : function(ctx, content) {

        this.init($(content).insertBefore(ctx));

    },

    /**
     * Adds a fragment of the DOM tree after the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     */
    after : function(ctx, content) {

        this.init($(content).insertAfter(ctx));

    },

    /**
     * Builds a full name for a live event
     * @static
     * @private
     * @param {String} e Event name
     * @returns {String}
     */
    _buildCtxEventName : function(e) {

        return this._name + ':' + e;

    },

    _liveClassBind : function(className, e, callback, invokeOnInit) {

        var _this = this;
        if(e.indexOf(' ') > -1) {
            e.split(' ').forEach(function(e) {
                _this._liveClassBind(className, e, callback, invokeOnInit);
            });
        }
        else {
            var storage = liveClassEventStorage[e],
                uniqId = $.identify(callback);

            if(!storage) {
                storage = liveClassEventStorage[e] = {};
                doc.bind(e, _this.changeThis(_this._liveClassTrigger, _this));
            }

            storage = storage[className] || (storage[className] = { uniqIds : {}, fns : [] });

            if(!(uniqId in storage.uniqIds)) {
                storage.fns.push({ uniqId : uniqId, fn : _this._buildLiveEventFn(callback, invokeOnInit) });
                storage.uniqIds[uniqId] = storage.fns.length - 1;
            }
        }

        return this;

    },

    _liveClassUnbind : function(className, e, callback) {

        var storage = liveClassEventStorage[e];
        if(storage) {
            if(callback) {
                if(storage = storage[className]) {
                    var uniqId = $.identify(callback);
                    if(uniqId in storage.uniqIds) {
                        var i = storage.uniqIds[uniqId],
                            len = storage.fns.length - 1;
                        storage.fns.splice(i, 1);
                        while(i < len) storage.uniqIds[storage.fns[i++].uniqId] = i - 1;
                        delete storage.uniqIds[uniqId];
                    }
                }
            } else {
                delete storage[className];
            }
        }

        return this;

    },

    _liveClassTrigger : function(e) {

        var storage = liveClassEventStorage[e.type];
        if(storage) {
            var node = e.target, classNames = [];
            for(var className in storage) storage.hasOwnProperty(className) && classNames.push(className);
            do {
                var nodeClassName = ' ' + node.className + ' ', i = 0;
                while(className = classNames[i++]) {
                    if(nodeClassName.indexOf(' ' + className + ' ') > -1) {
                        var j = 0, fns = storage[className].fns, fn, stopPropagationAndPreventDefault = false;
                        while(fn = fns[j++])
                            if(fn.fn.call($(node), e) === false) stopPropagationAndPreventDefault = true;

                        stopPropagationAndPreventDefault && e.preventDefault();
                        if(stopPropagationAndPreventDefault || e.isPropagationStopped()) return;

                        classNames.splice(--i, 1);
                    }
                }
            } while(classNames.length && (node = node.parentNode));
        }

    },

    _buildLiveEventFn : function(callback, invokeOnInit) {

        var _this = this;
        return function(e) {
            var args = [
                    _this._name,
                    ((e.data || (e.data = {})).domElem = $(this)).closest(_this.buildSelector()),
                    true ],
                block = initBlock.apply(null, invokeOnInit? args.concat([callback, e]) : args);

            if(block && !invokeOnInit && callback)
                return callback.apply(block, arguments);
        };

    },

    /**
     * Helper for live initialization for an event on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String} [elemName] Element name or names (separated by spaces)
     * @param {String} event Event name
     * @param {Function} [callback] Handler to call after successful initialization
     */
    liveInitOnEvent : function(elemName, event, callback) {

        return this.liveBindTo(elemName, event, callback, true);

    },

    /**
     * Helper for subscribing to live events on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String|Object} [to] Description (object with modName, modVal, elem) or name of the element or elements (space-separated)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     */
    liveBindTo : function(to, event, callback, invokeOnInit) {

        if(!event || $.isFunction(event)) {
            callback = event;
            event = to;
            to = undefined;
        }

        if(!to || typeof to == 'string') {
            to = { elem : to };
        }

        to.elemName && (to.elem = to.elemName);

        var _this = this;

        if(to.elem && to.elem.indexOf(' ') > 0) {
            to.elem.split(' ').forEach(function(elem) {
                _this._liveClassBind(
                    buildClass(_this._name, elem, to.modName, to.modVal),
                    event,
                    callback,
                    invokeOnInit);
            });
            return _this;
        }

        return _this._liveClassBind(
            buildClass(_this._name, to.elem, to.modName, to.modVal),
            event,
            callback,
            invokeOnInit);

    },

    /**
     * Helper for unsubscribing from live events on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String} [elem] Name of the element or elements (space-separated)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     */
    liveUnbindFrom : function(elem, event, callback) {

        var _this = this;

        if(elem.indexOf(' ') > 1) {
            elem.split(' ').forEach(function(elem) {
                _this._liveClassUnbind(
                    buildClass(_this._name, elem),
                    event,
                    callback);
            });
            return _this;
        }

        return _this._liveClassUnbind(
            buildClass(_this._name, elem),
            event,
            callback);

    },

    /**
     * Helper for live initialization when a different block is initialized
     * @static
     * @private
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     * @param {String} findFnName Name of the method for searching
     */
    _liveInitOnBlockEvent : function(event, blockName, callback, findFnName) {

        var name = this._name;
        blocks[blockName].on(event, function(e) {
            if(!e.block.domElem) return; // if block was destructed at that moment

            var args = arguments,
                blocks = e.block[findFnName](name);

            callback && blocks.forEach(function(block) {
                callback.apply(block, args);
            });
        });
        return this;

    },

    /**
     * Helper for live initialization for a different block's event on the current block's DOM element
     * @static
     * @protected
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOn');

    },

    /**
     * Helper for live initialization for a different block's event inside the current block
     * @static
     * @protected
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInsideEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOutside');

    },

    /**
     * Helper for live initialization when a different block is initialized on a DOM element of the current block
     * @deprecated - use liveInitOnBlockEvent
     * @static
     * @protected
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInit : function(blockName, callback) {

        return this.liveInitOnBlockEvent('init', blockName, callback);

    },

    /**
     * Helper for live initialization when a different block is initialized inside the current block
     * @deprecated - use liveInitOnBlockInsideEvent
     * @static
     * @protected
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInsideInit : function(blockName, callback) {

        return this.liveInitOnBlockInsideEvent('init', blockName, callback);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @static
     * @protected
     * @param {jQuery} [ctx] The element in which the event will be listened for
     * @param {String} e Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler's context
     */
    on : function(ctx, e, data, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxBind(ctx, e, data, fn, fnCtx) :
            this.__base(ctx, e, data, fn);

    },

    /**
     * Removes the live event handler from a block, based on a specified element where the event was being listened for
     * @static
     * @protected
     * @param {jQuery} [ctx] The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    un : function(ctx, e, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxUnbind(ctx, e, fn, fnCtx) :
            this.__base(ctx, e, fn);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @deprecated Use on
     * @static
     * @protected
     * @param {jQuery} ctx The element in which the event will be listened for
     * @param {String} e Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler context
     */
    liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        return this._liveCtxBind(ctx, e, data, fn, fnCtx);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @static
     * @private
     * @param {jQuery} ctx The element in which the event will be listened for
     * @param {String} e  Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler context
     */
    _liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        var _this = this;

        if(typeof e == 'string') {
            if($.isFunction(data)) {
                fnCtx = fn;
                fn = data;
                data = undefined;
            }

            if(e.indexOf(' ') > -1) {
                e.split(' ').forEach(function(e) {
                    _this._liveCtxBind(ctx, e, data, fn, fnCtx);
                });
            } else {
                var ctxE = _this._buildCtxEventName(e),
                    storage = liveEventCtxStorage[ctxE] ||
                        (liveEventCtxStorage[ctxE] = { counter : 0, ctxs : {} });

                ctx.each(function() {
                    var ctxId = $.identify(this),
                        ctxStorage = storage.ctxs[ctxId];
                    if(!ctxStorage) {
                        ctxStorage = storage.ctxs[ctxId] = {};
                        ++storage.counter;
                    }
                    ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')] = {
                        fn   : fn,
                        data : data,
                        ctx  : fnCtx
                    };
                });
            }
        } else {
            $.each(e, function(e, fn) {
                _this._liveCtxBind(ctx, e, fn, data);
            });
        }

        return _this;

    },

    /**
     * Removes a live event handler from a block, based on a specified element where the event was being listened for
     * @deprecated Use on
     * @static
     * @protected
     * @param {jQuery} ctx The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        return this._liveCtxUnbind(ctx, e, fn, fnCtx);

    },

    /**
     * Removes a live event handler from a block, based on a specified element where the event was being listened for
     * @static
     * @private
     * @param {jQuery} ctx The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    _liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        var _this = this,
            storage = liveEventCtxStorage[e =_this._buildCtxEventName(e)];

        if(storage) {
            ctx.each(function() {
                var ctxId = $.identify(this, true),
                    ctxStorage;
                if(ctxId && (ctxStorage = storage.ctxs[ctxId])) {
                    fn && delete ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')];
                    if(!fn || $.isEmptyObject(ctxStorage)) {
                        storage.counter--;
                        delete storage.ctxs[ctxId];
                    }
                }
            });
            storage.counter || delete liveEventCtxStorage[e];
        }

        return _this;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {jQuery} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {

        if(elem.__bemElemName) return elem.__bemElemName;

        var matches = elem[0].className.match(this._buildElemNameRE());
        return matches? matches[1] : undefined;

    },

    /**
     * Retrieves block parameters from a DOM element
     * @static
     * @param {HTMLElement} domNode DOM node
     * @returns {Object}
     */
    extractParams : extractParams,

    /**
     * Builds a prefix for the CSS class of a DOM element or nested element of the block, based on modifier name
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {

        return buildClass(this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;

    },

    /**
     * Builds a regular expression for extracting modifier values from a DOM element or nested element of a block
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @param {String} [quantifiers] Regular expression quantifiers
     * @returns {RegExp}
     */
    _buildModValRE : function(modName, elem, quantifiers) {

        return new RegExp('(\\s|^)' + this._buildModClassPrefix(modName, elem) + '(' + NAME_PATTERN + ')(?=\\s|$)', quantifiers);

    },

    /**
     * Builds a regular expression for extracting names of elements nested in a block
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {

        return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');

    },

    /**
     * Builds a CSS selector corresponding to the block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return '.' + buildClass(this._name, elem, modName, modVal);

    },

    /**
     * Returns a block instance by unique ID
     * @deprecated
     * @param {String} [uniqId]
     * @returns {BEM.DOM}
     */
    getBlockByUniqId : function(uniqId) {

        return uniqIdToBlock[uniqId];

    },

    /**
     * Returns the size of the current window
     * @returns {Object} Object with width and height fields
     */
    getWindowSize : function() {

        return {
            width  : win.width(),
            height : win.height()
        };

    }

});

/**
 * Set default scope after DOM ready
 */
$(function() {
    BEM.DOM.scope = $('body');
});

})(BEM, jQuery);

/* ../../libs/bem-bl/blocks-common/i-bem/__dom/i-bem__dom.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__string/i-ecma__string.js begin */
(function() {

String.prototype.trim || (String.prototype.trim = function () {

    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;

    while(ws.test(str.charAt(--i)));

    return str.slice(0, i + 1);

});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__string/i-ecma__string.js end */
;
/* ../../libs/romochka/blocks-common/i-common/check-session/i-common__check-session.js begin */
(function(Lego){
if (!Lego) Lego = window.Lego = {};
/**
 * Проверяет жива ли сессия пользователя (наличие куки yandex_login).
 *
 * @return  true, если сессия пользователя живая.
 */
Lego.isSessionValid = function() {
    return !!Lego.getCookie('yandex_login');
}
})(window.Lego);

/* ../../libs/romochka/blocks-common/i-common/check-session/i-common__check-session.js end */
;
/* ../../libs/romochka/blocks-common/i-global/i-global.js begin */

BEM.DOM.decl('i-global', {

    onSetMod : {

        'js' : function() {

            // удаляем системные свойства
            this.del(this.__self._params = $.extend({}, this.params), 'uniqId', 'name');

            var params = this.__self._params;

            params['passport-msg'] || (params['passport-msg'] = params.id);

            if(params['show-counters'] === undefined) {
                params['show-counters'] = Math.round(Math.random() * 100) <= params['show-counters-percent'];
            }
            params.locale = params.lang;

            $(function(){
                params.oframebust && Lego.oframebust(params.oframebust);
            });

        }

    },

    getDefaultParams : function() {

        return {
            id : '',
            login : Lego.isSessionValid() ? $.cookie('yandex_login') || '' : '',
            yandexuid : $.cookie('yandexuid'),
            lang : 'ru',
            tld : 'ru',
            retpath : encodeURI($.decodeURI(location.href)), // LEGO-8443 + LEGO-9226
            'passport-host' : 'https://passport.yandex.ru',
            'pass-host' : '//pass.yandex.ru',
            'social-host' : '//social.yandex.ru',
            'lego-path' : '/lego',
            'show-counters-percent' : 100
        };

    }

}, {

    param  : function(name) {

        return (this._params || {})[name];

    }

});

/* ../../libs/romochka/blocks-common/i-global/i-global.js end */
;
/* ../../libs/romochka/blocks-common/i-counter/i-counter.js begin */
(function(Lego){
if (!Lego) Lego = window.Lego = {};

!Lego.params && (Lego.params = {});


/**
 * Хелпер удаляющий протокол из переданного хоста, для приведения
 * к каноническому виду.
 *
 * @param h {String}
 * @returns {String}
 */
function preparseHost(h) {
    return h.replace(/^(?:https?:)?\/\//, '');
}

/**
 * Счётчик клика на ссылку или просто показа.
 *
 * В случае клика подменяет href на redir'овский, потом по таймауту возвращает его обратно.
 *
 * В случае учёта показа динамически создаёт скрипт с URL системы учёта.
 *
 * Пример использования:
 *
 * <a href="http://meteoinfo.ru" onmousedown="Lego.c('stred/pid=7/cid=433',this)">Гидрометцентр</a>
 *
 * или
 *
 * < script type="text/javascript">Lego.c('stred/pid=7/cid=433')< /script>
 *
 * @param w     параметры счётчика
 * @param a     (optional) ссылка, клик на которую надо учитывать
 * @param opts  (optional) opts.noRedirect = true обрабатывает клик по обычной ссылке, как по b-link_pseudo_yes
 */ /**/
Lego.c = function(w, a, opts) {
/*
    new Image().src = location.protocol + '//clck.yandex.ru/click/dtype=' + w +
        '/rnd=' + ((new Date()).getTime() + Math.round(Math.random()*100)) +
        '/*' + (a ? (a.href || location.href) : '');
*/

    var host = preparseHost((opts && opts.host) || BEM.blocks['i-global'].param('click-host') || 'clck.yandex.ru'),
        url = function(w, h, t, a) {

            h = h.replace("'", "%27"); //см. LEGO-6428

            return h.indexOf('/dtype=') > -1?
                h :
                location.protocol + '//' + host + '/' + t + '/dtype=' + w +
                    '/rnd=' + ((new Date()).getTime() + Math.round(Math.random()*100)) +
                    (a?
                        '/*' + (h.match(/^http/) ? h : location.protocol + '//' + location.host + (h.match('^/') ? h : '/' + h)) :
                        '/*data=' + encodeURIComponent('url='+ encodeURIComponent((h.match(/^http/) ? h : location.protocol + '//' + location.host + (h.match('^/') ? h : '/' + h)))));
        },
        click = function() {
            var head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.setAttribute('src', url(w, location.href, 'jclck'));
            head.insertBefore(script, head.firstChild);
        };

    if (a) {
        // для псевдоссылки и ссылки mailto просто считаем click, создавая iframe и в него грузим счётчик
        if (a.className.match(/b-link_pseudo_yes/) || (a.href && a.href.match(/^mailto:/)) || (opts && opts.noRedirect === true)) {
            click();
        } else if (a.href) { // клик на ссылку, подменяем href на redir'овский, потом по таймауту обратно
            var h = a.href;
            a.href = url(w, h, "redir");
            setTimeout(function() { a.href = h }, 500);
        } else if (a.form) { // клик на элемент формы
            if (a.type.match(/submit|button|image/)) { // клик на кнопку, подменяем action на redir'овский, потом по таймауту обратно
                var h = a.form.action;
                a.form.action = url(w, h, "redir", true);
                setTimeout(function() { a.form.action = h }, 500);
            } else { // просто считаем click, создавая iframe и в него грузим счётчик
                click();
            }
        } else if (a.action) { //случай сабмита формы - подменяем его action на redir'овский, назад нам его менять не нужно
            a.action = url(w, a.action, "redir", true);
        } else {
            throw "counter.js: not link and not form!";
        }
    } else { // ссылки нет, просто учёт показа, создаём iframe и в него грузим счётчик
        click();
    }
}

})(window.Lego);

(function(Lego, undefined){
if (!Lego) Lego = window.Lego = {};

/**
 * Параметризованный счётчик клика на ссылку или просто показа.
 * Перевызывает Lego.c(w, a) из counter.js
 *
 * В случае клика подменяет href на redir'овский, потом по таймауту возвращает его обратно.
 *
 * В случае учёта показа динамически создаёт iframe с URL системы учёта.
 *
 * Пример использования:
 *
 * < a href="http://meteoinfo.ru" onclick="Lego.cp(0,1917,'weather.tabs.fotki',this)">Гидрометцентр< /a>
 *
 * или
 *
 * < script type="text/javascript">Lego.cp(0,1917,'weather.tabs.fotki')< /script>
 *
 * или даже
 *
 * < a href="http://meteoinfo.ru" onclick="Lego.cp(0,1917,'weather.tabs.fotki','84=85,732=87')">Гидрометцентр< /a>
 *
 * @param pi    номер проекта (pid)
 * @param ci    номер счётчика (cid)
 * @param p     (optional) path
 * @param v     (optional) vars
 * @param a     (optional) ссылка, клик на которую надо учитывать
 * @param opts  (optional) opts.noRedirect = true обрабатывает клик по обычной ссылке, как по b-link_pseudo_yes
 */
Lego.cp = function(pi, ci, p, v, a, opts) {
    typeof v === 'string' ||
        (opts = a, a = v, v = undefined);
    Lego.c('stred/pid=' + pi + '/cid=' + ci + (p ? '/path=' + p + (v ? '/vars=' + v : '') : ''), a, opts);
};

})(window.Lego);

(function(Lego){
if (!Lego) Lego = window.Lego = {};

/**
 * Параметризованный счётчик клика на ссылку в шапке. Перевызывает cp(w, a) из counter-cp.js
 * Используется для уменьшения веса страницы.
 *
 * Пример использования:
 *
 * < a href="http://meteoinfo.ru" onclick="ch('weather.tabs.fotki',this)">Гидрометцентр< /a>
 *
 * или
 *
 * < script type="text/javascript">ch('weather')< /script>
 *
 * @param p     path
 * @param v     (optional) vars
 * @param a     (optional) ссылка, клик на которую надо учитывать
 */
Lego.ch = function(p, v, a) {
    BEM.blocks['i-global'].param('show-counters') && Lego.cp(0, 2219, p, v, a);
};

})(window.Lego);

/* ../../libs/romochka/blocks-common/i-counter/i-counter.js end */
;
/* ../../libs/romochka/blocks-common/i-common/cookie/i-common__cookie.js begin */
(function(Lego){
if (!Lego) Lego = window.Lego = {};

Lego.getCookie = function(n) {
    var c = document.cookie;
    if (c.length < 1) return false;

    var b = c.indexOf(n + '=');
    if (b == -1) return false;

    b += (n.length + 1);
    var e = c.indexOf(';', b);

    return decodeURIComponent((e == -1) ? c.substring(b) : c.substring(b, e));
}

})(window.Lego);

/* ../../libs/romochka/blocks-common/i-common/cookie/i-common__cookie.js end */
;
/* ../../libs/romochka/blocks-common/i-common/init/i-common__init.js begin */
(function($, Lego){
if (!Lego) Lego = window.Lego = {};
// Использует cookie.js и check-session.js. Без них не работает.

/**
 * Инициализирует Лего некоторыми параметрами (для вариативности в пределах разных страниц).
 *
 * @param params объект Лего-параметров, необходимые параметры инициализируются умолчательными значениями
 *        params.login логин текущего пользователя ('' для неавторизованного)
 *        params.locale двухбуквенный код локали в нижнем регистре
 *        params.id идентификатор сервиса
 *        params['show-counters-percent'] процент срабатывания счётчиков Lego.ch() (по умолчанию 100)
 *
 * @return возвращает установленные параметры с учетом умолчательных значений
 */
Lego.init || (Lego.init = function(params) {
    (params = Lego.params = $.extend(
        {
            id : '',
            login : Lego.isSessionValid() ? Lego.getCookie('yandex_login') || '' : '',
            yandexuid : Lego.getCookie('yandexuid'),
            locale : 'ru',
            retpath : window.location.toString(),
            'passport-host' : '//passport.yandex.ru',
            'pass-host' : '//pass.yandex.ru',
            'passport-msg' : params.id,
            'social-host' : '//social.yandex.ru',
            'lego-path' : '/lego',
            'show-counters-percent' : 100
        },
        params,
        Lego.params))
        ['show-counters'] = Math.round(Math.random() * 100) <= params['show-counters-percent'];

    BEM.blocks['i-global']._params || $.extend(BEM.blocks['i-global']._params = {}, params);

    $(function(){
        params.oframebust && Lego.oframebust(params.oframebust);
    });

    return params;
});

Lego.block || (Lego.block = {});

Lego.blockInit || (Lego.blockInit = function(context, blockSelector) {
    context = context || document;
    blockSelector = blockSelector || '.g-js';
    $(context).find(blockSelector).each(function(){
        var block = $(this),
            params = this.onclick ? this.onclick() : {},
            name = params.name || '',
            init = Lego.block[name];
        if (init && !block.data(name)) {
            init.call(block, params);
            block
                .data(name, true)
                .addClass(name + '_js_inited');
        }
    });
});

Lego.blockInitBinded || (Lego.blockInitBinded = !!$(document).ready(function(){ Lego.blockInit() }));

})(jQuery, window.Lego);

/* ../../libs/romochka/blocks-common/i-common/init/i-common__init.js end */
;
/* ../../libs/romochka/blocks-common/i-common/i-common.js begin */
(function(Lego){
if (!Lego) Lego = window.Lego = {};

Lego.messages = Lego.messages || {};

Lego.message = function(id, text) {
    return Lego.params.locale == 'ru' ? text : (Lego.messages[id] || text);
};

})(window.Lego);
/* ../../libs/romochka/blocks-common/i-common/i-common.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/_init/i-bem__dom_init_auto.js begin */
/* дефолтная инициализация */
$(function() {
    BEM.DOM.init();
});
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/_init/i-bem__dom_init_auto.js end */
;
/* ../../libs/romochka/blocks-desktop/i-oframebust/i-oframebust.js begin */
(function(Lego) {

    Lego = Lego || {};

    Lego.oframebustMatchDomain = function(whitelist, domain) {
        whitelist = Object.prototype.toString.call(whitelist) === "[object Array]" ? whitelist : (function() {
            var arr = [];
            for (var k in whitelist) {
                whitelist.hasOwnProperty(k) && arr.push(k);
            }
            return arr;
        }());

        for (var i = 0, l = whitelist.length; i < l; i++) {
            var d = whitelist[i];
            if (typeof(d) == 'string') {
                //поддержка wildcard
                if (/(\?|\*)/.test(d)) {
                    var re = d.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '\.{1}');
                    if ((new RegExp('^' + re + '$')).test(domain)) return true;
                } else if (domain == d) {
                    return true; //обычная строка
                }
            } else {
                //предполагаем, что d -- regexp
                try {
                    if (d.test(domain)) return true;
                } catch(e) {}
            }
        }
    }

})(window.Lego);

/* ../../libs/romochka/blocks-desktop/i-oframebust/i-oframebust.js end */
;
/* ../../libs/romochka/blocks-desktop/i-oframebust/_type/i-oframebust_type_referrer.js begin */
(function(Lego) {

    Lego = Lego || {};

    Lego.oframebust = function(whitelist) {
        if (window.top.location != window.location) {
            var match = document.referrer.match(/^https?:\/\/([^:\/\s]+)\/?.*/);

            //не выпрыгиваем для тех, у кого скрыт referrer
            if (!match) return;

            !Lego.oframebustMatchDomain(whitelist, match[1]) && (window.top.location = window.location);
        }
    };

})(window.Lego);

/* ../../libs/romochka/blocks-desktop/i-oframebust/_type/i-oframebust_type_referrer.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__leftclick/i-jquery__leftclick.js begin */
/**
 * leftClick event plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 */

(function($) {

var leftClick = $.event.special.leftclick = {

    setup : function() {

        $(this).bind('click', leftClick.handler);

    },

    teardown : function() {

        $(this).unbind('click', leftClick.handler);

    },

    handler : function(e) {

        if(!e.button) {
            e.type = 'leftclick';
            $.event.handle.apply(this, arguments);
            e.type = 'click';
        }

    }

};

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__leftclick/i-jquery__leftclick.js end */
;
/* ../../libs/romochka/blocks-desktop/b-link/b-link.js begin */
/** @requires BEM */
/** @requires BEM.HTML */

BEM.HTML.decl('b-link', {
    onBlock: function(ctx) {
        ctx
            .tag('a')
            .attr('href', ctx.param('url'));

        var props = ['title', 'target'], p;
        while(p = props.pop()) ctx.param(p) && (ctx.attr(p, ctx.param(p)));
    }
});

/* ../../libs/romochka/blocks-desktop/b-link/b-link.js end */
;
/* ../../libs/bem-bl/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js begin */
BEM.DOM.decl({'name': 'b-link', 'modName': 'pseudo', 'modVal': 'yes'}, {

    _onClick : function(e) {

        e.preventDefault();

        this.hasMod('disabled', 'yes') || this.afterCurrentEvent(function() {
            this.trigger('click');
        });

    }

}, {

    live : function() {

        this.__base.apply(this, arguments);

        this.liveBindTo({ modName : 'pseudo', modVal : 'yes' }, 'leftclick', function(e) {
            this._onClick(e);
        });

    }

});

/* ../../libs/bem-bl/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js end */
;
/* ../../libs/romochka/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js begin */
/** @requires BEM */
/** @requires BEM.HTML */

BEM.HTML.decl({name: 'b-link', modName: 'pseudo', modVal: 'yes'}, {
    onBlock: function(ctx) {
        ctx.tag(ctx.param('url') ? 'a': 'span');

        ctx.wrapContent({ elem : 'inner' });

        ctx.js(true);
    },

    onElem : {
        'inner': function(ctx) {
            ctx.tag('span');
        }
     }
});


/* ../../libs/romochka/blocks-desktop/b-link/_pseudo/b-link_pseudo_yes.js end */
;
/* ../../libs/romochka/blocks-desktop/b-dropdowna/b-dropdowna.js begin */
(function($) {
BEM.DOM.decl('b-dropdowna', {

    onSetMod : {

        'js' : function() {

            this._getSwitcher().on('click', this._toggle, this);

        },

        'disabled' : function(modName, modVal) {

            this._getSwitcher().setMod(modName, modVal);
            modVal == 'yes' && this.getPopup().hide();

        }

    },

    /**
     * Возвращает блок свитчера
     * @private
     */
    _getSwitcher : function() {

        return this._switcher ||
            (this._switcher =
                this.findBlockInside('b-' + (this.getMod(this.elem('switcher'), 'type') || 'link' )));

    },

    _toggle : function() {

        this.getPopup().toggle(this.elem('switcher'));

    },

    getPopup : function() {

        return this._popup || (this._popup = this.findBlockInside('b-popupa'))
            .on('outside-click', function(e, data) {
                this._getSwitcher().containsDomElem($(data.domEvent.target)) && e.preventDefault();
            }, this);

    },

    destruct : function() {

        var popup = this._popup;
        popup && popup.destruct();

        this.__base.apply(this, arguments);

    }

}, {

    live : function() {

        this.liveInitOnEvent('switcher', 'leftclick', function() {});

    }

});
})(jQuery);

BEM.HTML.decl('b-dropdowna', {

    onBlock: function (ctx) {
        ctx.js(true);
    }

});

/* ../../libs/romochka/blocks-desktop/b-dropdowna/b-dropdowna.js end */
;
/* ../../libs/romochka/blocks-desktop/b-popupa/b-popupa.js begin */
(function($) {

var ALLOWED_DIRECTIONS = [
        'down-right', 'down', 'down-left', 'up', 'up-right', 'up-left',
        'right-down', 'right', 'right-up', 'left-down', 'left', 'left-up'
    ];

/**
 @namespace JS-API блока b-popupa
 @name block */

BEM.DOM.decl('b-popupa',  /** @lends block.prototype */ {

    onSetMod : {

        'js' : function() {

            /**
             * DOM-элемент, для которого открывается попап
             * @private
             * @type jQuery
             */
            this._owner = null;

            /**
             * Состояние видимости
             * @private
             * @type Boolean
             */
            this._isShowed = false;

            /**
             * Приоритетное направление для открытия попапа
             * @private
             * @type String
             */
            this._direction = this.getMod('direction') || 'down';

            /**
             * Последнее удачное направление открытия (когда попап полностью попал в окно)
             * @private
             * @type String
             */
            this._lastDirection = null;

            /**
             * Наличие/Отсутствие хвостика у блока
             * @private
             * @type Boolean
             */
            this._hasTail = !!this.elem('tail').length;

            if(!this._hasTail){
                // Обнуляем размеры хвостика в js параметрах блока при его отсутствии
                Object.keys(this.params).forEach(function(key){
                    (key.indexOf('tail') === 0) && (this.params[key] = 0);
                }, this);
            }

        }

    },

    /**
     * Показывает попап
     * @param {jQuery|Object} owner DOM-элемент или координаты { left : x, top : y }, относительно которых рассчитывается положение
     */
    show : function(owner) {

        if(!this._isShowed || this._owner !== owner) {
            this._owner = owner;
            this._getUnder().show({ left : -10000, top : -10000 });
            this.pos();
            this._getUnder().setMod('animate','yes');
        }

        return this;

    },

    /**
     * Скрывает попап
     */
    hide : function() {

        this._isShowed && this._getUnder().hide();
        return this;

    },

    /**
     * Показывает/скрывает попап в зависимости от текущего состояния
     * @param {jQuery|Object} owner DOM-элемент или координаты { left : x, top : y }, относительно которых рассчитывается положение
     */
    toggle : function(owner) {

        return this.isShowed()?
            this.hide() :
            this.show(owner);

    },

    /**
     * Позиционирует попап
     */
    _pos : function() {

        var params = this._calcParams(this._owner);

        this._hasTail && this.elem('tail').css(params.tailOffsets);

        this
            .setMod('direction', params.direction)
            ._getUnder().show(params.offsets);

        return this;

    },

    /**
     * Позиционирует попап, если он виден
     */
    pos : function() {

        if (!this._isShowed)
            return this;

        return this._pos();
    },

    /**
     * Возвращает состояние видимости попапа
     * @returns {Boolean}
     */
    isShowed : function() {

        return this._isShowed;

    },

    /**
     * Устанавливает приоритетное направление открытия попапа
     * @param {String} direction направление (up|right|down|left)
     */
    setDirection : function(direction) {

        if(this._direction != direction) {
            this._direction = direction;
            this.isShowed() && this.pos();
        }

    },

    /**
     * Устанавливает контент попапа
     * @param {String|jQuery} content контент
     * @param {Function} [callback] обработчик, вызываемый после инициализации
     * @param {Object} [callbackCtx] контекст обработчика
     */
    setContent : function(content, callback, callbackCtx) {

        BEM.DOM.update(this.elem('content'), content, callback, callbackCtx);
        return this.isShowed()? this.pos() : this;

    },

    /**
     * Проверяет, является ли владелец попапа DOM-элементом
     * @returns {Boolean}
     */
    _isOwnerNode : function() {

        return !!(this._owner && this._owner.jquery);

    },

    /**
     * Вычисляет необходимые метрики для расчета направления открытия попапа
     * @private
     * @returns {Object}
     */
    _calcDimensions : function() {

        var posElem = this._getUnder().domElem,
            underElem = this._getUnder()._getUnder(),
            win = this.__self.win,
            owner = this._owner,
            isOwnerNode = this._isOwnerNode(),
            ownerOffset = isOwnerNode? owner.offset() : owner,
            ownerWidth = isOwnerNode? owner.outerWidth() : 0,
            ownerHeight = isOwnerNode? owner.outerHeight() : 0,
            scrollLeft = win.scrollLeft(),
            scrollTop = win.scrollTop(),
            winSize = this.__self.getWindowSize(),
            borderWidth = parseInt(this.elem('content').css('border-top-width'), 10);

        return {
            ownerWidth: ownerWidth,
            ownerHeight: ownerHeight,
            ownerLeft: ownerOffset.left,
            ownerTop: ownerOffset.top,
            ownerRight: ownerOffset.left + ownerWidth,
            ownerBottom: ownerOffset.top + ownerHeight,
            ownerHorizMiddle: ownerOffset.left + ownerWidth / 2,
            ownerVertMiddle: ownerOffset.top + ownerHeight / 2,
            posWidth: posElem.outerWidth(),
            posHeight: posElem.outerHeight(),
            underWidth: underElem.outerWidth(),
            underHeight: underElem.outerHeight(),
            borderWidth: isNaN(borderWidth)? 0: borderWidth,
            windowLeft: scrollLeft,
            windowRight: scrollLeft + winSize.width,
            windowTop: scrollTop,
            windowBottom: scrollTop + winSize.height
        };

    },

    /**
     * Вычисляет параметры открытия попапа
     * @private
     * @returns {Object} хэш вида { direction, offset.left, offset.top }
     */
    _calcParams : function() {

        var d = this._calcDimensions();

        if(this.hasMod('adjustable', 'no'))
            return this.calcDirectionParams(this._direction, d);

        var checkedDirections = {},
            allowedDirections = this.params.directions,
            currentDirectionIdx = $.inArray(this._direction, allowedDirections);

        // обработка случая когда текущее направление открытия не является допустимым
        currentDirectionIdx > -1 || (currentDirectionIdx = 0);

        var priorityDirectionIdx = currentDirectionIdx,
            currentDirection, params;

        do {
            currentDirection = allowedDirections[currentDirectionIdx];
            params = checkedDirections[currentDirection] = this.calcDirectionParams(currentDirection, d);
            if(!params.factor) {// значит полностью попал в окно
                this._lastDirection = currentDirection;
                return params;
            }

            // находим следующее возможное направление открытия, если оно есть
            ++currentDirectionIdx == allowedDirections.length && (currentDirectionIdx = 0);

        } while(currentDirectionIdx !== priorityDirectionIdx);

        return checkedDirections[this._lastDirection || allowedDirections[0]];

    },


    /**
     * Рассчитывает параметры открытия попапа в заданном направлении
     * @private
     * @param {String} direction направление
     * @param {Object} d метрики
     * @returns {Object}
     */
    calcDirectionParams: function(direction, d) {

        var factor, // фактор попадания в окно

            // Кэш параметров
            params = this.params,

            // смещение попапа
            offsets = {
                top: 0,
                left: 0
            },

            // отступы для хвостика
            tailOffsets = {
                marginLeft: 0,
                marginTop: 0
            },

            // генеральное направление (up, down, left, right)
            calcDirection = direction.split('-')[0],

            // коррекция на тот случай, если owner меньше хвостика
            correctionHoriz = (this._hasTail && d.ownerWidth < params.tailWidthVertical) ?
                (params.tailWidthVertical - d.ownerWidth)/2 : 0,

            correctionVert = (this._hasTail && d.ownerHeight < params.tailHeightHorizontal) ?
                (params.tailHeightHorizontal - d.ownerHeight)/2 : 0;

        switch(direction) {
            case 'up':
            case 'down':

                offsets.left = d.ownerHorizMiddle - d.posWidth / 2;

                offsets.top = direction == 'down'
                    ? d.ownerBottom + params.tailHeightVertical
                    : d.ownerTop - d.posHeight - params.tailHeightVertical;

                tailOffsets.marginLeft = d.posWidth / 2 - params.tailWidthVertical / 2;

                tailOffsets.marginTop = direction == 'down'
                    ? 0 - params.tailHeightVertical
                    : 0;
            break;

            case 'up-left':
            case 'up-right':
            case 'down-left':
            case 'down-right':

                offsets.left = direction == 'down-right' || direction == 'up-right'
                    ? d.ownerLeft - correctionHoriz
                    : d.ownerRight - d.posWidth + correctionHoriz;

                offsets.top = calcDirection == 'down'
                    ? d.ownerBottom + params.tailHeightVertical
                    : d.ownerTop - d.posHeight - params.tailHeightVertical;

                tailOffsets.marginLeft = d.ownerWidth > d.posWidth
                    ? d.posWidth / 2 - params.tailWidthVertical / 2
                    : d.ownerHorizMiddle - offsets.left - params.tailWidthVertical / 2;

                tailOffsets.marginTop = calcDirection == 'down'
                    ? d.borderWidth - params.tailHeightVertical
                    : 0 - d.borderWidth;
            break;

            case 'left-down':
            case 'right-down':

                offsets.left = direction == 'left-down'
                    ? d.ownerLeft - d.posWidth - params.tailWidthHorizontal
                    : d.ownerRight + params.tailWidthHorizontal;

                offsets.top = d.ownerTop - correctionVert;

                tailOffsets.marginLeft = direction == 'left-down'
                    ? 0 - d.borderWidth
                    : d.borderWidth - params.tailWidthHorizontal;

                tailOffsets.marginTop = d.ownerHeight < d.posHeight
                    ? d.ownerVertMiddle - offsets.top - params.tailHeightHorizontal / 2
                    : d.posHeight / 2 - params.tailHeightHorizontal / 2;
            break;

            case 'left':
            case 'right':

                offsets.left = direction == 'left'
                    ? d.ownerLeft - d.posWidth - params.tailWidthHorizontal
                    : d.ownerRight + params.tailWidthHorizontal;

                offsets.top = d.ownerVertMiddle - d.posHeight / 2;

                tailOffsets.marginLeft = direction == 'left'
                    ? 0 - d.borderWidth
                    : d.borderWidth - params.tailWidthHorizontal;

                tailOffsets.marginTop = d.posHeight / 2 - params.tailHeightHorizontal / 2;
            break;

            case 'left-up':
            case 'right-up':

                offsets.left = direction == 'left-up'
                    ? d.ownerLeft - d.posWidth - params.tailWidthHorizontal
                    : d.ownerRight + params.tailWidthHorizontal;

                offsets.top = d.ownerBottom - d.posHeight + correctionVert;

                tailOffsets.marginLeft = calcDirection == 'left'
                    ? 0 - d.borderWidth
                    : d.borderWidth - params.tailWidthHorizontal;

                tailOffsets.marginTop = d.ownerHeight > d.posHeight
                    ? d.posHeight / 2 - params.tailHeightHorizontal / 2
                    : d.ownerVertMiddle - offsets.top - params.tailHeightHorizontal / 2;
        }

        factor = this.calcInWindowFactor(offsets, d);

        return {
            direction : calcDirection,
            factor : factor,
            offsets : offsets,
            tailOffsets : tailOffsets
        };
    },

    /**
     * Вычисляет фактор попадания объекта в окно
     * @param {Object} pos параметры объекта
     * @param {Object} d метрики
     * @returns {Number} фактор попадания (0 - полностью попадает, далее чем больше, тем хуже)
     */
    calcInWindowFactor: function(pos, d) {

        var res = 0;

        d.windowTop > pos.top && (res += d.windowTop - pos.top);
        pos.top + d.underHeight > d.windowBottom && (res += pos.top + d.underHeight - d.windowBottom);
        d.windowLeft > pos.left && (res += d.windowLeft - pos.left);
        pos.left + d.underWidth > d.windowRight && (res += pos.left + d.underWidth - d.windowRight);

        return res;

    },

    getDefaultParams : function() {

        return {
            tailOffset: 19,
            tailWidthHorizontal: 9,
            tailWidthVertical: 19,
            tailHeightHorizontal: 19,
            tailHeightVertical: 10,
            shadowSize: 7,
            directions : ALLOWED_DIRECTIONS
        };

    },

    destruct : function() {

        var under = this._under;
        if(!under) {
            this.__base.apply(this, arguments);
        }
        else if(!this._destructing) {
            this._destructing = true;
            this.hide();
            BEM.DOM.destruct(false, under.domElem);
            this.__base(true);
        }

    },

    /**
     * Возвращает подложку
     * @private
     * @returns {BEM.DOM.blocks['i-popup']}
     */
    _getUnder : function() {

        if(!this._under) {
            var under = $(BEM.HTML.build({
                block : 'i-popup',
                zIndex : this.params.zIndex,
                mods : {
                    autoclosable : this.getMod('autoclosable') || 'yes',
                    fixed : this.hasMod('direction', 'fixed') && 'yes'
                },
                underMods : this.params.underMods,
                underMix : [{ block : 'b-popupa', elem : 'under' }]
            }));

            (this._under = this.findBlockOn(under, 'i-popup'))
                .on(
                    {
                        'show'          : this._onUnderShowed,
                        'hide'          : this._onUnderHidden,
                        'outside-click' : this._onUnderOutsideClicked
                    },
                    this)
                .elem('content').append(this.domElem);

        }

        return this._under;

    },

    _onUnderShowed : function() {

        this._isShowed = true;

        this
            .bindToWin('resize', this.pos)
            ._isOwnerNode() &&
                this.bindToDomElem(
                    this._owner.parents().add(this.__self.win),
                    'scroll',
                    this.pos);

        this.trigger('show');

    },

    _onUnderHidden : function() {

        this._isShowed = false;

        this
            .unbindFromWin('resize')
            ._isOwnerNode() &&
                this.unbindFromDomElem(
                    this._owner.parents().add(this.__self.win),
                    'scroll');

        this.trigger('hide');
    },

    _onUnderOutsideClicked : function() {

        this.trigger.apply(this, arguments);

    }

}, /** @lends block */ {

    live : function() {

        this.liveBindTo('close', 'leftclick', function() {
            this.hide();
        });

    }

});

BEM.HTML.decl('b-popupa', {

    onBlock : function(ctx) {

        var hasClose = false;
        $.each(ctx.param('content'), function(i, item) {
            return !(hasClose = item.elem == 'close');
        });
        ctx
            .mods({ theme : 'ffffff', direction : 'down', 'has-close' : hasClose && 'yes' })
            .js(true)
            .afterContent({ elem : 'shadow' });

    },

    onElem : {

        'content' : function(ctx) {

            ctx
                .wrap({ elem : 'wrap-cell', tag : 'td' })
                .wrap({ tag : 'tr' })
                .wrap({ elem : 'wrap', tag : 'table' });

        },

        'close' : function(ctx) {

            ctx.tag('i');

        },

        'shadow' : function(ctx) {

            ctx.tag('i');

        },

        'tail' : function(ctx) {

            ctx
                .tag('i')
                .wrapContent({ elem : 'tail-i', tag : 'i' });

        }

    }

});

})(jQuery);

/* ../../libs/romochka/blocks-desktop/b-popupa/b-popupa.js end */
;
/* ../../libs/romochka/blocks-desktop/i-popup/i-popup.js begin */
(function($) {

/**
 * Шаблон для подложки
 * @private
 * @type jQuery
 */
var template,

/**
 * Пул подложек
 * @private
 * @type Array
 */
    underPool = [],

    browser = $.browser;

/**
 * Достает подложку из пула, при необходимости создает новую
 * @private
 * @returns jQuery
 */
function getUnder() {

    return underPool.length?
        underPool.shift() :
        template?
            template.clone() :
            template = createUnder();

}

/**
 * Возвращает подложку в пул
 * @private
 * @param {jQuery} under
 */
function putUnder(under) {

    underPool.push(under);

}

/**
 * Создает подложку
 * @private
 * @returns {jQuery}
 */
function createUnder() {

    // TODO пока только для мобильного сафари отдаем div, нужно сделать более умно для тех браузеров, которым достаточно div
    return $((browser.safari || browser.webkit) && navigator.userAgent.toLowerCase().indexOf('mobile') > -1?
        '<div/>' :
        '<iframe' + (browser.msie && browser.version < 9? ' frameborder="0"' : '') + '/>');

}

BEM.DOM.decl('i-popup', {

    onSetMod : {

        'js': function() {

            var bro = $.browser;

            // LEGO-8464
            if(bro.msie && parseInt(bro.version) >= 9) {
                this.domElem[0].onresize = function() {
                    this.className += '';
                }
            }
        },

        'visibility' : {

            'visible' : function() {

                var under = this._getUnder(),
                    underParent = under.parent();

                this.hasMod(under, 'type', 'paranja')?
                    underParent.is('body') || under.appendTo('body') :
                    (underParent[0] !== this.domElem[0]) && under.prependTo(this.domElem);

                this._inBody || (this._inBody = !!this.domElem.appendTo('body'));

                this.trigger('show');

            },

            '' : function() {

                var under = this._getUnder();

                this.hasMod(under, 'type', 'paranja') && under.remove();
                this._putUnder();
                this.trigger('hide');

            }

        }

    },

    /**
     * Получает элемент подложки
     * @private
     * @returns {jQuery}
     */
    _getUnder : function() {

        return this._under ||
            (this._under = getUnder().attr(
                'class',
                this._underClass || (this._underClass = this.findElem('under').remove().attr('class'))));

    },

    /**
     * Возвращает элемент подложки
     * @private
     */
    _putUnder : function() {

        putUnder(this._under);
        delete this._under;

    },

    /**
     * Открывает попап
     * @param {Object} css объект css-свойств, описывающих положение попапа
     * @returns {BEM.DOM}
     */
    show : function(css) {

        css && this.domElem.css(css);
        return this.setMod('visibility', 'visible');

    },

    /**
     * Закрывает попап
     * @returns {BEM.DOM}
     */
    hide : function() {

        return this.delMod('animate').delMod('visibility');

    }

}, {

    live : true

});

})(jQuery);

BEM.HTML.decl('i-popup', {

    onBlock : function(ctx) {

        ctx
            .mod('autoclosable', 'yes')
            .js(true)
            .wrapContent({ elem : 'content' })
            .afterContent({
                elem : 'under',
                mods : ctx.param('underMods'),
                mix : ctx.param('underMix')})
            .param('zIndex') &&
                ctx.attr('style', 'z-index:' + (32700 + ctx.param('zIndex')));


    }

});
/* ../../libs/romochka/blocks-desktop/i-popup/i-popup.js end */
;
/* ../../libs/romochka/blocks-desktop/i-popup/_autoclosable/i-popup_autoclosable_yes.js begin */
(function($) {

var KEYDOWN_EVENT = ($.browser.opera && $.browser.version < 12.10) ? 'keypress' : 'keydown';

BEM.DOM.decl({ name : 'i-popup', modName : 'autoclosable', modVal : 'yes' }, {

    onSetMod : {

        'visibility' : {

            'visible' : function() {

                this.afterCurrentEvent(function() {
                    // Из-за асинхронности, модификатор уже может быть снят
                    // в этот момент, поэтому нужно его еще раз
                    // проверить, чтобы не оказалось "повисших" подписок.
                    if (this.hasMod('visibility', 'visible')) {

                        var under = this._under;

                        this.bindToDoc('leftclick', function(e) {
                                this.containsDomElem($(e.target)) || this._onOutClick(e);
                            })
                            .bindToDoc(KEYDOWN_EVENT, function(e) {
                                // на Escape закрываем
                                e.keyCode == 27 && this.hide();
                            });

                        if (under && under.is('iframe') && this.hasMod(under, 'type', 'paranja')) {

                            // NOTE Предусматривать отвязку не нужно, т.к. после
                            //      вызова метода hide сам элемент (паранжа) удаляется.
                            // NOTE У пустого iframe:
                            //      IE7-8 ловят клик на contentWindow.document
                            //      Другие браузеры ловят только на contentWindow.
                            this.bindToDomElem(
                                $([under[0].contentWindow, under[0].contentWindow.document]),
                                'leftclick',
                                this._onOutClick
                            );
                        }
                    }
                });
                this.__base.apply(this, arguments);

            },

            '' : function() {

                return this
                    .unbindFromDoc('leftclick ' + KEYDOWN_EVENT)
                    .__base.apply(this, arguments);

            }

        }

    },

    _onOutClick : function(domEvent) {

        var e = $.Event('outside-click');
        this.trigger(e, { domEvent : domEvent });
        e.isDefaultPrevented() || this.hide();

    }

});
})(jQuery);

/* ../../libs/romochka/blocks-desktop/i-popup/_autoclosable/i-popup_autoclosable_yes.js end */
;
/* ../../libs/romochka/blocks-desktop/b-dropdowna/switcher/b-dropdowna__switcher.js begin */
BEM.HTML.decl('b-dropdowna', {

    onElem: {

        'switcher': function (ctx) {
            ctx.tag('span');
        }

    }

});

/* ../../libs/romochka/blocks-desktop/b-dropdowna/switcher/b-dropdowna__switcher.js end */
;
/* ../../libs/romochka/blocks-desktop/b-lang-switcher/b-lang-switcher.js begin */
BEM.DOM.decl('b-lang-switcher', {

    onSetMod : {

        'js' : function() {
                
            this.elem('flag').each(function(i, el) {
                new Image().src = $(el).css('backgroundImage').match(/url\(["']?([^'")]+)["']?\)/)[1];
            });
        }

    }
});
/* ../../libs/romochka/blocks-desktop/b-lang-switcher/b-lang-switcher.js end */
;
/* ../../desktop.blocks/b-lang-switcher/b-lang-switcher.js begin */
BEM.DOM.decl('b-lang-switcher', {

    onSetMod : {

        'js' : function() {
            console && console.log('Block inited');
        }

    }

}, {

    live: function() {

        this.liveInitOnBlockEvent('init', 'b-dropdowna');

    }

})

/* ../../desktop.blocks/b-lang-switcher/b-lang-switcher.js end */
;
/* ../../libs/romochka/blocks-desktop/b-icon/b-icon.js begin */
BEM.HTML.decl('b-icon', {

    onBlock : function(ctx) {

        var a = { src: '//yandex.st/lego/_/La6qi18Z8LwgnZdsAr1qy1GwCwo.gif', alt: '' },
            params = ctx.params(),
            props = ['alt', 'width', 'height'], p;

        params.url && (a.src = params.url);
        while(p = props.shift()) params[p] && (a[p] = params[p]);

        ctx
           .tag('img')
           .attrs(a);

    }

});

/* ../../libs/romochka/blocks-desktop/b-icon/b-icon.js end */
;
/* ../../libs/romochka/blocks-desktop/b-menu/_is-bem/b-menu_is-bem_yes.js begin */
BEM.DOM.decl('b-menu', {

    onElemSetMod : {

        'trigger' : {

            'state' : function(elem, modName, modVal) {

                this
                    .toggleMod(
                        this.findElem(elem.closest(this.buildSelector('layout-vert-cell')), 'item-content').eq(0),
                        'visibility',
                        'visible',
                        modVal == 'opened')
                    .trigger('trigger', {
                        domElem : elem,
                        state : modVal
                    });

            }

        },

        'item' : {

            'state' : {

                'current' : function(elem) {

                    var _this = this,
                        blockName = _this.__self.getName(),
                        prev = _this.elem('item', 'state', 'current').filter(function() {
                                return $(this).closest(_this.buildSelector()).bem(blockName) === _this;
                            });

                    // открываем все триггеры более верхнего уровня
                    _this.findElem(
                        elem
                            .parents(_this.buildSelector('item-content'))
                            .prev(_this.buildSelector('item')), 'trigger')
                                .each(function() {
                                    _this.setMod($(this), 'state', 'opened');
                                });

                    _this
                        .delMod(prev, 'state')
                        .trigger('current', {
                            prev    : prev,
                            current : elem
                        });

                }

            }

        }

    },

    onTriggerClick : function(e) {

        e.preventDefault();
        this.toggleMod(e.data.domElem, 'state', 'opened');

    },

    onItemSelectorClick : function(e) {

        var item = this._getItemByEvent(e);
        this.hasMod(item, 'state', 'disabled') || this.setMod(item, 'state', 'current');

    },

    _getItemByEvent : function(e) {
        return e.data.domElem.closest(this.buildSelector('item'));
    }

}, {

    live : function() {

        this
            .liveBindTo('trigger', 'leftclick', function(e) {
                this.onTriggerClick(e);
            })
            .liveBindTo('item-selector', 'leftclick', function(e) {
                this.onItemSelectorClick(e);
            });

    }

});
/* ../../libs/romochka/blocks-desktop/b-menu/_is-bem/b-menu_is-bem_yes.js end */
;


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
