window.onload = function() {

	var video = document.getElementById("video");
	var lis = document.getElementsByClassName("video-list");
	var vLen = lis.length; // 播放列表的长度
	var url = [];
	var ctrl = document.getElementById("playList-hidden");
	var ctrl_show = document.getElementById("playList-show");
	var aside = document.getElementById("playList");
	var leftside = document.getElementById("block-D");
	var vip_model = document.getElementById("vip_model");
	vip_model_display = vip_model.style.display;
	var divscrollDiv = document.getElementsByClassName("divscrollDiv");
	var curr = 1; // 当前播放的视频

	for (var i = 0; i < lis.length; i++) {

		url[i] = lis[i].getAttribute("value");

	}

	//给列表和视频写入自定义高度
	boxheight(); //执行函数
	function boxheight() { //函数：获取尺寸
		//获取浏览器窗口高度
		var winHeight = 0;
		var topHeight = 88;
		if (window.innerWidth <= 1155)
			winHeight = 353;
		else if (window.innerWidth <= 1335)
			winHeight = 447;
		else if (window.innerWidth <= 1550)
			winHeight = 560;
		else if (window.innerWidth <= 1765)
			winHeight = 673;
		else if (window.innerWidth > 1766)
			winHeight = 784;
		document.getElementById("mainBox").style.height = winHeight - topHeight + "px";
		document.getElementById("video").style.height = winHeight + "px";
	}
	window.onresize = boxheight; //窗口或框架被调整大小时执行

	//js创建滚动条
	var doc = document;
	var _wheelData = -1;
	var mainBox = doc.getElementById('mainBox');

	function bind(obj, type, handler) {
		var node = typeof obj == "string" ? $(obj) : obj;
		if (node.addEventListener) {
			node.addEventListener(type, handler, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + type, handler);
		} else {
			node['on' + type] = handler;
		}
	}

	function mouseWheel(obj, handler) {
		var node = typeof obj == "string" ? $(obj) : obj;
		bind(node, 'mousewheel', function(event) {
			var data = -getWheelData(event);
			handler(data);
			if (document.all) {
				window.event.returnValue = false;
			} else {
				event.preventDefault();
			}

		});
		//火狐  
		bind(node, 'DOMMouseScroll', function(event) {
			var data = getWheelData(event);
			handler(data);
			event.preventDefault();
		});

		function getWheelData(event) {
			var e = event || window.event;
			return e.wheelDelta ? e.wheelDelta : e.detail * 40;
		}
	}

	function addScroll() {
		this.init.apply(this, arguments);
	}
	addScroll.prototype = {
		init: function(mainBox, contentBox, className) {
			var mainBox = doc.getElementById(mainBox);
			var contentBox = doc.getElementById(contentBox);
			var scrollDiv = this._createScroll(mainBox, className);
			this._resizeScorll(scrollDiv, mainBox, contentBox);
			this._tragScroll(scrollDiv, mainBox, contentBox);
			this._wheelChange(scrollDiv, mainBox, contentBox);
			this._clickScroll(scrollDiv, mainBox, contentBox);
		},
		//创建滚动条  
		_createScroll: function(mainBox, className, idName) {
			var _scrollBox = doc.createElement('div')
			var _scroll = doc.createElement('span');
			var span = doc.createElement('span');
			_scrollBox.appendChild(_scroll);
			_scroll.appendChild(span);
			_scrollBox.id = 'div' + className;
			_scroll.className = className;
			mainBox.appendChild(_scrollBox);
			return _scroll;
		},
		//调整滚动条  
		_resizeScorll: function(element, mainBox, contentBox) {
			var p = element.parentNode;
			var conHeight = contentBox.offsetHeight;
			//var _width = mainBox.clientWidth;
			var _height = mainBox.clientHeight;
			var _scrollWidth = element.offsetWidth;
			//var _left = _width - _scrollWidth;
			//p.style.width = _scrollWidth + "px";
			p.style.height = _height + "px";
			//p.style.left = _left + "px";
			//p.style.position = "absolute";
			//p.style.background = "#ccc";
			contentBox.style.width = (mainBox.offsetWidth - _scrollWidth) +
				"px";
			var _scrollHeight = parseInt(_height * (_height / conHeight));
			if (_scrollHeight >= mainBox.clientHeight) {
				element.parentNode.style.display = "none";
			}
			element.style.height = _scrollHeight + "px";
		},
		//拖动滚动条  
		_tragScroll: function(element, mainBox, contentBox) {
			var mainHeight = mainBox.clientHeight;
			element.onmousedown = function(event) {
				var _this = this;
				var _scrollTop = element.offsetTop;
				var e = event || window.event;
				var top = e.clientY;
				//this.onmousemove=scrollGo;  
				document.onmousemove = scrollGo;
				document.onmouseup = function(event) {
					this.onmousemove = null;
				}

				function scrollGo(event) {
					var e = event || window.event;
					var _top = e.clientY;
					var _t = _top - top + _scrollTop;
					if (_t > (mainHeight - element.offsetHeight)) {
						_t = mainHeight - element.offsetHeight;
					}
					if (_t <= 0) {
						_t = 0;
					}
					element.style.top = _t + "px";
					contentBox.style.top = -_t *
						(contentBox.offsetHeight / mainBox.offsetHeight) +
						"px";
					_wheelData = _t;
				}
			}
			element.onmouseover = function() {
				this.style.background = "#666";
			}
			element.onmouseout = function() {
				this.style.background = "#333";
			}
		},
		//鼠标滚轮滚动，滚动条滚动  
		_wheelChange: function(element, mainBox, contentBox) {
			var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
			var flag = 0,
				rate = 0,
				wheelFlag = 0;
			if (node) {
				mouseWheel(
					node,
					function(data) {
						wheelFlag += data;
						if (_wheelData >= 0) {
							flag = _wheelData;
							element.style.top = flag + "px";
							wheelFlag = _wheelData * 12;
							_wheelData = -1;
						} else {
							flag = wheelFlag / 12;
						}
						if (flag <= 0) {
							flag = 0;
							wheelFlag = 0;
						}
						if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {
							flag = (mainBox.clientHeight - element.offsetHeight);
							wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;

						}
						element.style.top = flag + "px";
						contentBox.style.top = -flag *
							(contentBox.offsetHeight / mainBox.offsetHeight) +
							"px";
					});
			}
		},
		_clickScroll: function(element, mainBox, contentBox) {
			var p = element.parentNode;
			p.onclick = function(event) {
				var e = event || window.event;
				var t = e.target || e.srcElement;
				var sTop = document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop :
					document.body.scrollTop;
				var top = mainBox.offsetTop;
				var _top = e.clientY + sTop - top - element.offsetHeight /
					2;
				if (_top <= 0) {
					_top = 0;
				}
				if (_top >= (mainBox.clientHeight - element.offsetHeight)) {
					_top = mainBox.clientHeight - element.offsetHeight;
				}
				if (t != element) {
					element.style.top = _top + "px";
					contentBox.style.top = -_top *
						(contentBox.offsetHeight / mainBox.offsetHeight) +
						"px";
					_wheelData = _top;
				}
			}
		}
	}
	new addScroll('mainBox', 'content', 'scrollDiv');

	//绑定单击事件
	for (var i = 0; i < lis.length; i++) {

		lis[i].onclick = function() {
			for (var j = 0; j < lis.length; j++) {
				if (lis[j] == this) {
					video.setAttribute("src", this.getAttribute("value"));
					video.setAttribute('autoplay', 'autoplay');
					this.className = "play-list-item video-list selected";
					curr = j + 1;
				} else {
					lis[j].className = "play-list-item video-list";
				}
			}

			//			console.log(this.getAttribute("value"));  //调试代码
			// 判断VIP层是否显示，显示视频暂停，否则播放
			if (vip_model_display == 'block') {
				setTimeout(function() {
					if (video !== null) {
						//检测播放是否已暂停.audio.paused 在播放器播放时返回false.
						//alert(video.paused);
						if (video.paused) {
							video.play(); //audio.play();// 这个就是播放  
						} else {
							video.pause(); // 这个就是暂停
						}
					}
				}, "1000");
			} else {
				video.play();
			}
		}

	}

	//收起播放列表
	ctrl.onclick = function() {
		leftside.style.transition = "1s";
		//		leftside.style.transform = "translateX(0vw)";
		setTimeout(function() {
			leftside.style.display = "none";
			document.getElementById("player-mnc").style.marginRight = "0";
			ctrl.style.display = "none";
			ctrl_show.style.display = "block";
		}, "10");

	}

	//展开播放列表
	ctrl_show.onclick = function() {
		aside.style.transition = "1s";
		//		aside.style.transform = "translateX(0vw)";
		setTimeout(function() {

			document.getElementById("player-mnc").style.marginRight = "305px";
			leftside.style.display = "block";
			ctrl_show.style.display = "none";
			ctrl.style.display = "block";

		}, "10");
	}



	//获取播放地址并添加class
	video.setAttribute('src', url[0]);
	lis[0].className = "play-list-item video-list selected";

	video.addEventListener('ended', play);
	//play();

	//播放列表并写入class
	function play() {
		video.src = url[curr];
		video.load(); // 如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
		video.play();

		for (var j = 0; j < lis.length; j++) {
			if (j == curr) {
				video.setAttribute("src", lis[j].getAttribute("value"));
				video.setAttribute('autoplay', 'autoplay');
				lis[j].className = "play-list-item video-list selected";
			} else {
				lis[j].className = "play-list-item video-list";
			}
		}
		curr++;
		if (curr >= vLen) curr = 0; // 播放完了，重新播放
	}
	//





	//防止自定义滚动条显示问题，改变窗口大小后重新载入
	var timeout = null; //onresize触发次数过多，设置定时器
	window.onresize = function() {
		timeout = setTimeout(function() {
			//重新加载获取高度
			boxheight(); //执行函数
			function boxheight() { //函数：获取尺寸
				//获取浏览器窗口高度
				var winHeight = 0;
				var topHeight = 88;
				if (window.innerWidth <= 1155)
					winHeight = 353;
				else if (window.innerWidth <= 1335)
					winHeight = 447;
				else if (window.innerWidth <= 1550)
					winHeight = 560;
				else if (window.innerWidth <= 1765)
					winHeight = 673;
				else if (window.innerWidth > 1766)
					winHeight = 784;
				document.getElementById("mainBox").style.height = winHeight - topHeight + "px";
				document.getElementById("video").style.height = winHeight + "px";
			}
			//重新加载滚动条
			var box = document.getElementById("divscrollDiv");
			box.parentNode.removeChild(box);
			new addScroll('mainBox', 'content', 'scrollDiv');
			
		}, 10); //页面大小变化，重新加载页面以刷新
	}



}
