flyingon.Control.extend('Slider', function (base) {



    var define = function (self, name, defaultValue) {

        return self.defineProperty(name, defaultValue, {

            dataType: 'int',

            check: function (value) {

                return value < 0 ? 0 : value;
            },

            set: function () {

                this.view && this.renderer.patch(this, 'refresh');
            }
        });
    };



    define(this, 'value', 0);


    define(this, 'min', 0);


    define(this, 'max', 100);


    define(this, 'buttonSize', 8);



}).register();