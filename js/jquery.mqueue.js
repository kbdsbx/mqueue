/**
 * @charset: UTF-8
 * jquery.mqueue jQuery消息列表
 * version: v1.0.1
 * 
 * copyright © 2014 kbdsbx
 * date: 2014-06-13
 * 
 * url: none;
 */

;(function($){
	$.fn.mqueue = function(){
		var mq = new $.mQueue();
		mq._add();
	}
	
	$.mqueue = {};
	
	$.mqueue.add = function( options ) {
		mQueue.add( options );
	}
	$.mqueue.clean = function () {
		mQueue.clean_panel();
	}
	$.mqueue.remove = function ( selector ) {
		mQueue.remove( selector );
	}
	
	var mQueue = {
		types : [
			'default',
			'white',
			'info',
			'danger',
			'warning',
			'success'
		],
		defaults : {
			type		:	'default',	// info success warning danger
			icon		:	false,		// font-awesome
			img			:	false,		// image url
			title		:	false,		// title
			text		:	false,		// text
			url			:	false,		// url
			keeptime	:	8000,		// the item keep to show time
			speed		:	600,		// speed
			position	:	'top',		// top; bottom
			penetrate	:	false		// penetrate
		},
		out_handle : {},
		_create_panel : function( options ) {
			var panel = $("<div></div>").addClass("mqueue-panel");
			if ( options.position === 'bottom' ) {
				panel.addClass("mqueue-panel-bottom");
			}
			$("body").append( panel );
		},
		_clean_panel : function( options ) {
			var panel = $("body > .mqueue-panel");
			if ( panel.length != 0 ) {
				panel.stop().animate( { opacity: 0 }, options.speed / 2, function() {
					panel.remove();
				} );
			}
		},
		_add : function( options ) {
			var panel, item, msg, close, icon, iconClass, title, text, url, img, id, _this = this;
			if ($("body > .mqueue-panel").length == 0) {
				this._create_panel( options );
			}
			
			panel = $("body > .mqueue-panel");
			
			// 添加消息时阻止panel
			panel.stop(true, false);
			panel.css( { opacity : 1 } );
			
			id = parseInt($("body > .mqueue-panel .mqueue-item:last-child").attr("data-mqueue-id"), 10) || 0;
			id += 1;
			item = $("<div></div>")
				.addClass("mqueue-item")
				.attr("data-mqueue-id", id)
				.data("options", options);
			item.on('mouseenter', _this, _this._hover)
		    	.on('mouseleave', _this, _this._leave);
			
			if (options.icon || options.img) { item.addClass("mqueue-richtext"); }
			if (options.penetrate) { item.addClass("mqueue-penetrate"); }
			
			close = $("<div></div>")
				.addClass("mqueue-close")
				.addClass("icon-remove")
				.on("click", function() {
					item.addClass("mqueue-delete");
					_this._remove.apply(_this, [item]);
				});
			
			// 若类型不存在则使用default类型
			if (!_this._find(_this.types, options.type)) {
				options.type = 'default';
			}
			msg = $("<div></div>").addClass("mqueue-" + options.type);
			
			if (options.icon) {
				if (options.icon.substr(0, 5) === 'icon-') {
					iconClass = options.icon;
				} else {
					iconClass = 'icon-' + options.icon;
				}
				icon = $("<span></span>").addClass("mqueue-icon icon-3x " + iconClass);
			}
			
			if (options.img) {
				img = $("<img></img>").addClass("mqueue-img").attr("src", options.img);
			}

			if (options.title) {
				title = $("<span></span>").addClass("mqueue-title");
				if (options.url) {
					url = $("<a></a>").attr("href", options.url).html(options.title);
					url.appendTo(title);
				}
				else {
					title.html(options.title);
				}
			}
			if (options.text) {
				text = $("<p></p>").addClass("mqueue-text");
				if (options.url && !title) {
					url = $("<a></a>").attr("href", options.url).html(options.text);
					url.appendTo(text);
				}
				else {
					text.html(options.text);
				}
			}
			
			close.appendTo(msg);
			if (icon && !img) { icon.appendTo(msg); }
			if (img) { img.appendTo(msg); }
			if (title) { title.appendTo(msg); }
			if (text) { text.appendTo(msg); }
			if (close) {  }
			if (msg) { msg.appendTo(item); }
			
			item.appendTo(panel);
			
			// TODO:
			_this.out_handle = _this.out_handle || {};
			_this.out_handle[id] = setTimeout(function() {
				_this._remove.apply(_this, [item]);
			}, options.keeptime);
		},
		_remove : function( _ele ) {
			var _this = this;
			var _element = $(_ele);
			var id = _element.attr("data-mqueue-id");
			var options = _element.data("options") || _this.defaults;
			var panel = $("body > .mqueue-panel");

			_element.stop().animate( { opacity: 0 }, options.speed ).animate( { height: 0 }, options.speed / 2, function() {
				_element.remove();
				if (panel.find(".mqueue-item").length === 0) {
					_this._clean_panel(options);
				}
			});
			delete _this.out_handle[id];
		},
		/**
		 * 仅用于mousemove/mouseenter/mouseover事件
		 */
		_hover : function( e ) {
			var _this = e.data;
			var _element = $(e.currentTarget);
			var options = _element.data("options");
			if (!_element.hasClass("mqueue-delete")) {
				_element.stop(true, false);
				_element.css( { height: '', opacity: '' } );
				clearTimeout(_this.out_handle[_element.attr("data-mqueue-id")]);
			}
		},
		/**
		 * 仅用于mouseleave事件
		 */
		_leave : function( e ) {
			var _this = e.data;
			var _element = $(e.currentTarget);
			var options = _element.data("options");
			var id = _element.data("mqueue-id");
			
			_this.out_handle[id] = setTimeout(function() {
				_this._remove.apply(_this, [_element]);
			}, options.keeptime);
		},
		_extend : function( options ) {
			return $.extend({}, this.defaults, options);
		},
		_find : function( array, item ) {
			var finded = false;
			if (array instanceof Array) {
				$.each(array, function(i, v) {
					if (v === item) {
						finded = true;
						return false;
					}
				});
			}
			return finded;
		},
		add : function( options ) {
			options = this._extend( options );
			this._add( options );
		},
		remove : function( element ) {
			var _this = this;
			$.each(element, function() {
				_this._remove( this );
			});
		},
		clean_panel : function() {
			var options = this._extend({});
			this._clean_panel( options );
		}
	}
})(jQuery);





























