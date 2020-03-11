/** 
* 
* 图片懒加载， 在一个开源的lazyLoader上进行了一定的修改`
* ChengRan
* 
* <img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">
 *     // 初始化
	 lazyloader.init({
		ele: document.querySelector('.viewListWrap')
	});
	 //滚动时候
	 lazyloader.processScroll();
*/





function LazyLoader(){
	this.images = []; // 队列
	this.I = null;   // 事件
}
LazyLoader.prototype = {
	init: function(opts){
	    var that = this;
        that.target = opts.ele;

        setTimeout(function(){
            that.processScroll();
        },500)

        that.target.addEventListener('scroll', function(){
            that.processScroll.bind(that)
		});

	},
    $q: function(q, res) {
	    var that = this;
	    var target = that.target;

        if (target.querySelectorAll) {
            res = target.querySelectorAll(q);
        } else {
            var d = target,
                a = d.styleSheets[0] || d.createStyleSheet();
            a.addRule(q, 'f:b');
            for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
                l[b].currentStyle.f && c.push(l[b]);

            a.removeRule(0);
            res = c;
        }
        return res;
    },
    addEventListener : function(evt, fn) {
	    var target = this.target;
        target.addEventListener ? target.addEventListener(evt, fn, false) : (target.attachEvent) ? target.attachEvent('on' + evt, fn) : target['on' + evt] = fn;
    },
    _has : function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    loadImage:function (el, fn) {
		//var img = new Image(),
		var src = el.getAttribute('data-src');
		el.classList.remove('lazy');
		el.classList.add('lazy1');
		el.onload = function() {
			fn ? fn() : null;
			el.classList.add("go");
		}
		el.onerror = function(){
		}
		el.src = src;
	},

    elementInViewport: function (el) {
        var target = this.target;
		var eleRect = el.getBoundingClientRect();
		var wrapRect = target.getBoundingClientRect();



		return (
			eleRect.bottom >= wrapRect.top && eleRect.top <= wrapRect.bottom
		)
	},

    processScroll: function() {
	    var that = this;
        var query = that.$q("img.lazy");
        // Array.prototype.slice.call is not callable under our lovely IE8
        for (var i = 0; i < query.length; i++) {
            if(that.elementInViewport(query[i])){
                that.images.push(query[i]);
            }
        }
        if(that.images.length > 0)
            that.startProcess();
    },

    startProcess:function (){
	    var that = this;

		var EACH = 10; // 每次处理3个
		var I = setInterval(function(){
			var c = 0;
			do{
				var img = that.images.pop();
				c++;
				if(!img){
					clearInterval(I);
					break;
				}
                that.loadImage(img);
			}while(that.images.length > 0 && c < EACH)
		}, 200);
	}

};
var LazyLoaderCase =  new LazyLoader();
export default LazyLoaderCase;
