const webminify = require('webminify');


webminify()
    .load('src', [

        'base/oo.js',
        'base/utils.js',
        'base/stream.js',
        'base/extend.js',
        'base/i18n.js',
        'base/collection.js',
        'base/serialize.js',
        'base/datalist.js',
        'base/dataset.js',
        'base/bindable.js',
        'base/visual.js',
        'base/validator.js',

        'web/utils.js',
        'web/event.js',

        'web/http.js',

        'require/require.js',
        'require/web.js',

        'route/urlroute.js',
        'route/web.js',
        'selector/selector.js',

        'renderer/renderer.js',
        'renderer/htmlelement.js',
        'renderer/label.js',
        'renderer/icon.js',
        'renderer/button.js',
        'renderer/linkbutton.js',
        'renderer/image.js',
        'renderer/slider.js',
        'renderer/progressbar.js',
        'renderer/panel.js',
        'renderer/groupbox.js',
        'renderer/splitter.js',

        'renderer/listbox.js',
        'renderer/radiobutton.js',
        'renderer/checkbox.js',
        'renderer/textbox.js',
        'renderer/memo.js',
        'renderer/textbutton.js',
        'renderer/calendar.js',

        'renderer/box.js',
        'renderer/title.js',
        'renderer/hint.js',

        'renderer/tree.js',
        'renderer/grid.js',
        'renderer/tab.js',
        'renderer/popup.js',
        'renderer/tooltip.js',
        'renderer/dialog.js',

        'renderer/menu.js',

        'control/control.js',
        'control/htmlelement.js',
        'control/label.js',
        'control/icon.js',
        'control/button.js',
        'control/linkbutton.js',
        'control/image.js',
        'control/slider.js',
        'control/progressbar.js',
        'control/container.js',
        'control/panel.js',
        'control/groupbox.js',
        'control/splitter.js',

        'control/plugin.js',

        'control/listbox.js',
        'control/radiobutton.js',
        'control/checkbox.js',
        'control/textbox.js',
        'control/password.js',
        'control/memo.js',
        'control/textbutton.js',
        'control/number.js',
        'control/combobox.js',
        'control/combotree.js',
        'control/combogrid.js',
        'control/calendar.js',
        'control/date.js',
        'control/time.js',
        'control/month.js',

        'control/box.js',
        'control/title.js',
        'control/hint.js',

        'control/tree.js',
        'control/grid.js',
        'control/tab.js',
        'control/popup.js',
        'control/tooltip.js',
        'control/dialog.js',

        'control/pagination.js',

        'control/separator.js',
        'control/menu.js',
        'control/toolbar.js',

        'layout/sublayout.js',
        'layout/layout.js',
        'layout/table.js',

        'viewmodel/viewmodel.js',
        'viewmodel/viewtemplate.js',

        'web/host.js',

        'third/highlight.js'
    ])
    .combine('\r\n\r\n\r\n\r\n\r\n')
    .output('js/flyingon.js');