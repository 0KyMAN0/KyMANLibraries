KyMANLibraries.HtmlPreloader = function(input, callback){

    const self = this,
          default_settings = {
              refresh_per_second : 24,
              autostart : true,
              timeout : 2000,
              origin : document
          };
    let thread = null,
        date = null,
        selector = null,
        origin = null;

    const settings = name => input[name] !== undefined ? input[name] : default_settings[name];

    const construct = () => {

        if(typeof input == "function")
            [input, callback] = [callback, input];

        if(!input)
            input = {};
        else if(input.substr)
            input = {selector : input};

        if(typeof callback != "function")
            callback = settings("callback");
        selector = settings("selector");
        origin = settings("origin") || document;

        if(settings("autostart"))
            self.start();

    };

    const preloader = () => {

        const item = origin.querySelector(selector);

        if(item){
            clearInterval(thread);
            callback(item, true);
        }else if(Date.now() - date > settings("timeout")){
            clearInterval(thread);
            callback(null, true);
        };

    };

    this.start = () => {

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

    this.stop = () => {

        if(thread === null)
            return;

        clearInterval(thread);
        thread = null;

    };

    this.abort = () => {

        self.stop();

    };

    this.retry = () => {

        self.stop();
        self.start();

    };

    construct();

};
