Object.extend('TreeNode', function () {



    //扩展可视组件功能
    flyingon.fragment('f-visual', this);



    //标记是树节点
    this.isTreeNode = true;


    //是否展开
    this.expanded = false;


    //选中的子项数量
    this.checkedChildren = 0;
    


    //节点图标
    this.defineProperty('icon', '', {

        set: this.render   
    });


    //节点文本
    this.defineProperty('text', '', {

        set: this.render   
    });


    //是否选中
    this.defineProperty('checked', false, {
        
        set: function (name, value) {

            var parent = this.parent;

            while (parent && parent.isTreeNode)
            {
                if (!(value ? parent.checkedChildren++ : --parent.checkedChildren) && 
                    parent.view && !parent.checked())
                {
                    parent.renderer.patch(parent, name, false);
                }

                parent = parent.parent;
            }

            this.view && this.renderer.patch(this, name, value);
            this.trigger('checked-change', 'value', value);
        }
    });



    //是否启用延时加载
    this.defineProperty('delay', false);



    //扩展容器功能
    flyingon.fragment('f-container', this, null, flyingon.TreeNode);


    //创建子控件
    this.__create_child = function (options, Class) {

        var node = new Class(),
            storage = node.__storage || (node.__storage = flyingon.create(node.__defaults));

        for (var name in options)
        {
            switch (name)
            {
                case 'text':
                case 'icon':
                    storage[name] = '' + options[name];
                    break;

                case 'checked':
                    storage[name] = !!options[name];
                    break;

                case 'expanded':
                    if (options[name])
                    {
                        node.expanded = true;
                    }
                    break;

                case 'children':
                case 'items':
                    node.push.apply(node, options[name]);
                    break;

                default:
                    storage[name] = options[name];
                    break;
            }
        }

        return node;
    };


    //获取节点级别
    this.level = function () {

        var target = this.parent,
            index = 0;

        while (target && target.isTreeNode)
        {
            index++;
            target = target.parent;
        }

        return index;
    };



}).register();




flyingon.Control.extend('Tree', function (base) {



    this.defaultWidth = 200;
    
    this.defaultHeight = 300;

        
    this.defaultValue('border', 1);
    

    this.defaultValue('padding', 2);



    //树风格
    //default   默认风格
    //blue      蓝色风格
    //plus      加减风格
    this.defineProperty('theme', 'default', {

        set: this.render   
    });



    //是否显示检查框
    this.defineProperty('checked', false, {

        set: this.render   
    });


    //是否显示图标
    this.defineProperty('icon', true, {

        set: this.render   
    });


    //是否可编辑
    this.defineProperty('editable', false);



    //格式化函数
    this.format = null;



    //扩展容器功能
    flyingon.fragment('f-container', this, base, flyingon.TreeNode.init());


    this.__create_child = flyingon.TreeNode.prototype.__create_child;



    this.load = function (array, idKey, parentIdKey, primaryValue) {

        var keys = Object.create(null),
            list = [0, this.length],
            index = 0,
            item,
            cache,
            any;
    
        idKey = idKey || 'id';
        parentIdKey = parentIdKey || 'parentId';
        primaryValue = primaryValue || 0;
    
        while (item = array[index++])
        {
            keys[item[idKey]] = item;
        }
    
        index = 0;
    
        while (item = array[index++])
        {
            any = item[parentIdKey];
    
            if (cache = keys[any])
            {
                if (any = cache.children)
                {
                    any.push(item);
                }
                else
                {
                    cache.children = [item];
                }
            }
            else
            {
                list.push(item);
            }
        }
    
        this.splice.apply(this, list);
    }
    
    

    //展开节点
    this.expand = function (node) {

        if (node)
        {
            this.__expand_node(node);
        }
        else
        {
            for (var i = 0, l = this.length; i < l; i++)
            {
                this.__expand_node(this[i]);
            }
        }

        return this;
    };


    this.__expand_node = function (node) {

        if (!node.expanded && this.trigger('expand', 'node', node) !== false)
        {
            node.expanded = true;
            node.view && node.renderer.patch(node, 'expand');
        }
    };


    //展开节点至指定级别
    this.expandTo = function (node, level) {

        if (arguments.length < 2)
        {
            level = node;
            node = null;
        }

        this.__expand_to(node || this, level | 0);
        return this;
    };


    this.__expand_to = function (nodes, level) {

        level--;

        for (var i = nodes.length - 1; i >= 0; i--)
        {
            var node = nodes[i];

            if (!node.expanded)
            {
                if (this.trigger('expand', 'node', node) === false)
                {
                    continue;
                }

                node.expanded = true;
                node.view && node.renderer.patch(node, 'expand');
            }

            if (node.length > 0)
            {
                if (level)
                {
                    this.__expand_to(node, level);
                }
                else
                {
                    //收拢最后一级
                    for (var j = node.length - 1; j >= 0; j--)
                    {
                        var item = node[j];

                        if (item.expanded && this.trigger('collapse', 'node', node) !== false)
                        {
                            item.expanded = false;
                            item.view && item.renderer.patch(item, 'collapse');
                        }
                    }
                }
            }
        }
    };


    //收拢节点
    this.collapse = function (node) {

        if (node)
        {
            this.__collapse_node(node);
        }
        else
        {
            for (var i = 0, l = this.length; i < l; i++)
            {
                this.__collapse_node(this[i]);
            }
        }

        return this;
    };


    //收拢节点
    this.__collapse_node = function (node) {

        if (node.expanded && node.length > 0 && this.trigger('collapse', 'node', node) !== false)
        {
            node.expanded = false;
            node.view && node.renderer.patch(node, 'collapse');
        }
    };



    this.beginEdit = function () {

    };


    this.endEdit = function () {

    };



    this.findNode = function (name, value) {

        if (name)
        {
            if (typeof name === 'function')
            {
                return find_node1(this, name);
            }
            
            return find_node2(this, name, value);
        }
    };


    function find_node1(nodes, fn) {

        for (var i = 0, l = nodes.length; i < l; i++)
        {
            var node = nodes[i];

            if (fn(node))
            {
                return node;
            }

            if (node.length > 0 && (node = find_node1(node, fn)))
            {
                return node;
            }
        }
    };


    function find_node2(nodes, name, value) {

        for (var i = 0, l = nodes.length; i < l; i++)
        {
            var node = nodes[i];

            if ((node.__storage || node.__defaults)[name] === value)
            {
                return node;
            }

            if (node.length > 0 && (node = find_node2(node, fn)))
            {
                return node;
            }
        }
    };



    this.current = function (node, expand) {

        var last = this.__current,
            any;

        if (node === void 0)
        {
            return last;
        }
        
        if (last !== node)
        {
            last && (last.__current = false);
            
            if (this.__current = node)
            {
                node.__current = true;

                if (expand)
                {
                    any = node;

                    while (any)
                    {
                        if (any.isTreeNode)
                        {
                            any.expanded = true;
                            any = any.parent;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }

        if (this.view)
        {
            if (last && last.view)
            {
                last.renderer.current(last, false);
            }

            if (node && node.view)
            {
                node.renderer.current(node, true);

                if (expand)
                {
                    any = node;

                    while (any)
                    {
                        if (any.isTreeNode)
                        {
                            any.renderer.patch(any, 'expand');
                            any = any.parent;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }
    };


    this.scrollTo = function (node) {

        this.view && this.renderer.scrollTo(this, node);
    };


    this.dispose = function () {

        for (var i = this.length - 1; i >= 0; i--)
        {
            this[i].dispose(false);
        }

        base.dispose.apply(this, arguments);
        return this;
    };



}).register();