/**
 * 校验提醒信息
 */
flyingon.Control.extend('Hint', function (base) {
   


    var validate = flyingon.validate;



    //标记为校验错误控件
    this.__box_error = true;


    this.defaultWidth = 30;


    this.defaultValue('visible', this.__visible = false);


    //显示方式
    //info
    //error
    //warn
    //question
    //text
    this.defineProperty('type', 'text', {
        
        set: function (name, value) {

            if (this.__no_text = value !== 'text')
            {
                if (!this.__validate_event)
                {
                    this.__validate_event = true;
                    this.on('mouseover', validate.mouseover);
                    this.on('mouseout', validate.mouseout);
                }
            }
            else if (this.__validate_event)
            {
                this.off('mouseover', validate.mouseover);
                this.off('mouseout', validate.mouseout);
            }

            this.view && this.renderer.patch(this, name, value);
        }
    });


    //在box中是否独占一行
    this.defineProperty('line', false, {

        set: function (name, value) {

            if (value)
            {
                this.addClass('f-hint-line');
            }
            else
            {
                this.removeClass('f-hint-line');
            }
        }
    });



}).register();