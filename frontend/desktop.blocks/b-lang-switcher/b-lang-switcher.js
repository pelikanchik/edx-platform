BEM.DOM.decl('b-lang-switcher', {

    onSetMod : {

        'js' : function() {
            //console && console.log('Block inited');
        }

    }

}, {

    live: function() {

        this.liveInitOnBlockEvent('init', 'b-dropdowna');

    }

})
