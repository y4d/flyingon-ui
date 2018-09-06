(function (flyingon) {



    var http = flyingon.http = Object.create(null);

    var enctype = 'application/x-www-form-urlencoded';

    var before = null;

    var after = null;


    
    
    function encodeData(data) {

        if (!data)
        {
            return '';
        }

        var list = [],
            encode = encodeURIComponent,
            value,
            any;

        for (var name in data)
        {
            value = data[name];
            name = encode(name);

            if (value === null)
            {
                list.push(name, '=null', '&');
                continue;
            }

            switch (typeof value)
            {
                case 'undefined':
                    list.push(name, '=&');
                    break;

                case 'boolean':
                case 'number':
                    list.push(name, '=', value, '&');
                    break;

                case 'string':
                case 'function':
                    list.push(name, '=', encode(value), '&');
                    break;

                default:
                    if (value instanceof Array)
                    {
                        for (var i = 0, l = value.length; i < l; i++)
                        {
                            if ((any = value[i]) === void 0)
                            {
                                list.push(name, '=&');
                            }
                            else
                            {
                                list.push(name, '=', encode(any), '&'); //数组不支持嵌套
                            }
                        }
                    }
                    else
                    {
                        list.push(name, '=', encodeData(value), '&');
                    }
                    break;
            }
        }

        list.pop();

        return list.join('');
    }


    
    function send(method, url, data, options) {

        var stream = new flyingon.Stream(),
            ajax = stream.ajax = new XMLHttpRequest(),
            type,
            any;

        options = options || {};
        options.method = method;
        options.url = url;
        options.data = data;

        // 执行发送前全局start事件
        if (any = before)
        {
            for (var i = 0, l = any.length; i < l; i++)
            {
                if (any[i](ajax, options) === false)
                {
                    return false;
                }
            }
            
            url = options.url;
            data = options.data;
        }

        if (/get|head|options/i.test(method))
        {
            if (data)
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
        }
        else if ((type = options.dataType) === enctype)
        {
            data = encodeData(data);
        }
        
        // CORS
        if (options.CORS)
        {
            // withCredentials是XMLHTTPRequest2中独有的
            if ('withCredentials' in ajax)
            {
                ajax.withCredentials = true;
            }
            else if (any = window.XDomainRequest)
            {
                ajax = new any();
            }
        }

        ajax.onreadystatechange = function () {

            var any;

            if (this.readyState === 4)
            {
                if (this.status < 300)
                {
                    stream.resolve(this.responseText || this.responseXML);
                }
                else
                {
                    stream.reject(this.statusText);
                }
                
                // 结束处理
                if (any = after)
                {
                    for (var i = 0, l = any.length; i < l; i++)
                    {
                        any[i](this, options);
                    }
                }
                
                // 清除引用
                this.onreadystatechange = null;
            }
        }

        ajax.open(method, url, options.async !== false);
        
        if (type)
        {
            ajax.setRequestHeader('Content-Type', type);
            // ajax.setRequestHeader('Content-Length', data.length);
        }

        if (any = options.header)
        {
            for (var name in any)
            {
                ajax.setRequestHeader(name, any[name]);
            }
        }

        ajax.send(data);

        return stream;
    }

    

    // 自定义ajax开始提交方法
    http.before = function (fn) {

        (before || (before = [])).push(fn);
    }


    // 自定义ajax执行结束方法
    http.after = function (fn) {

        (after || (after = [])).push(fn);
    }



    http.send = function (method, url, data, options) {

        return send(method || 'GET', url, data, options);
    }


    http.head = function (url, data, options) {

        return send('HEAD', url, data, options);
    }


    http.get = function (url, data, options) {

        return send('GET', url, data, options);
    }


    http.post = function (url, data, options) {

        return send('POST', url, data, options);
    }


    http.put = function (url, data, options) {

        return send('PUT', url, data, options);
    }
    

    http.delete = function (url, data, options) {

        return send('DELETE', url, data, options);
    }



})(flyingon);
