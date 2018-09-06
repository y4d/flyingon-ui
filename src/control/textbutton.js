flyingon.Control.extend('TextButton', function (base) {



    //弹出层控件
    var cache;

    //渲染button及buttonSize的方法
    var render = this.__render_fn('button');


    //类型
    this.__type = '';



    flyingon.fragment('f-TextBox', this);



    //是否可输入
    this.defineProperty('inputable', false, { 
        
        set: this.render
    });


    //按钮图标
    this.defineProperty('icon', '', {
        
        set: this.render
    });


    //按钮显示模式
    //show      总是显示
    //none      不显示
    //hover     鼠标划过时显示
    this.defineProperty('button', 'show', {
        
        set: render
    });


    //按钮大小
    this['button-size'] = this.defineProperty('buttonSize', 20, {
        
        set: render
    });



    //无值时提醒信息
    this.defineProperty('placeholder', '', {

        set: this.__render_value
    });


    //值
    this.defineProperty('value', '', {
        
        dataType: 'object',
        set: this.__render_value
    });



    //设置下拉列表
    this.__set_data = function (list) {

        this.__data_list = list;
        this.renderer.patch(this, 'value');
    };



    //获取显示文本
    this.text = function (value) {

        if (value === void 0)
        {
            return '' + (this.__storage || this.__defaults).value;
        }

        this.value(value);
    };


    this.__list_text = function (value) {

        if (value === void 0)
        {
            var list = this.__data_list;

            if (list)
            {
                var storage = this.__storage || this.__defaults;
                return list.text(storage.value, this.__multi(storage) ? storage.separator || ',' : '');
            }

            return '';
        }

        this.value(value);
    };


    this.__multi = function (storage) {

        return false;
    };



    this.__to_value = function (text) {

        return text;
    };


    this.__on_click = function () {

        this.trigger('button-click');
    };


    this.__get_popup = function () {

        var popup = cache;

        if (popup)
        {
            popup.close('auto');
        }
        else
        {
            popup = cache = new flyingon.Popup();

            popup.autoDispose = false;

            popup.on('closed', function () {

                this.detach(0);
            });

            popup.width('auto').height('auto');
        }

        return popup;
    };



}).register();