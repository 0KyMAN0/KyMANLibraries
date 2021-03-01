KyMANLibraries.HtmlPreloader = function(input, callback){

    var self = this,
        default_settings = {
            refresh_per_second : 24,
            autostart : true,
            timeout : 2000,
            origin : document
        },
        thread = null,
        date = null,
        selector = null,
        origin = null;

    var settings = function(name){
        return input[name] !== undefined ? input[name] : default_settings[name];
    };

    var construct = function(){

        if(typeof input == "function"){

            var temporary = callback;

            callback = input;
            input = temporary;

        };

        if(input.substr)
            input = {selector : input};

        if(typeof callback != "function")
            callback = settings("callback");
        selector = settings("selector");
        origin = settings("origin") || document;

        if(settings("autostart"))
            self.start();

    };

    var preloader = function(){

        var item = origin.querySelector(selector);

        if(item){
            clearInterval(thread);
            callback(item, true);
        }else if(Date.now() - date > settings("timeout")){
            clearInterval(thread);
            callback(null, true);
        };

    };

    this.start = function(){

        // Synchronous.
        if(typeof callback != "function"){
            console.error("Callback needs to be a function.");
            return;
        };
        if(!selector){
            callback(null, false);
            return;
        };
        if(!selector.substr){
            callback(selector);
            return;
        };

        try{origin.querySelector(selector);}catch(exception){
            callback(null, false);
            return;
        };
        // Synchronous.

        if(thread !== null, false)
            return;

        // Asynchronous.
        date = Date.now();
        thread = setInterval(preloader, 1000 / settings("refresh_per_second"));
        // Asynchronous.

    };

    this.stop = function(){

        if(thread === null)
            return;

        clearInterval(thread);
        thread = null;

    };

    this.abort = function(){

        self.stop();

    };

    this.retry = function(){

        self.stop();
        self.start();

    };

    construct();

};
