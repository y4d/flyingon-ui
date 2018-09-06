flyingon.renderer('Splitter', function (base) {



    //渲染html
    this.render = function (writer, control, render) {

        writer.push('<div');

        render.cssText += 'cursor:ew-resize;';
        render.call(this, writer, control);

        writer.push(' onmousedown="flyingon.Splitter.onmousedown.call(this, event)"><div></div></div>');
    };
    

    this.locate = function (control) {

        var vertical = control.offsetWidth > control.offsetHeight;

        base.locate.call(this, control);

        if (control.vertical !== vertical)
        {
            control.vertical = vertical;
            control.view.style.cursor = vertical ? 'ns-resize' : 'ew-resize';
        }
    };


    flyingon.Splitter.onmousedown = function (e) {
            
        var control = flyingon.findControl(this),
            data = resize_data(control);

        if (data)
        {
            document.body.style.cursor = this.style.cursor;
            flyingon.dom_drag(data, e, null, do_resize, resize_end, true);
        }
    };


    function resize_data(control) {

        var parent = control.parent,
            vertical = control.vertical,
            dock = (control.__storage || control.__defaults).dock;

        if (parent && (control = parent[parent.indexOf(control) - 1]))
        {
            return [control, vertical, vertical ? control.offsetHeight : control.offsetWidth, dock === 'right' || dock === 'bottom'];
        }
    };


    function do_resize(event) {

        var control = this[0],
            vertical = this[1],
            name = vertical ? 'distanceY' : 'distanceX',
            size = this[2] + (this[3] ? -event[name] : event[name]),
            visible = 'visible';

        if (size < 4)
        {
            size = 0;
            visible = 'hidden';
        }

        control.visibility(visible);
        control[vertical ? 'height' : 'width'](size);
    };


    function resize_end() {

        document.body.style.cursor = '';
    };



});