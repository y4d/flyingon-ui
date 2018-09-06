flyingon.Stream = Object.extend(function () {


    var Class = this.Class;


    Class.fromPromise = function (promise) {

        var instance = new Class();

        if (typeof promise === 'function')
        {
            promise = promise();
        }

        promise
            .then(function (value) {

                instance.resolve(value);
            })
            .catch(function (error) {

                instance.reject(error);
            });

        return instance;
    }


    Class.fromEvent = function (dom, type, capture) {

        var instance = new Class();

        dom.addEventListener(type, function (event) {

            instance.resolve(event);

        }, capture || false);

        return instance;
    }


    Class.interval = function (period) {

        var instance = new Class();
        var value = 0;

        function interval() {

            setTimeout(function () {

                instance.resolve(value++);
                interval();

            }, period | 0);
        }

        interval();

        return instance;
    }



    this.init = function (value) {

        if (arguments.length > 0)
        {
            if (typeof value === 'function')
            {
                value(this);
            }
            else
            {
                this.__cache = [value];
            }
        }
    }



    this.registry = function (fn) {

        var next = (this.__next = new Class());
        var cache = this.__cache;

        this.__fn = fn;

        if (cache)
        {
            while (cache.length > 0)
            {
                try
                {
                    fn.call(this, next, cache.shift());
                }
                catch (e)
                {
                    this.reject(e);
                }
            }

            this.__cache = null;
        }

        return next;
    }



    this.resolve = function (value) {

        var any;

        if (any = this.__next)
        {
            try
            {
                this.__fn(any, value);
            }
            catch (e)
            {
                this.reject(e);
            }
        }
        else if (any = this.__cache)
        {
            any.push(value);
        }
        else
        {
            this.__cache = [value];
        }
    }


    this.reject = function (error) {

        var target = this,
            fn;

        do
        {
            if ((fn = target.__error))
            {
                try
                {
                    fn(error);
                }
                catch (e)
                {
                    error = e;
                }
            }
        }
        while ((target = target.__next));
    }


    this.then = function (fn) {

        return this.registry(function (next, value) {

            fn(value);
            next.resolve(value);
        });
    }


    this.map = function (fn) {

        return this.registry(function (next, value) {

            next.resolve(fn(value));
        });
    }


    this.catch = function (fault) {

        this.__error = fault;
        return (this.__next = new Class());
    }


    this.wait = function (time) {

        var cache = [];
        var timeout;

        return this.registry(function (next, value) {

            if (timeout)
            {
                cache.push(value);
            }
            else
            {
                timeout = setTimeout(function () {

                    next.resolve(cache);
                    timeout = 0;
                    cache = [];

                }, time | 0);
            }
        });
    }


    this.delay = function (time) {

        return this.registry(function (next, value) {

            setTimeout(function () {

                next.resolve(value);

            }, time | 0);
        });
    }


    this.debounce = function (time) {

        var timeout;

        return this.registry(function (next, value) {

            if (timeout)
            {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {

                next.resolve(value);
                timeout = 0;

            }, time | 0);
        });
    }


    this.throttle = function (time) {

        var timeout;

        return this.registry(function (next, value) {

            if (!timeout)
            {
                next.resolve(value);

                timeout = setTimeout(function () {

                    timeout = 0;

                }, time | 0);
            }
        });
    }

    
});
