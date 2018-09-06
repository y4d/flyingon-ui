flyingon.Control.extend('Button', function (base) {
   
    
    
    //图标
    this.defineProperty('icon', '', {

        set: this.render    
    });


    //图标大小
    this['icon-size'] = this.defineProperty('iconSize', 16, {

        set: this.render    
    });


    //图标和文字是否竖排
    this.defineProperty('vertical', false, {

        set: this.render    
    });


    //文本内容
    this.defineProperty('text', '', {

        set: this.__render_text    
    });
    
    
    //文本内容是否html格式
    this.defineProperty('html', false, {

        set: this.__render_text   
    });


    //是否显示下拉箭头
    this.defineProperty('dropdown', false, {

        set: this.render    
    });


    //下拉菜单
    this.defineProperty('menu', null, {

        set: function (name, value, oldValue) {

            if (this.__menu = value)
            {
                if (!oldValue)
                {
                    this.on('click', show_menu);
                }
            }
            else if (oldValue)
            {
                this.off('click', show_menu);
            }
        }
    });


    function show_menu(e) {

        var Class = flyingon.Menu,
            menu = this.__menu;

        if (typeof menu === 'string')
        {
            menu = Class.all[menu];
        }

        if (menu instanceof Class)
        {
            menu.show(this);
        }
    };


    //显示下拉菜单
    this.showMenu = show_menu;

        
    //测量自动大小
    this.onmeasure = function () {
        
        var autoWidth = this.__auto_width,
            autoHeight = this.__auto_height;

        if (autoWidth || autoHeight)
        {
            this.renderer.__measure_auto(this, autoWidth, autoHeight);
        }
        else
        {
            return false;
        }
    };
       


}).register();