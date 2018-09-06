flyingon.renderer('Tree', function (base) {



    this.__scroll_html = '';



    this.render = function (writer, control, render) {

        var storage = control.__storage || control.__defaults,
            any = ' f-tree-theme-' + storage.theme;
        
        writer.push('<div');
        
        if (!storage.checked)
        {
            any += ' f-tree-no-check';
        }

        if (!storage.icon)
        {
            any += ' f-tree-no-icon'
        }

        control.defaultClass += any;

        render.call(this, writer, control);
        
        writer.push(' onclick="flyingon.Tree.onclick.call(this, event)">');

        if (control.__visible)
        {
            control.__content_render = true;

            if ((any = control.length) > 0)
            {
                this.__render_children(writer, control, control, 0, any);
            }
        }

        //滚动位置控制(解决有右或底边距时拖不到底的问题)
        writer.push('</div>');
    };



    this.__render_children = function (writer, control, items, start, end) {

        var line = (control.__storage || control.__defaults).theme === 'line',
            format = control.format,
            last = control[control.length - 1],
            item;

        while (start < end)
        {
            if (item = items[start++])
            {
                item.view || item.renderer.render(writer, item, format, 0, item === last, line);
            }
        }
    };



    flyingon.Tree.onclick = function (e) {

        var tree = flyingon.findControl(this),
            dom = e.target || e.srcElement,
            node = flyingon.findControl(dom);

        while (dom && dom !== this)
        {
            switch (dom.getAttribute('tag'))
            {
                case 'folder':
                    tree[node.expanded ? 'collapse' : 'expand'](node);
                    return;

                case 'check':
                    node.checked(!node.checked());
                    return;

                case 'node':
                    tree.trigger('node-click', 'node', node);
                    tree.current(node, false);
                    return;

                default:
                    dom = dom.parentNode;
                    break;
            }
        }
    };



    this.mount = function (control, view) {

        var node = control.__current;

        base.mount.call(this, control, view);

        if (control.__content_render)
        {
            this.__mount_children(control, view, control, 0, control.length, view.firstChild);
        }

        node && node.view && setTimeout(function () {

            control.renderer.scrollTo(control, node);
            
        }, 500);
    };
    

    this.theme = function (control, view, value) {

        view.className = view.className.replace(/f-tree-theme-\w+/, 'f-tree-theme-' + value);
    };


    this.checked = function (control, view, value) {

        var name = view.className;

        if (value)
        {
            name = name.replace(' f-tree-no-check', '');
        }
        else
        {
            name += ' f-tree-no-check';
        }

        view.className = name;
    };


    this.icon = function (control, view, value) {

        var name = view.className;

        if (value)
        {
            name = name.replace(' f-tree-no-icon', '');
        }
        else
        {
            name += ' f-tree-no-icon';
        }

        view.className = name;
    };


    this.scrollTo = function (control, node) {

        var view = control.view,
            dom = node.view,
            y = view.scrollTop,
            top = dom.offsetTop,
            height;

        if (top < y)
        {
            view.scrollTop = top;
        }
        else if (top > y + (height = view.clientHeight))
        {
            view.scrollTop = top + dom.offsetHeight - height;
        }
    };


});



flyingon.renderer('TreeNode', function (base) {



    this.render = function (writer, node, format, level, last, line, space) {

        var encode = flyingon.html_encode,
            storage = node.__storage || node.__defaults,
            icon,
            text,
            any;

        text = node.defaultClass;

        if (any = node.__className)
        {
            text += encode(any);
        }

        writer.push('<div class="', text, '">',
            '<div class="f-tree-node', 
                last && line ? ' f-tree-node-last' : '',
                node.__current ? ' f-tree-node-current': '',
                (any = storage.className) ? ' ' + encode(any) : '',
            (any = storage.id) ? '" id="' + encode(any) + '"' : '', '" tag="node">');

        if (space)
        {
            writer.push(space);
        }

        if (any = storage.delay)
        {
            storage.delay = false;
        }
        
        if (any || node.length > 0)
        {
            if (any || !node.expanded)
            {
                icon = 'f-tree-icon-close';
                writer.push('<span class="f-tree-folder f-tree-close" tag="folder"></span>');
            }
            else
            {
                icon = 'f-tree-icon-open';
                writer.push('<span class="f-tree-folder f-tree-open" tag="folder"></span>');
            }
        }
        else
        {
            icon = 'f-tree-icon-file';
            writer.push('<span class="f-tree-file"></span>');
        }

        text = (text = storage.text) ? encode(text) : '';

        if (format)
        {
            text = format(node, text);
        }

        writer.push('<span class="f-tree-check f-tree-', storage.checked ? 'checked' : 'unchecked', '" tag="check"></span>',
            '<span class="f-tree-icon ', storage.icon || icon, '" tag="icon"></span>',
            '<span class="f-tree-text" tag="text">', text, '</span></div>',
            '<div class="f-tree-list', last && line ? ' f-tree-list-last' : '', '">');

        if (node.expanded && node.length > 0)
        {
            this.__render_children(writer, node, node, 0, node.length, format, ++level, last, line);
        }

        writer.push('</div></div>');
    };


    //渲染子项
    this.__render_children = function (writer, node, items, start, end, format, level, last, line) {

        var item, space, any;

        node.__content_render = true;

        //如果未传入渲染参数则初始化渲染参数
        if (format === void 0 && (item = node.parent))
        {
            level = 1;
            last = item[item.length - 1] === node;
            
            do
            {
                if (item.isTreeNode)
                {
                    level++;
                }
                else
                {
                    format = item.format || null;
                    line = (item.__storage || item.__defaults).theme === 'line';
                    break;
                }
            }
            while (item = item.parent);
        }

        space = last && line ? ' style="background:none;"' : '';
        space = '<span class="f-tree-space"' + space + '></span>';

        if (level > 1)
        {
            space = new Array(level + 1).join(space);
        }

        any = items.length;
            
        while (start < end)
        {
            if (item = items[start++])
            {
                if (item.view)
                {
                    item.renderer.unmount(item);
                }

                item.renderer.render(writer, item, format, level, start === any, line, space);
            }
        }
    };

        

    this.mount = function (control, view) {

        var dom = control.view_content = view.lastChild;

        base.mount.call(this, control, view);

        if (control.__content_render)
        {
            this.__mount_children(control, view, control, 0, control.length, dom.firstChild);
        }
    };
    


    this.checked = function (node, view, value) {

        value = value ? 'checked' : (node.checkedChildren ? 'checked2' : 'unchecked');
        find_dom(view, 'check', 'f-tree-check f-tree-' + value);
    };


    this.icon = function (node, view, value) {

        find_dom(view, 'icon', 'f-tree-icon ' + value);
    };


    this.text = function (node, view, value) {

        var any;

        if (view = find_dom(view, 'text'))
        {
            while ((any = node.parent) && any.isTreeNode)
            {
                node = any;
            }

            if (any = node && node.format)
            {
                view.innerHTML = format(flyingon.html_encode(value));
            }
            else
            {
                view[this.__text_name] = value;
            }
        }
    };


    this.expand = function (node) {

        var view = node.view,
            folder = find_dom(view, 'folder'),
            icon = find_dom(view, 'icon'),
            any;

        if (node.length > 0)
        {
            if (folder)
            {
                folder.className = 'f-tree-folder f-tree-open';
            }

            if (icon)
            {
                icon.className = 'f-tree-icon f-tree-icon-open';
            }

            view = view.lastChild;

            if (!node.__content_render)
            {
                this.__render_children(any = [], node, node, 0, node.length);

                view.innerHTML = any.join('');

                this.__mount_children(node, view, node, 0, node.length, view.firstChild);
            }
            
            view.style.display = '';
        }
        else
        {
            if (folder)
            {
                folder.className = 'f-tree-file';
                folder.removeAttribute('tag');
            }

            if (icon)
            {
                icon.className = 'f-tree-icon f-tree-icon-file';
            }

            view.lastChild.style.display = 'none';
        }
    };


    this.collapse = function (node) {

        var view = node.view;

        view.lastChild.style.display = 'none';

        find_dom(view, 'folder', 'f-tree-folder f-tree-close');
        
        if (view = find_dom(view, 'icon'))
        {
            view.className = view.className.replace('f-tree-icon-open', 'f-tree-icon-close');
        }
    };


    function find_dom(view, tag, className) {

        var node = view.firstChild.lastChild;

        while (node)
        {
            if (node.getAttribute('tag') === tag)
            {
                if (className)
                {
                    node.className = className;
                }

                return node;
            }

            node = node.previousSibling;
        }
    };



    this.current = function (node, current) {

        var dom = node.view.firstChild,
            name = dom.className,
            key = ' f-tree-node-current';

        if (current)
        {
            if (name.indexOf(key) < 0)
            {
                dom.className += key;
            }
        }
        else
        {
            dom.className = name.replace(key, '');
        }
    };



});