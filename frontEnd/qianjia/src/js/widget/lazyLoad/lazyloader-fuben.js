/** 
* 
* 图片懒加载， 在一个开源的lazyLoader上进行了一定的修改`
* weimeng
* 
* <img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">
*/

const LazyLoader = function(target) {
	var $q = function(q, res) {
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
	addEventListener = function(evt, fn) {
		target.addEventListener ? target.addEventListener(evt, fn, false) : (target.attachEvent) ? target.attachEvent('on' + evt, fn) : target['on' + evt] = fn;
	},
	_has = function(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	};

	function loadImage(el, fn) {
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
	}

	function elementInViewport(el) {
		var eleRect = el.getBoundingClientRect();
		var wrapRect = target.getBoundingClientRect();



        return (
            eleRect.bottom >= wrapRect.top && eleRect.top <= wrapRect.bottom
        )
	}

	var images = []; // 队列
	var I = null; // 事件
	var processScroll = function() {
		var query = $q("img.lazy");
		// Array.prototype.slice.call is not callable under our lovely IE8 
		for (var i = 0; i < query.length; i++) {
			if(elementInViewport(query[i])){
				images.push(query[i]);
			}
		}
		if(images.length > 0)
			startProcess();
	};

	function startProcess(){
		var EACH = 10; // 每次处理3个
		var I = setInterval(function(){
			var c = 0;
			do{
				var img = images.pop();
				c++;
				if(!img){
					clearInterval(I);	
					break;
				}
				loadImage(img);
			}while(images.length > 0 && c < EACH)
		}, 200);
	}
	

	processScroll();
	addEventListener('scroll', processScroll);
	var timer = setInterval(function() {
		processScroll();
	}, 500);





};

export default LazyLoader;
