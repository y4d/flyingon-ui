flyingon.renderer('Dialog', 'Panel', function (base) {



    this.render = function (writer, control, render) {

        var head = (control.__storage || control.__defaults).header;

        writer.push('<div');
        
        render.call(this, writer, control);
        
        writer.push('>',
            '<div class="f-dialog-head" class="f-back" style="height:', head, 'px;line-height:', head, 'px;" onmousedown="flyingon.Dialog.onmousedown.call(this, event)" onclick="flyingon.Dialog.onclick.call(this, event)">',
                '<span class="f-dialog-icon" style="display:none;', '"></span>',
                '<span class="f-dialog-text"></span>',
                '<span class="f-dialog-close" tag="close"></span>',
                '<span class="f-dialog-line"></span>',
            '</div>',
            '<div class="f-dialog-body" style="top:', head, 'px;">');

        if (control.length > 0 && control.__visible)
        {
            control.__content_render = true;
            this.__render_children(writer, control, control, 0, control.length);
        }

        writer.push(this.__scroll_html, '</div></div>');
    };
    



    flyingon.Dialog.onclick = function (e) {

        var control = flyingon.findControl(this),
            dom = e.target || e.srcElement;

        if (dom.getAttribute('tag') === 'close')
        {
            control.close();
        }
        else
        {
            control.active();
        }
    };
    
    
    flyingon.Dialog.onmousedown = function (e) {

        var control = flyingon.findControl(this);
        
        if (control)
        {
            control.active();
            control.renderer.movable(control, e);
        }
    };



    this.mount = function (control, view) {

        control.view_content = view.lastChild;
        base.mount.call(this, control, view);
    };



    this.active = function (control, active) {

        var view = control.view,
            name = ' f-dialog-active';

        if (active)
        {
            if (view.className.indexOf(name) < 0)
            {
                view.className += name;
            }
        }
        else
        {
            view.className = view.className.replace(name, '');
        }
    };


    this.header = function (control, view, value) {

        var style = view.firstChild.style;
        style.height = style.lineHeight = view.lastChild.style.top = value + 'px';
    };


    this.text = function (control, view, value) {

        view = view.firstChild.children[1];

        if (control.format)
        {
            view.innerHTML = control.format(value);
        }
        else
        {
            view[this.__text_name] = value;
        }
    };


    this.icon = function (control, view, value) {

        view = view.firstChild.firstChild;
        view.className = 'f-groupbox-icon' + (value ? ' ' + value : '');
        view.style.display = value ? '' : 'none';
    };


    this.closable = function (control, view, value) {

        view.firstChild.children[2].style.display = value ? '' : 'none';
    };



    this.show = function (control, overlay) {

        var body = document.body,
            view = control.view || this.createView(control),
            width = body.clientWidth;

        body.appendChild(view);
        
        control.trigger('showing');

        control.measure(width, 0);

        this.center(control);

        if (overlay)
        {
            flyingon.dom_overlay(view);
        }

        flyingon.__update_patch();
        this.locate(control);
        
        control.trigger('shown');
    };

    
    this.center = function (control) {

        var body = document.body,
            style = control.view.style;

        style.left = (control.offsetLeft = body.clientWidth - control.offsetWidth >> 1) + 'px';
        style.top = (control.offsetTop = ((window.innerHeight || document.documentElement.clientHeight) 
            - control.offsetHeight >> 1) - body.clientLeft) + 'px';
    };


    this.movable = function (control, event) {

        event.dom = control.view;
        flyingon.dom_drag(control, event);
        
        event.dom = null;
    };



    this.close = function (control) {

        var view = control.view,
            any;

        if (any = view.parentNode)
        {
            any.removeChild(view);
        }

        if (view.flyingon_overlay)
        {
            flyingon.dom_overlay(view, false);
        }
    };



});




flyingon.showMessage = function (title, text, type, buttons, focus) {

    var dialog, any;

    if (arguments.length < 4)
    {
        focus = buttons;
        buttons = type;
        type = '';
    }

    buttons = buttons ? '' + buttons : 'ok';

    any = buttons.match(/\w+/g);
    buttons = [];

    for (var i = 0, l = any.length; i < l; i++)
    {
        buttons.push({

            Class: 'Button',
            height: 25,
            minWidth: 80,
            margin: '8 2 0 2',
            tag: any[i],
            text: flyingon.i18ntext('system.' + any[i], any[i])
        });
    }

    dialog = flyingon.ui({

        layout: 'vertical-line',
        width: 300,
        height: 'auto',
        padding: 0,
        text: title,

        children: [
            { 
                Class: 'Panel', 
                layout: 'dock',
                height: 'auto',
                padding: 8,
                minHeight: 60,
                style: 'overflow:hidden;',
                children: [
                    { Class: 'Label', dock: 'left', width: 50, height: 50, visible: type, className: 'f-message-icon' + (type ? ' f-message-' + type : '') },
                    { Class: 'Label', dock: 'fill', height: 'auto', text: text }
                ]
            },
            {
                Class: 'div', 
                height: 40,
                className: 'f-message-foot', 
                style: 'overflow:hidden;',
                children: buttons
            }
        ]

    }, flyingon.Dialog).showDialog();

    any = dialog.offsetHeight / 200;

    if (any > 1)
    {
        any = 300 * any;

        dialog.width(any > 800 ? 800 : any);
        dialog.showDialog();
    }

    dialog.view.lastChild.firstChild.nextSibling.children[focus | 0].focus();

    dialog.on('click', function (e) {

        var tag = e.target.tag();

        if (tag)
        {
            this.close(tag);
        }
    });

    return dialog;

};