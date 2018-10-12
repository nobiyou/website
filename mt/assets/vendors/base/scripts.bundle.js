this.Element && function(t) {
		t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector || t.msMatchesSelector || function(t) {
			for(var e = (this.parentNode || this.document).querySelectorAll(t), a = -1; e[++a] && e[a] != this;);
			return !!e[a]
		}
	}(Element.prototype), this.Element && function(t) {
		t.closest = t.closest || function(t) {
			for(var e = this; e.matches && !e.matches(t);) e = e.parentNode;
			return e.matches ? e : null
		}
	}(Element.prototype), this.Element && function(t) {
		t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector || t.msMatchesSelector || function(t) {
			for(var e = (this.parentNode || this.document).querySelectorAll(t), a = -1; e[++a] && e[a] != this;);
			return !!e[a]
		}
	}(Element.prototype),
	function() {
		for(var t = 0, e = ["webkit", "moz"], a = 0; a < e.length && !window.requestAnimationFrame; ++a) window.requestAnimationFrame = window[e[a] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[a] + "CancelAnimationFrame"] || window[e[a] + "CancelRequestAnimationFrame"];
		window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
			var a = (new Date).getTime(),
				n = Math.max(0, 16 - (a - t)),
				o = window.setTimeout(function() {
					e(a + n)
				}, n);
			return t = a + n, o
		}), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
			clearTimeout(t)
		})
	}(), [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function(t) {
		t.hasOwnProperty("prepend") || Object.defineProperty(t, "prepend", {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: function() {
				var t = Array.prototype.slice.call(arguments),
					e = document.createDocumentFragment();
				t.forEach(function(t) {
					var a = t instanceof Node;
					e.appendChild(a ? t : document.createTextNode(String(t)))
				}), this.insertBefore(e, this.firstChild)
			}
		})
	}), window.mUtilElementDataStore = {}, window.mUtilElementDataStoreID = 0, window.mUtilDelegatedEventHandlers = {};
var mUtil = function() {
	var t = [],
		e = {
			sm: 544,
			md: 768,
			lg: 1024,
			xl: 1200
		},
		a = function() {
			var e = !1;
			window.addEventListener("resize", function() {
				clearTimeout(e), e = setTimeout(function() {
					! function() {
						for(var e = 0; e < t.length; e++) t[e].call()
					}()
				}, 250)
			})
		};
	return {
		init: function(t) {
			t && t.breakpoints && (e = t.breakpoints), a()
		},
		addResizeHandler: function(e) {
			t.push(e)
		},
		removeResizeHandler: function(e) {
			for(var a = 0; a < t.length; a++) e === t[a] && delete t[a]
		},
		runResizeHandlers: function() {
			_runResizeHandlers()
		},
		resize: function() {
			if("function" == typeof Event) window.dispatchEvent(new Event("resize"));
			else {
				var t = window.document.createEvent("UIEvents");
				t.initUIEvent("resize", !0, !1, window, 0), window.dispatchEvent(t)
			}
		},
		getURLParam: function(t) {
			var e, a, n = window.location.search.substring(1).split("&");
			for(e = 0; e < n.length; e++)
				if((a = n[e].split("="))[0] == t) return unescape(a[1]);
			return null
		},
		isMobileDevice: function() {
			return this.getViewPort().width < this.getBreakpoint("lg")
		},
		isDesktopDevice: function() {
			return !mUtil.isMobileDevice()
		},
		getViewPort: function() {
			var t = window,
				e = "inner";
			return "innerWidth" in window || (e = "client", t = document.documentElement || document.body), {
				width: t[e + "Width"],
				height: t[e + "Height"]
			}
		},
		isInResponsiveRange: function(t) {
			var e = this.getViewPort().width;
			return "general" == t || ("desktop" == t && e >= this.getBreakpoint("lg") + 1 || ("tablet" == t && e >= this.getBreakpoint("md") + 1 && e < this.getBreakpoint("lg") || ("mobile" == t && e <= this.getBreakpoint("md") || ("desktop-and-tablet" == t && e >= this.getBreakpoint("md") + 1 || ("tablet-and-mobile" == t && e <= this.getBreakpoint("lg") || "minimal-desktop-and-below" == t && e <= this.getBreakpoint("xl"))))))
		},
		getUniqueID: function(t) {
			return t + Math.floor(Math.random() * (new Date).getTime())
		},
		getBreakpoint: function(t) {
			return e[t]
		},
		isset: function(t, e) {
			var a;
			if(-1 !== (e = e || "").indexOf("[")) throw new Error("Unsupported object path notation.");
			e = e.split(".");
			do {
				if(void 0 === t) return !1;
				if(a = e.shift(), !t.hasOwnProperty(a)) return !1;
				t = t[a]
			} while (e.length);
			return !0
		},
		getHighestZindex: function(t) {
			for(var e, a, n = mUtil.get(t); n && n !== document;) {
				if(("absolute" === (e = mUtil.css(n, "position")) || "relative" === e || "fixed" === e) && (a = parseInt(mUtil.css(n, "z-index")), !isNaN(a) && 0 !== a)) return a;
				n = n.parentNode
			}
			return null
		},
		hasFixedPositionedParent: function(t) {
			for(; t && t !== document;) {
				if(position = mUtil.css(t, "position"), "fixed" === position) return !0;
				t = t.parentNode
			}
			return !1
		},
		sleep: function(t) {
			for(var e = (new Date).getTime(), a = 0; a < 1e7 && !((new Date).getTime() - e > t); a++);
		},
		getRandomInt: function(t, e) {
			return Math.floor(Math.random() * (e - t + 1)) + t
		},
		isAngularVersion: function() {
			return void 0 !== window.Zone
		},
		deepExtend: function(t) {
			t = t || {};
			for(var e = 1; e < arguments.length; e++) {
				var a = arguments[e];
				if(a)
					for(var n in a) a.hasOwnProperty(n) && ("object" == typeof a[n] ? t[n] = mUtil.deepExtend(t[n], a[n]) : t[n] = a[n])
			}
			return t
		},
		extend: function(t) {
			t = t || {};
			for(var e = 1; e < arguments.length; e++)
				if(arguments[e])
					for(var a in arguments[e]) arguments[e].hasOwnProperty(a) && (t[a] = arguments[e][a]);
			return t
		},
		get: function(t) {
			var e;
			return t === document ? document : t && 1 === t.nodeType ? t : (e = document.getElementById(t)) ? e : (e = document.getElementsByTagName(t)) ? e[0] : (e = document.getElementsByClassName(t)) ? e[0] : null
		},
		getByClass: function(t) {
			var e;
			return(e = document.getElementsByClassName(t)) ? e[0] : null
		},
		hasClasses: function(t, e) {
			if(t) {
				for(var a = e.split(" "), n = 0; n < a.length; n++)
					if(0 == mUtil.hasClass(t, mUtil.trim(a[n]))) return !1;
				return !0
			}
		},
		hasClass: function(t, e) {
			if(t) return t.classList ? t.classList.contains(e) : new RegExp("\\b" + e + "\\b").test(t.className)
		},
		addClass: function(t, e) {
			if(t && void 0 !== e) {
				var a = e.split(" ");
				if(t.classList)
					for(var n = 0; n < a.length; n++) a[n] && a[n].length > 0 && t.classList.add(mUtil.trim(a[n]));
				else if(!mUtil.hasClass(t, e))
					for(n = 0; n < a.length; n++) t.className += " " + mUtil.trim(a[n])
			}
		},
		removeClass: function(t, e) {
			if(t) {
				var a = e.split(" ");
				if(t.classList)
					for(var n = 0; n < a.length; n++) t.classList.remove(mUtil.trim(a[n]));
				else if(mUtil.hasClass(t, e))
					for(n = 0; n < a.length; n++) t.className = t.className.replace(new RegExp("\\b" + mUtil.trim(a[n]) + "\\b", "g"), "")
			}
		},
		triggerCustomEvent: function(t, e, a) {
			if(window.CustomEvent) var n = new CustomEvent(e, {
				detail: a
			});
			else(n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, a);
			t.dispatchEvent(n)
		},
		trim: function(t) {
			return t.trim()
		},
		eventTriggered: function(t) {
			return !!t.currentTarget.dataset.triggered || (t.currentTarget.dataset.triggered = !0, !1)
		},
		remove: function(t) {
			t && t.parentNode && t.parentNode.removeChild(t)
		},
		find: function(t, e) {
			return t.querySelector(e)
		},
		findAll: function(t, e) {
			return t.querySelectorAll(e)
		},
		insertAfter: function(t, e) {
			return e.parentNode.insertBefore(t, e.nextSibling)
		},
		parents: function(t, e) {
			function a(t, e) {
				for(var a = 0, n = t.length; a < n; a++)
					if(t[a] == e) return !0;
				return !1
			}
			return function(t, e) {
				for(var n = document.querySelectorAll(e), o = t.parentNode; o && !a(n, o);) o = o.parentNode;
				return o
			}(t, e)
		},
		children: function(t, e, a) {
			if(t && t.childNodes) {
				for(var n = [], o = 0, i = t.childNodes.length; o < i; ++o) 1 == t.childNodes[o].nodeType && mUtil.matches(t.childNodes[o], e, a) && n.push(t.childNodes[o]);
				return n
			}
		},
		child: function(t, e, a) {
			var n = mUtil.children(t, e, a);
			return n ? n[0] : null
		},
		matches: function(t, e, a) {
			var n = Element.prototype,
				o = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.msMatchesSelector || function(t) {
					return -1 !== [].indexOf.call(document.querySelectorAll(t), this)
				};
			return !(!t || !t.tagName) && o.call(t, e)
		},
		data: function(t) {
			return t = mUtil.get(t), {
				set: function(e, a) {
					void 0 === t.customDataTag && (mUtilElementDataStoreID++, t.customDataTag = mUtilElementDataStoreID), void 0 === mUtilElementDataStore[t.customDataTag] && (mUtilElementDataStore[t.customDataTag] = {}), mUtilElementDataStore[t.customDataTag][e] = a
				},
				get: function(e) {
					return this.has(e) ? mUtilElementDataStore[t.customDataTag][e] : null
				},
				has: function(e) {
					return !(!mUtilElementDataStore[t.customDataTag] || !mUtilElementDataStore[t.customDataTag][e])
				},
				remove: function(e) {
					this.has(e) && delete mUtilElementDataStore[t.customDataTag][e]
				}
			}
		},
		outerWidth: function(t, e) {
			if(!0 === e) {
				var a = parseFloat(t.offsetWidth);
				return a += parseFloat(mUtil.css(t, "margin-left")) + parseFloat(mUtil.css(t, "margin-right")), parseFloat(a)
			}
			return a = parseFloat(t.offsetWidth)
		},
		offset: function(t) {
			var e, a;
			if(t = mUtil.get(t)) return t.getClientRects().length ? (e = t.getBoundingClientRect(), a = t.ownerDocument.defaultView, {
				top: e.top + a.pageYOffset,
				left: e.left + a.pageXOffset
			}) : {
				top: 0,
				left: 0
			}
		},
		height: function(t) {
			return mUtil.css(t, "height")
		},
		visible: function(t) {
			return !(0 === t.offsetWidth && 0 === t.offsetHeight)
		},
		attr: function(t, e, a) {
			if(null != (t = mUtil.get(t))) return void 0 === a ? t.getAttribute(e) : void t.setAttribute(e, a)
		},
		hasAttr: function(t, e) {
			if(null != (t = mUtil.get(t))) return !!t.getAttribute(e)
		},
		removeAttr: function(t, e) {
			null != (t = mUtil.get(t)) && t.removeAttribute(e)
		},
		animate: function(t, e, a, n, o, i) {
			var l = {};
			if(l.linear = function(t, e, a, n) {
					return a * t / n + e
				}, o = l.linear, "number" == typeof t && "number" == typeof e && "number" == typeof a && "function" == typeof n) {
				"function" != typeof i && (i = function() {});
				var r = window.requestAnimationFrame || function(t) {
						window.setTimeout(t, 20)
					},
					s = e - t;
				n(t);
				var d = window.performance && window.performance.now ? window.performance.now() : +new Date;
				r(function l(c) {
					var m = (c || +new Date) - d;
					m >= 0 && n(o(m, t, s, a)), m >= 0 && m >= a ? (n(e), i()) : r(l)
				})
			}
		},
		actualCss: function(t, e, a) {
			var n;
			if(t instanceof HTMLElement != !1) return t.getAttribute("m-hidden-" + e) && !1 !== a ? parseFloat(t.getAttribute("m-hidden-" + e)) : (t.style.cssText = "position: absolute; visibility: hidden; display: block;", "width" == e ? n = t.offsetWidth : "height" == e && (n = t.offsetHeight), t.style.cssText = "", t.setAttribute("m-hidden-" + e, n), parseFloat(n))
		},
		actualHeight: function(t, e) {
			return mUtil.actualCss(t, "height", e)
		},
		actualWidth: function(t, e) {
			return mUtil.actualCss(t, "width", e)
		},
		getScroll: function(t, e) {
			return e = "scroll" + e, t == window || t == document ? self["scrollTop" == e ? "pageYOffset" : "pageXOffset"] || browserSupportsBoxModel && document.documentElement[e] || document.body[e] : t[e]
		},
		css: function(t, e, a) {
			if(t = mUtil.get(t))
				if(void 0 !== a) t.style[e] = a;
				else {
					var n = (t.ownerDocument || document).defaultView;
					if(n && n.getComputedStyle) return e = e.replace(/([A-Z])/g, "-$1").toLowerCase(), n.getComputedStyle(t, null).getPropertyValue(e);
					if(t.currentStyle) return e = e.replace(/\-(\w)/g, function(t, e) {
						return e.toUpperCase()
					}), a = t.currentStyle[e], /^\d+(em|pt|%|ex)?$/i.test(a) ? function(e) {
						var a = t.style.left,
							n = t.runtimeStyle.left;
						return t.runtimeStyle.left = t.currentStyle.left, t.style.left = e || 0, e = t.style.pixelLeft + "px", t.style.left = a, t.runtimeStyle.left = n, e
					}(a) : a
				}
		},
		slide: function(t, e, a, n, o) {
			if(!(!t || "up" == e && !1 === mUtil.visible(t) || "down" == e && !0 === mUtil.visible(t))) {
				a = a || 600;
				var i = mUtil.actualHeight(t),
					l = !1,
					r = !1;
				mUtil.css(t, "padding-top") && !0 !== mUtil.data(t).has("slide-padding-top") && mUtil.data(t).set("slide-padding-top", mUtil.css(t, "padding-top")), mUtil.css(t, "padding-bottom") && !0 !== mUtil.data(t).has("slide-padding-bottom") && mUtil.data(t).set("slide-padding-bottom", mUtil.css(t, "padding-bottom")), mUtil.data(t).has("slide-padding-top") && (l = parseInt(mUtil.data(t).get("slide-padding-top"))), mUtil.data(t).has("slide-padding-bottom") && (r = parseInt(mUtil.data(t).get("slide-padding-bottom"))), "up" == e ? (t.style.cssText = "display: block; overflow: hidden;", l && mUtil.animate(0, l, a, function(e) {
					t.style.paddingTop = l - e + "px"
				}, "linear"), r && mUtil.animate(0, r, a, function(e) {
					t.style.paddingBottom = r - e + "px"
				}, "linear"), mUtil.animate(0, i, a, function(e) {
					t.style.height = i - e + "px"
				}, "linear", function() {
					n(), t.style.height = "", t.style.display = "none"
				})) : "down" == e && (t.style.cssText = "display: block; overflow: hidden;", l && mUtil.animate(0, l, a, function(e) {
					t.style.paddingTop = e + "px"
				}, "linear", function() {
					t.style.paddingTop = ""
				}), r && mUtil.animate(0, r, a, function(e) {
					t.style.paddingBottom = e + "px"
				}, "linear", function() {
					t.style.paddingBottom = ""
				}), mUtil.animate(0, i, a, function(e) {
					t.style.height = e + "px"
				}, "linear", function() {
					n(), t.style.height = "", t.style.display = "", t.style.overflow = ""
				}))
			}
		},
		slideUp: function(t, e, a) {
			mUtil.slide(t, "up", e, a)
		},
		slideDown: function(t, e, a) {
			mUtil.slide(t, "down", e, a)
		},
		show: function(t, e) {
			t.style.display = e || "block"
		},
		hide: function(t) {
			t.style.display = "none"
		},
		addEvent: function(t, e, a, n) {
			void 0 !== (t = mUtil.get(t)) && t.addEventListener(e, a)
		},
		removeEvent: function(t, e, a) {
			(t = mUtil.get(t)).removeEventListener(e, a)
		},
		on: function(t, e, a, n) {
			if(e) {
				var o = mUtil.getUniqueID("event");
				return mUtilDelegatedEventHandlers[o] = function(a) {
					for(var o = t.querySelectorAll(e), i = a.target; i && i !== t;) {
						for(var l = 0, r = o.length; l < r; l++) i === o[l] && n.call(i, a);
						i = i.parentNode
					}
				}, mUtil.addEvent(t, a, mUtilDelegatedEventHandlers[o]), o
			}
		},
		off: function(t, e, a) {
			t && mUtilDelegatedEventHandlers[a] && (mUtil.removeEvent(t, e, mUtilDelegatedEventHandlers[a]), delete mUtilDelegatedEventHandlers[a])
		},
		one: function(t, e, a) {
			(t = mUtil.get(t)).addEventListener(e, function(t) {
				return t.target.removeEventListener(t.type, arguments.callee), a(t)
			})
		},
		hash: function(t) {
			var e, a = 0;
			if(0 === t.length) return a;
			for(e = 0; e < t.length; e++) a = (a << 5) - a + t.charCodeAt(e), a |= 0;
			return a
		},
		animateClass: function(t, e, a) {
			mUtil.addClass(t, "animated " + e), mUtil.one(t, "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
				mUtil.removeClass(t, "animated " + e)
			}), a && mUtil.one(t.animationEnd, a)
		},
		animateDelay: function(t, e) {
			for(var a = ["webkit-", "moz-", "ms-", "o-", ""], n = 0; n < a.length; n++) mUtil.css(t, a[n] + "animation-delay", e)
		},
		animateDuration: function(t, e) {
			for(var a = ["webkit-", "moz-", "ms-", "o-", ""], n = 0; n < a.length; n++) mUtil.css(t, a[n] + "animation-duration", e)
		},
		scrollTo: function(t, e, a) {
			a = a || 500;
			var n, o, i = (t = mUtil.get(t)) ? mUtil.offset(t).top : 0,
				l = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			i > l ? (n = i, o = l) : (n = l, o = i), e && (o += e), mUtil.animate(n, o, a, function(t) {
				document.documentElement.scrollTop = t, document.body.parentNode.scrollTop = t, document.body.scrollTop = t
			})
		},
		scrollTop: function(t, e) {
			mUtil.scrollTo(null, t, e)
		},
		isArray: function(t) {
			return t && Array.isArray(t)
		},
		ready: function(t) {
			(document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? t(): document.addEventListener("DOMContentLoaded", t)
		},
		isEmpty: function(t) {
			for(var e in t)
				if(t.hasOwnProperty(e)) return !1;
			return !0
		},
		numberString: function(t) {
			for(var e = (t += "").split("."), a = e[0], n = e.length > 1 ? "." + e[1] : "", o = /(\d+)(\d{3})/; o.test(a);) a = a.replace(o, "$1,$2");
			return a + n
		},
		detectIE: function() {
			var t = window.navigator.userAgent,
				e = t.indexOf("MSIE ");
			if(e > 0) return parseInt(t.substring(e + 5, t.indexOf(".", e)), 10);
			if(t.indexOf("Trident/") > 0) {
				var a = t.indexOf("rv:");
				return parseInt(t.substring(a + 3, t.indexOf(".", a)), 10)
			}
			var n = t.indexOf("Edge/");
			return n > 0 && parseInt(t.substring(n + 5, t.indexOf(".", n)), 10)
		},
		isRTL: function() {
			return "rtl" == mUtil.attr(mUtil.get("html"), "direction")
		},
		scrollerInit: function(t, e) {},
		scrollerUpdate: function(t) {
			var e;
			(e = mUtil.data(t).get("ps")) && e.update()
		},
		scrollersUpdate: function(t) {
			for(var e = mUtil.findAll(t, ".ps"), a = 0, n = e.length; a < n; a++) mUtil.scrollerUpdate(e[a])
		},
		scrollerTop: function(t) {
			mUtil.data(t).get("ps") && (t.scrollTop = 0)
		},
		scrollerDestroy: function(t) {
			var e;
			(e = mUtil.data(t).get("ps")) && (e.destroy(), e = mUtil.data(t).remove("ps"))
		}
	}
}();
mUtil.ready(function() {
	mUtil.init()
});




var mDropdown = function(t, e) {
	var a = this,
		n = mUtil.get(t),
		o = mUtil.get("body");
	if(n) {
		var i = {
				toggle: "click",
				hoverTimeout: 300,
				skin: "light",
				height: "auto",
				maxHeight: !1,
				minHeight: !1,
				persistent: !1,
				mobileOverlay: !0
			},
			l = {
				construct: function(t) {
					return mUtil.data(n).has("dropdown") ? a = mUtil.data(n).get("dropdown") : (l.init(t), l.setup(), mUtil.data(n).set("dropdown", a)), a
				},
				init: function(t) {
					a.options = mUtil.deepExtend({}, i, t), a.events = [], a.eventHandlers = {}, a.open = !1, a.layout = {}, a.layout.close = mUtil.find(n, ".m-dropdown__close"), a.layout.toggle = mUtil.find(n, ".m-dropdown__toggle"), a.layout.arrow = mUtil.find(n, ".m-dropdown__arrow"), a.layout.wrapper = mUtil.find(n, ".m-dropdown__wrapper"), a.layout.defaultDropPos = mUtil.hasClass(n, "m-dropdown--up") ? "up" : "down", a.layout.currentDropPos = a.layout.defaultDropPos, "hover" == mUtil.attr(n, "m-dropdown-toggle") && (a.options.toggle = "hover")
				},
				setup: function() {
					a.options.placement && mUtil.addClass(n, "m-dropdown--" + a.options.placement), a.options.align && mUtil.addClass(n, "m-dropdown--align-" + a.options.align), a.options.width && mUtil.css(a.layout.wrapper, "width", a.options.width + "px"), "1" == mUtil.attr(n, "m-dropdown-persistent") && (a.options.persistent = !0), "hover" == a.options.toggle && mUtil.addEvent(n, "mouseout", l.hideMouseout), l.setZindex()
				},
				toggle: function() {
					return a.open ? l.hide() : l.show()
				},
				setContent: function(t) {
					t = mUtil.find(n, ".m-dropdown__content").innerHTML = t;
					return a
				},
				show: function() {
					if("hover" == a.options.toggle && mUtil.hasAttr(n, "hover")) return l.clearHovered(), a;
					if(a.open) return a;
					if(a.layout.arrow && l.adjustArrowPos(), l.eventTrigger("beforeShow"), l.hideOpened(), mUtil.addClass(n, "m-dropdown--open"), mUtil.isMobileDevice() && a.options.mobileOverlay) {
						var t = mUtil.css(n, "z-index") - 1,
							e = mUtil.insertAfter(document.createElement("DIV"), n);
						mUtil.addClass(e, "m-dropdown__dropoff"), mUtil.css(e, "z-index", t), mUtil.data(e).set("dropdown", n), mUtil.data(n).set("dropoff", e), mUtil.addEvent(e, "click", function(t) {
							l.hide(), mUtil.remove(this), t.preventDefault()
						})
					}
					return n.focus(), n.setAttribute("aria-expanded", "true"), a.open = !0, mUtil.scrollersUpdate(n), l.eventTrigger("afterShow"), a
				},
				clearHovered: function() {
					var t = mUtil.attr(n, "timeout");
					mUtil.removeAttr(n, "hover"), mUtil.removeAttr(n, "timeout"), clearTimeout(t)
				},
				hideHovered: function(t) {
					if(!0 === t) {
						if(!1 === l.eventTrigger("beforeHide")) return;
						l.clearHovered(), mUtil.removeClass(n, "m-dropdown--open"), a.open = !1, l.eventTrigger("afterHide")
					} else {
						if(!0 === mUtil.hasAttr(n, "hover")) return;
						if(!1 === l.eventTrigger("beforeHide")) return;
						var e = setTimeout(function() {
							mUtil.attr(n, "hover") && (l.clearHovered(), mUtil.removeClass(n, "m-dropdown--open"), a.open = !1, l.eventTrigger("afterHide"))
						}, a.options.hoverTimeout);
						mUtil.attr(n, "hover", "1"), mUtil.attr(n, "timeout", e)
					}
				},
				hideClicked: function() {
					!1 !== l.eventTrigger("beforeHide") && (mUtil.removeClass(n, "m-dropdown--open"), mUtil.data(n).remove("dropoff"), a.open = !1, l.eventTrigger("afterHide"))
				},
				hide: function(t) {
					return !1 === a.open ? a : (mUtil.isDesktopDevice() && "hover" == a.options.toggle ? l.hideHovered(t) : l.hideClicked(), "down" == a.layout.defaultDropPos && "up" == a.layout.currentDropPos && (mUtil.removeClass(n, "m-dropdown--up"), a.layout.arrow.prependTo(a.layout.wrapper), a.layout.currentDropPos = "down"), a)
				},
				hideMouseout: function() {
					mUtil.isDesktopDevice() && l.hide()
				},
				hideOpened: function() {
					for(var t = mUtil.findAll(o, ".m-dropdown.m-dropdown--open"), e = 0, a = t.length; e < a; e++) {
						var n = t[e];
						mUtil.data(n).get("dropdown").hide(!0)
					}
				},
				adjustArrowPos: function() {
					var t = mUtil.outerWidth(n),
						e = mUtil.hasClass(a.layout.arrow, "m-dropdown__arrow--right") ? "right" : "left",
						o = 0;
					a.layout.arrow && (mUtil.isInResponsiveRange("mobile") && mUtil.hasClass(n, "m-dropdown--mobile-full-width") ? (o = mUtil.offset(n).left + t / 2 - Math.abs(parseInt(mUtil.css(a.layout.arrow, "width")) / 2) - parseInt(mUtil.css(a.layout.wrapper, "left")), mUtil.css(a.layout.arrow, "right", "auto"), mUtil.css(a.layout.arrow, "left", o + "px"), mUtil.css(a.layout.arrow, "margin-left", "auto"), mUtil.css(a.layout.arrow, "margin-right", "auto")) : mUtil.hasClass(a.layout.arrow, "m-dropdown__arrow--adjust") && (o = t / 2 - Math.abs(parseInt(mUtil.css(a.layout.arrow, "width")) / 2), mUtil.hasClass(n, "m-dropdown--align-push") && (o += 20), "right" == e ? mUtil.isRTL() ? (mUtil.css(a.layout.arrow, "right", "auto"), mUtil.css(a.layout.arrow, "left", o + "px")) : (mUtil.css(a.layout.arrow, "left", "auto"), mUtil.css(a.layout.arrow, "right", o + "px")) : mUtil.isRTL() ? (mUtil.css(a.layout.arrow, "left", "auto"), mUtil.css(a.layout.arrow, "right", o + "px")) : (mUtil.css(a.layout.arrow, "right", "auto"), mUtil.css(a.layout.arrow, "left", o + "px"))))
				},
				setZindex: function() {
					var t = 101,
						e = mUtil.getHighestZindex(n);
					e >= t && (t = e + 1), mUtil.css(a.layout.wrapper, "z-index", t)
				},
				isPersistent: function() {
					return a.options.persistent
				},
				isShown: function() {
					return a.open
				},
				eventTrigger: function(t, e) {
					for(var n = 0; n < a.events.length; n++) {
						var o = a.events[n];
						o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0, o.handler.call(this, a, e)) : o.handler.call(this, a, e))
					}
				},
				addEvent: function(t, e, n) {
					a.events.push({
						name: t,
						handler: e,
						one: n,
						fired: !1
					})
				}
			};
		return a.setDefaults = function(t) {
			i = t
		}, a.show = function() {
			return l.show()
		}, a.hide = function() {
			return l.hide()
		}, a.toggle = function() {
			return l.toggle()
		}, a.isPersistent = function() {
			return l.isPersistent()
		}, a.isShown = function() {
			return l.isShown()
		}, a.setContent = function(t) {
			return l.setContent(t)
		}, a.on = function(t, e) {
			return l.addEvent(t, e)
		}, a.one = function(t, e) {
			return l.addEvent(t, e, !0)
		}, l.construct.apply(a, [e]), !0, a
	}
};
mUtil.on(document, '[m-dropdown-toggle="click"] .m-dropdown__toggle', "click", function(t) {
	var e = this.closest(".m-dropdown");
	e && ((mUtil.data(e).has("dropdown") ? mUtil.data(e).get("dropdown") : new mDropdown(e)).toggle(), t.preventDefault())
}), mUtil.on(document, '[m-dropdown-toggle="hover"] .m-dropdown__toggle', "click", function(t) {
	if(mUtil.isDesktopDevice()) "#" == mUtil.attr(this, "href") && t.preventDefault();
	else if(mUtil.isMobileDevice()) {
		var e = this.closest(".m-dropdown");
		e && ((mUtil.data(e).has("dropdown") ? mUtil.data(e).get("dropdown") : new mDropdown(e)).toggle(), t.preventDefault())
	}
}), mUtil.on(document, '[m-dropdown-toggle="hover"]', "mouseover", function(t) {
	if(mUtil.isDesktopDevice()) {
		this && ((mUtil.data(this).has("dropdown") ? mUtil.data(this).get("dropdown") : new mDropdown(this)).show(), t.preventDefault())
	}
}), document.addEventListener("click", function(t) {
	var e, a = mUtil.get("body"),
		n = t.target;
	if(e = a.querySelectorAll(".m-dropdown.m-dropdown--open"))
		for(var o = 0, i = e.length; o < i; o++) {
			var l = e[o];
			if(!1 === mUtil.data(l).has("dropdown")) return;
			var r = mUtil.data(l).get("dropdown"),
				s = mUtil.find(l, ".m-dropdown__toggle");
			mUtil.hasClass(l, "m-dropdown--disable-close") && (t.preventDefault(), t.stopPropagation()), s && n !== s && !1 === s.contains(n) && !1 === n.contains(s) ? !1 === l.contains(n) && (r.isPersistent(), r.hide()) : !1 === l.contains(n) && r.hide()
		}
});
var mHeader = function(t, e) {
		var a = this,
			n = mUtil.get(t),
			o = mUtil.get("body");
		if(void 0 !== n) {
			var i = {
					classic: !1,
					offset: {
						mobile: 150,
						desktop: 200
					},
					minimize: {
						mobile: !1,
						desktop: !1
					}
				},
				l = {
					construct: function(t) {
						return mUtil.data(n).has("header") ? a = mUtil.data(n).get("header") : (l.init(t), l.build(), mUtil.data(n).set("header", a)), a
					},
					init: function(t) {
						a.events = [], a.options = mUtil.deepExtend({}, i, t)
					},
					build: function() {
						var t = 0;
						!1 === a.options.minimize.mobile && !1 === a.options.minimize.desktop || window.addEventListener("scroll", function() {
							var e, n, i, l = 0;
							mUtil.isInResponsiveRange("desktop") ? (l = a.options.offset.desktop, e = a.options.minimize.desktop.on, n = a.options.minimize.desktop.off) : mUtil.isInResponsiveRange("tablet-and-mobile") && (l = a.options.offset.mobile, e = a.options.minimize.mobile.on, n = a.options.minimize.mobile.off), i = window.pageYOffset, mUtil.isInResponsiveRange("tablet-and-mobile") && a.options.classic && a.options.classic.mobile || mUtil.isInResponsiveRange("desktop") && a.options.classic && a.options.classic.desktop ? i > l ? (mUtil.addClass(o, e), mUtil.removeClass(o, n)) : (mUtil.addClass(o, n), mUtil.removeClass(o, e)) : (i > l && t < i ? (mUtil.addClass(o, e), mUtil.removeClass(o, n)) : (mUtil.addClass(o, n), mUtil.removeClass(o, e)), t = i)
						})
					},
					eventTrigger: function(t, e) {
						for(var n = 0; n < a.events.length; n++) {
							var o = a.events[n];
							o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0, o.handler.call(this, a, e)) : o.handler.call(this, a, e))
						}
					},
					addEvent: function(t, e, n) {
						a.events.push({
							name: t,
							handler: e,
							one: n,
							fired: !1
						})
					}
				};
			return a.setDefaults = function(t) {
				i = t
			}, a.on = function(t, e) {
				return l.addEvent(t, e)
			}, l.construct.apply(a, [e]), !0, a
		}
	},
	mMenu = function(t, e) {
		var a = this,
			n = !1,
			o = mUtil.get(t),
			i = mUtil.get("body");
		if(o) {
			var l = {
					accordion: {
						slideSpeed: 200,
						autoScroll: !1,
						autoScrollSpeed: 1200,
						expandAll: !0
					},
					dropdown: {
						timeout: 500
					}
				},
				r = {
					construct: function(t) {
						return mUtil.data(o).has("menu") ? a = mUtil.data(o).get("menu") : (r.init(t), r.reset(), r.build(), mUtil.data(o).set("menu", a)), a
					},
					init: function(t) {
						a.events = [], a.eventHandlers = {}, a.options = mUtil.deepExtend({}, l, t), a.pauseDropdownHoverTime = 0, a.uid = mUtil.getUniqueID()
					},
					update: function(t) {
						a.options = mUtil.deepExtend({}, l, t), a.pauseDropdownHoverTime = 0, r.reset(), a.eventHandlers = {}, r.build(), mUtil.data(o).set("menu", a)
					},
					reload: function() {
						r.reset(), r.build()
					},
					build: function() {
						a.eventHandlers.event_1 = mUtil.on(o, ".m-menu__toggle", "click", r.handleSubmenuAccordion), ("dropdown" === r.getSubmenuMode() || r.isConditionalSubmenuDropdown()) && (a.eventHandlers.event_2 = mUtil.on(o, '[m-menu-submenu-toggle="hover"]', "mouseover", r.handleSubmenuDrodownHoverEnter), a.eventHandlers.event_3 = mUtil.on(o, '[m-menu-submenu-toggle="hover"]', "mouseout", r.handleSubmenuDrodownHoverExit), a.eventHandlers.event_4 = mUtil.on(o, '[m-menu-submenu-toggle="click"] > .m-menu__toggle, [m-menu-submenu-toggle="click"] > .m-menu__link .m-menu__toggle', "click", r.handleSubmenuDropdownClick), a.eventHandlers.event_5 = mUtil.on(o, '[m-menu-submenu-toggle="tab"] > .m-menu__toggle, [m-menu-submenu-toggle="tab"] > .m-menu__link .m-menu__toggle', "click", r.handleSubmenuDropdownTabClick)), a.eventHandlers.event_6 = mUtil.on(o, ".m-menu__item:not(.m-menu__item--submenu) > .m-menu__link:not(.m-menu__toggle):not(.m-menu__link--toggle-skip)", "click", r.handleLinkClick), a.options.scroll && a.options.scroll.height && r.scrollerInit()
					},
					reset: function() {
						mUtil.off(o, "click", a.eventHandlers.event_1), mUtil.off(o, "mouseover", a.eventHandlers.event_2), mUtil.off(o, "mouseout", a.eventHandlers.event_3), mUtil.off(o, "click", a.eventHandlers.event_4), mUtil.off(o, "click", a.eventHandlers.event_5), mUtil.off(o, "click", a.eventHandlers.event_6)
					},
					scrollerInit: function() {
						a.options.scroll && a.options.scroll.height && (mUtil.scrollerDestroy(o), mUtil.scrollerInit(o, {
							disableForMobile: !0,
							resetHeightOnDestroy: !0,
							handleWindowResize: !0,
							height: a.options.scroll.height
						}))
					},
					scrollerUpdate: function() {
						a.options.scroll && a.options.scroll.height ? mUtil.scrollerUpdate(o) : mUtil.scrollerDestroy(o)
					},
					scrollerTop: function() {
						a.options.scroll && a.options.scroll.height && mUtil.scrollerTop(o)
					},
					getSubmenuMode: function(t) {
						return mUtil.isInResponsiveRange("desktop") ? t && mUtil.hasAttr(t, "m-menu-submenu-toggle") ? mUtil.attr(t, "m-menu-submenu-toggle") : mUtil.isset(a.options.submenu, "desktop.state.body") ? mUtil.hasClass(i, a.options.submenu.desktop.state.body) ? a.options.submenu.desktop.state.mode : a.options.submenu.desktop.default : mUtil.isset(a.options.submenu, "desktop") ? a.options.submenu.desktop : void 0 : mUtil.isInResponsiveRange("tablet") && mUtil.isset(a.options.submenu, "tablet") ? a.options.submenu.tablet : !(!mUtil.isInResponsiveRange("mobile") || !mUtil.isset(a.options.submenu, "mobile")) && a.options.submenu.mobile
					},
					isConditionalSubmenuDropdown: function() {
						return !(!mUtil.isInResponsiveRange("desktop") || !mUtil.isset(a.options.submenu, "desktop.state.body"))
					},
					handleLinkClick: function(t) {
						!1 === r.eventTrigger("linkClick", this) && t.preventDefault(), ("dropdown" === r.getSubmenuMode(this) || r.isConditionalSubmenuDropdown()) && r.handleSubmenuDropdownClose(t, this)
					},
					handleSubmenuDrodownHoverEnter: function(t) {
						if("accordion" !== r.getSubmenuMode(this) && !1 !== a.resumeDropdownHover()) {
							"1" == this.getAttribute("data-hover") && (this.removeAttribute("data-hover"), clearTimeout(this.getAttribute("data-timeout")), this.removeAttribute("data-timeout")), r.showSubmenuDropdown(this)
						}
					},
					handleSubmenuDrodownHoverExit: function(t) {
						if(!1 !== a.resumeDropdownHover() && "accordion" !== r.getSubmenuMode(this)) {
							var e = this,
								n = a.options.dropdown.timeout,
								o = setTimeout(function() {
									"1" == e.getAttribute("data-hover") && r.hideSubmenuDropdown(e, !0)
								}, n);
							e.setAttribute("data-hover", "1"), e.setAttribute("data-timeout", o)
						}
					},
					handleSubmenuDropdownClick: function(t) {
						if("accordion" !== r.getSubmenuMode(this)) {
							var e = this.closest(".m-menu__item");
							"accordion" != e.getAttribute("m-menu-submenu-mode") && (!1 === mUtil.hasClass(e, "m-menu__item--hover") ? (mUtil.addClass(e, "m-menu__item--open-dropdown"), r.showSubmenuDropdown(e)) : (mUtil.removeClass(e, "m-menu__item--open-dropdown"), r.hideSubmenuDropdown(e, !0)), t.preventDefault())
						}
					},
					handleSubmenuDropdownTabClick: function(t) {
						if("accordion" !== r.getSubmenuMode(this)) {
							var e = this.closest(".m-menu__item");
							"accordion" != e.getAttribute("m-menu-submenu-mode") && (0 == mUtil.hasClass(e, "m-menu__item--hover") && (mUtil.addClass(e, "m-menu__item--open-dropdown"), r.showSubmenuDropdown(e)), t.preventDefault())
						}
					},
					handleSubmenuDropdownClose: function(t, e) {
						if("accordion" !== r.getSubmenuMode(e)) {
							var a = o.querySelectorAll(".m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)");
							if(a.length > 0 && !1 === mUtil.hasClass(e, "m-menu__toggle") && 0 === e.querySelectorAll(".m-menu__toggle").length)
								for(var n = 0, i = a.length; n < i; n++) r.hideSubmenuDropdown(a[0], !0)
						}
					},
					handleSubmenuAccordion: function(t, e) {
						var n, o = e || this;
						if("dropdown" === r.getSubmenuMode(e) && (n = o.closest(".m-menu__item")) && "accordion" != n.getAttribute("m-menu-submenu-mode")) t.preventDefault();
						else {
							var i = o.closest(".m-menu__item"),
								l = mUtil.child(i, ".m-menu__submenu, .m-menu__inner");
							if(!mUtil.hasClass(o.closest(".m-menu__item"), "m-menu__item--open-always") && i && l) {
								t.preventDefault();
								var s = a.options.accordion.slideSpeed;
								if(!1 === mUtil.hasClass(i, "m-menu__item--open")) {
									if(!1 === a.options.accordion.expandAll) {
										var d = o.closest(".m-menu__nav, .m-menu__subnav"),
											c = mUtil.children(d, ".m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded):not(.m-menu__item--open-always)");
										if(d && c)
											for(var m = 0, u = c.length; m < u; m++) {
												var p = c[0],
													f = mUtil.child(p, ".m-menu__submenu");
												f && mUtil.slideUp(f, s, function() {
													r.scrollerUpdate(), mUtil.removeClass(p, "m-menu__item--open")
												})
											}
									}
									mUtil.slideDown(l, s, function() {
										r.scrollToItem(o), r.scrollerUpdate(), r.eventTrigger("submenuToggle", l)
									}), mUtil.addClass(i, "m-menu__item--open")
								} else mUtil.slideUp(l, s, function() {
									r.scrollToItem(o), r.eventTrigger("submenuToggle", l)
								}), mUtil.removeClass(i, "m-menu__item--open")
							}
						}
					},
					scrollToItem: function(t) {
						mUtil.isInResponsiveRange("desktop") && a.options.accordion.autoScroll && "1" !== o.getAttribute("m-menu-scrollable") && mUtil.scrollTo(t, a.options.accordion.autoScrollSpeed)
					},
					hideSubmenuDropdown: function(t, e) {
						e && (mUtil.removeClass(t, "m-menu__item--hover"), mUtil.removeClass(t, "m-menu__item--active-tab")), t.removeAttribute("data-hover"), t.getAttribute("m-menu-dropdown-toggle-class") && mUtil.removeClass(i, t.getAttribute("m-menu-dropdown-toggle-class"));
						var a = t.getAttribute("data-timeout");
						t.removeAttribute("data-timeout"), clearTimeout(a)
					},
					showSubmenuDropdown: function(t) {
						var e = o.querySelectorAll(".m-menu__item--submenu.m-menu__item--hover, .m-menu__item--submenu.m-menu__item--active-tab");
						if(e)
							for(var a = 0, n = e.length; a < n; a++) {
								var l = e[a];
								t !== l && !1 === l.contains(t) && !1 === t.contains(l) && r.hideSubmenuDropdown(l, !0)
							}
						r.adjustSubmenuDropdownArrowPos(t), mUtil.addClass(t, "m-menu__item--hover"), t.getAttribute("m-menu-dropdown-toggle-class") && mUtil.addClass(i, t.getAttribute("m-menu-dropdown-toggle-class"))
					},
					createSubmenuDropdownClickDropoff: function(t) {
						var e, a = (e = mUtil.child(t, ".m-menu__submenu") ? mUtil.css(e, "z-index") : 0) - 1,
							n = document.createElement('<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + a + '"></div>');
						i.appendChild(n), mUtil.addEvent(n, "click", function(e) {
							e.stopPropagation(), e.preventDefault(), mUtil.remove(this), r.hideSubmenuDropdown(t, !0)
						})
					},
					adjustSubmenuDropdownArrowPos: function(t) {
						var e = mUtil.child(t, ".m-menu__submenu"),
							a = mUtil.child(e, ".m-menu__arrow.m-menu__arrow--adjust");
						mUtil.child(e, ".m-menu__subnav");
						if(a) {
							var n = 0;
							mUtil.child(t, ".m-menu__link");
							mUtil.hasClass(e, "m-menu__submenu--classic") || mUtil.hasClass(e, "m-menu__submenu--fixed") ? (mUtil.hasClass(e, "m-menu__submenu--right") ? (n = mUtil.outerWidth(t) / 2, mUtil.hasClass(e, "m-menu__submenu--pull") && (mUtil.isRTL() ? n += Math.abs(parseFloat(mUtil.css(e, "margin-left"))) : n += Math.abs(parseFloat(mUtil.css(e, "margin-right")))), n = parseInt(mUtil.css(e, "width")) - n) : mUtil.hasClass(e, "m-menu__submenu--left") && (n = mUtil.outerWidth(t) / 2, mUtil.hasClass(e, "m-menu__submenu--pull") && (mUtil.isRTL() ? n += Math.abs(parseFloat(mUtil.css(e, "margin-right"))) : n += Math.abs(parseFloat(mUtil.css(e, "margin-left"))))), mUtil.isRTL() ? mUtil.css(a, "right", n + "px") : mUtil.css(a, "left", n + "px")) : (mUtil.hasClass(e, "m-menu__submenu--center") || mUtil.hasClass(e, "m-menu__submenu--full")) && (n = mUtil.offset(t).left - (mUtil.getViewPort().width - parseInt(mUtil.css(e, "width"))) / 2, n += mUtil.outerWidth(t) / 2, mUtil.css(a, "left", n + "px"), mUtil.isRTL() && mUtil.css(a, "right", "auto"))
						}
					},
					pauseDropdownHover: function(t) {
						var e = new Date;
						a.pauseDropdownHoverTime = e.getTime() + t
					},
					resumeDropdownHover: function() {
						return(new Date).getTime() > a.pauseDropdownHoverTime
					},
					resetActiveItem: function(t) {
						for(var e, n, i = 0, l = (e = o.querySelectorAll(".m-menu__item--active")).length; i < l; i++) {
							var r = e[0];
							mUtil.removeClass(r, "m-menu__item--active"), mUtil.hide(mUtil.child(r, ".m-menu__submenu"));
							for(var s = 0, d = (n = mUtil.parents(r, ".m-menu__item--submenu")).length; s < d; s++) {
								var c = n[i];
								mUtil.removeClass(c, "m-menu__item--open"), mUtil.hide(mUtil.child(c, ".m-menu__submenu"))
							}
						}
						if(!1 === a.options.accordion.expandAll && (e = o.querySelectorAll(".m-menu__item--open")))
							for(i = 0, l = e.length; i < l; i++) mUtil.removeClass(n[0], "m-menu__item--open")
					},
					setActiveItem: function(t) {
						r.resetActiveItem(), mUtil.addClass(t, "m-menu__item--active");
						for(var e = mUtil.parents(t, ".m-menu__item--submenu"), a = 0, n = e.length; a < n; a++) mUtil.addClass(e[a], "m-menu__item--open")
					},
					getBreadcrumbs: function(t) {
						var e, a = [],
							n = mUtil.child(t, ".m-menu__link");
						a.push({
							text: e = mUtil.child(n, ".m-menu__link-text") ? e.innerHTML : "",
							title: n.getAttribute("title"),
							href: n.getAttribute("href")
						});
						for(var o = mUtil.parents(t, ".m-menu__item--submenu"), i = 0, l = o.length; i < l; i++) {
							var r = mUtil.child(o[i], ".m-menu__link");
							a.push({
								text: e = mUtil.child(r, ".m-menu__link-text") ? e.innerHTML : "",
								title: r.getAttribute("title"),
								href: r.getAttribute("href")
							})
						}
						return a.reverse()
					},
					getPageTitle: function(t) {
						var e;
						return mUtil.child(t, ".m-menu__link-text") ? e.innerHTML : ""
					},
					eventTrigger: function(t, e) {
						for(var n = 0; n < a.events.length; n++) {
							var o = a.events[n];
							o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0, o.handler.call(this, a, e)) : o.handler.call(this, a, e))
						}
					},
					addEvent: function(t, e, n) {
						a.events.push({
							name: t,
							handler: e,
							one: n,
							fired: !1
						})
					},
					removeEvent: function(t) {
						a.events[t] && delete a.events[t]
					}
				};
			return a.setDefaults = function(t) {
				l = t
			}, a.scrollerUpdate = function() {
				return r.scrollerUpdate()
			}, a.scrollerTop = function() {
				return r.scrollerTop()
			}, a.setActiveItem = function(t) {
				return r.setActiveItem(t)
			}, a.reload = function() {
				return r.reload()
			}, a.update = function(t) {
				return r.update(t)
			}, a.getBreadcrumbs = function(t) {
				return r.getBreadcrumbs(t)
			}, a.getPageTitle = function(t) {
				return r.getPageTitle(t)
			}, a.getSubmenuMode = function(t) {
				return r.getSubmenuMode(t)
			}, a.hideDropdown = function(t) {
				r.hideSubmenuDropdown(t, !0)
			}, a.pauseDropdownHover = function(t) {
				r.pauseDropdownHover(t)
			}, a.resumeDropdownHover = function() {
				return r.resumeDropdownHover()
			}, a.on = function(t, e) {
				return r.addEvent(t, e)
			}, a.off = function(t) {
				return r.removeEvent(t)
			}, a.one = function(t, e) {
				return r.addEvent(t, e, !0)
			}, r.construct.apply(a, [e]), mUtil.addResizeHandler(function() {
				n && a.reload()
			}), n = !0, a
		}
	};
document.addEventListener("click", function(t) {
	var e;
	if(e = mUtil.get("body").querySelectorAll('.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]'))
		for(var a = 0, n = e.length; a < n; a++) {
			var o = e[a].closest(".m-menu__nav").parentNode;
			if(o) {
				var i, l = mUtil.data(o).get("menu");
				if(!l) break;
				if(!l || "dropdown" !== l.getSubmenuMode()) break;
				if(t.target !== o && !1 === o.contains(t.target))
					if(i = o.querySelectorAll('.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]'))
						for(var r = 0, s = i.length; r < s; r++) l.hideDropdown(i[r])
			}
		}
});
var mOffcanvas = function(t, e) {
		var a = this,
			n = mUtil.get(t),
			o = mUtil.get("body");
		if(n) {
			var i = {},
				l = {
					construct: function(t) {
						return mUtil.data(n).has("offcanvas") ? a = mUtil.data(n).get("offcanvas") : (l.init(t), l.build(), mUtil.data(n).set("offcanvas", a)), a
					},
					init: function(t) {
						a.events = [], a.options = mUtil.deepExtend({}, i, t), a.overlay, a.classBase = a.options.baseClass, a.classShown = a.classBase + "--on", a.classOverlay = a.classBase + "-overlay", a.state = mUtil.hasClass(n, a.classShown) ? "shown" : "hidden"
					},
					build: function() {
						if(a.options.toggleBy)
							if("string" == typeof a.options.toggleBy) mUtil.addEvent(a.options.toggleBy, "click", l.toggle);
							else if(a.options.toggleBy && a.options.toggleBy[0] && a.options.toggleBy[0].target)
							for(var t in a.options.toggleBy) mUtil.addEvent(a.options.toggleBy[t].target, "click", l.toggle);
						else a.options.toggleBy && a.options.toggleBy.target && mUtil.addEvent(a.options.toggleBy.target, "click", l.toggle);
						var e = mUtil.get(a.options.closeBy);
						e && mUtil.addEvent(e, "click", l.hide)
					},
					toggle: function() {
						l.eventTrigger("toggle"), "shown" == a.state ? l.hide(this) : l.show(this)
					},
					show: function(t) {
						"shown" != a.state && (l.eventTrigger("beforeShow"), l.togglerClass(t, "show"), mUtil.addClass(o, a.classShown), mUtil.addClass(n, a.classShown), a.state = "shown", a.options.overlay && (a.overlay = mUtil.insertAfter(document.createElement("DIV"), n), mUtil.addClass(a.overlay, a.classOverlay), mUtil.addEvent(a.overlay, "click", function(e) {
							e.stopPropagation(), e.preventDefault(), l.hide(t)
						})), l.eventTrigger("afterShow"))
					},
					hide: function(t) {
						"hidden" != a.state && (l.eventTrigger("beforeHide"), l.togglerClass(t, "hide"), mUtil.removeClass(o, a.classShown), mUtil.removeClass(n, a.classShown), a.state = "hidden", a.options.overlay && a.overlay && mUtil.remove(a.overlay), l.eventTrigger("afterHide"))
					},
					togglerClass: function(t, e) {
						var n, o = mUtil.attr(t, "id");
						if(a.options.toggleBy && a.options.toggleBy[0] && a.options.toggleBy[0].target)
							for(var i in a.options.toggleBy) a.options.toggleBy[i].target === o && (n = a.options.toggleBy[i]);
						else a.options.toggleBy && a.options.toggleBy.target && (n = a.options.toggleBy);
						if(n) {
							var l = mUtil.get(n.target);
							"show" === e && mUtil.addClass(l, n.state), "hide" === e && mUtil.removeClass(l, n.state)
						}
					},
					eventTrigger: function(t, e) {
						for(var n = 0; n < a.events.length; n++) {
							var o = a.events[n];
							o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0, o.handler.call(this, a, e)) : o.handler.call(this, a, e))
						}
					},
					addEvent: function(t, e, n) {
						a.events.push({
							name: t,
							handler: e,
							one: n,
							fired: !1
						})
					}
				};
			return a.setDefaults = function(t) {
				i = t
			}, a.hide = function() {
				return l.hide()
			}, a.show = function() {
				return l.show()
			}, a.on = function(t, e) {
				return l.addEvent(t, e)
			}, a.one = function(t, e) {
				return l.addEvent(t, e, !0)
			}, l.construct.apply(a, [e]), !0, a
		}
	},
	mQuicksearch = function(t, e) {
		var a = this,
			n = mUtil.get(t),
			o = mUtil.get("body");
		if(n) {
			var l = {
					mode: "default",
					minLength: 1,
					maxHeight: 300,
					requestTimeout: 200,
					inputTarget: "m_quicksearch_input",
					iconCloseTarget: "m_quicksearch_close",
					iconCancelTarget: "m_quicksearch_cancel",
					iconSearchTarget: "m_quicksearch_search",
					spinnerClass: "m-loader m-loader--skin-light m-loader--right",
					hasResultClass: "m-list-search--has-result",
					templates: {
						error: '<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">{{message}}</div></div>'
					}
				},
				r = {
					construct: function(t) {
						return mUtil.data(n).has("quicksearch") ? a = mUtil.data(n).get("quicksearch") : (r.init(t), r.build(), mUtil.data(n).set("quicksearch", a)), a
					},
					init: function(t) {
						a.element = n, a.events = [], a.options = mUtil.deepExtend({}, l, t), a.query = "", a.form = mUtil.find(n, "form"), a.input = mUtil.get(a.options.inputTarget), a.iconClose = mUtil.get(a.options.iconCloseTarget), "default" == a.options.mode && (a.iconSearch = mUtil.get(a.options.iconSearchTarget), a.iconCancel = mUtil.get(a.options.iconCancelTarget)), a.dropdown = new mDropdown(n, {
							mobileOverlay: !1
						}), a.cancelTimeout, a.processing = !1, a.requestTimeout = !1
					},
					build: function() {
						mUtil.addEvent(a.input, "keyup", r.search), "default" == a.options.mode ? (mUtil.addEvent(a.input, "focus", r.showDropdown), mUtil.addEvent(a.iconCancel, "click", r.handleCancel), mUtil.addEvent(a.iconSearch, "click", function() {
							mUtil.isInResponsiveRange("tablet-and-mobile") && (mUtil.addClass(o, "m-header-search--mobile-expanded"), a.input.focus())
						}), mUtil.addEvent(a.iconClose, "click", function() {
							mUtil.isInResponsiveRange("tablet-and-mobile") && (mUtil.removeClass(o, "m-header-search--mobile-expanded"), r.closeDropdown())
						})) : "dropdown" == a.options.mode && (a.dropdown.on("afterShow", function() {
							a.input.focus()
						}), mUtil.addEvent(a.iconClose, "click", r.closeDropdown))
					},
					showProgress: function() {
						return a.processing = !0, mUtil.addClass(a.form, a.options.spinnerClass), r.handleCancelIconVisibility("off"), a
					},
					hideProgress: function() {
						return a.processing = !1, mUtil.removeClass(a.form, a.options.spinnerClass), r.handleCancelIconVisibility("on"), mUtil.addClass(n, a.options.hasResultClass), a
					},
					search: function(t) {
						if(a.query = a.input.value, 0 === a.query.length && (r.handleCancelIconVisibility("on"), mUtil.removeClass(n, a.options.hasResultClass), mUtil.removeClass(a.form, a.options.spinnerClass)), !(a.query.length < a.options.minLength || 1 == a.processing)) return a.requestTimeout && clearTimeout(a.requestTimeout), a.requestTimeout = !1, a.requestTimeout = setTimeout(function() {
							r.eventTrigger("search")
						}, a.options.requestTimeout), a
					},
					handleCancelIconVisibility: function(t) {
						"on" == t ? 0 === a.input.value.length ? (a.iconCancel && mUtil.css(a.iconCancel, "visibility", "hidden"), a.iconClose && mUtil.css(a.iconClose, "visibility", "visible")) : (clearTimeout(a.cancelTimeout), a.cancelTimeout = setTimeout(function() {
							a.iconCancel && mUtil.css(a.iconCancel, "visibility", "visible"), a.iconClose && mUtil.css(a.iconClose, "visibility", "visible")
						}, 500)) : (a.iconCancel && mUtil.css(a.iconCancel, "visibility", "hidden"), a.iconClose && mUtil.css(a.iconClose, "visibility", "hidden"))
					},
					handleCancel: function(t) {
						a.input.value = "", mUtil.css(a.iconCancel, "visibility", "hidden"), mUtil.removeClass(n, a.options.hasResultClass), r.closeDropdown()
					},
					closeDropdown: function() {
						a.dropdown.hide()
					},
					showDropdown: function(t) {
						0 == a.dropdown.isShown() && a.input.value.length > a.options.minLength && 0 == a.processing && (console.log("show!!!"), a.dropdown.show(), t && (t.preventDefault(), t.stopPropagation()))
					},
					eventTrigger: function(t) {
						for(i = 0; i < a.events.length; i++) {
							var e = a.events[i];
							e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0, e.handler.call(this, a)) : e.handler.call(this, a))
						}
					}
				};
			return a.setDefaults = function(t) {
				l = t
			}, a.search = function() {
				return r.handleSearch()
			}, a.showResult = function(t) {
				return a.dropdown.setContent(t), r.showDropdown(), a
			}, a.showError = function(t) {
				var e = a.options.templates.error.replace("{{message}}", t);
				return a.dropdown.setContent(e), r.showDropdown(), a
			}, a.showProgress = function() {
				return r.showProgress()
			}, a.hideProgress = function() {
				return r.hideProgress()
			}, a.search = function() {
				return r.search()
			}, a.on = function(t, e) {
				return r.addEvent(t, e)
			}, a.one = function(t, e) {
				return r.addEvent(t, e, !0)
			}, r.construct.apply(a, [e]), a
		}
	},
	mToggle = function(t, e) {
		var a = this,
			n = mUtil.get(t);
		mUtil.get("body");
		if(n) {
			var o = {
					togglerState: "",
					targetState: ""
				},
				l = {
					construct: function(t) {
						return mUtil.data(n).has("toggle") ? a = mUtil.data(n).get("toggle") : (l.init(t), l.build(), mUtil.data(n).set("toggle", a)), a
					},
					init: function(t) {
						a.element = n, a.events = [], a.options = mUtil.deepExtend({}, o, t), a.target = mUtil.get(a.options.target), a.targetState = a.options.targetState, a.togglerState = a.options.togglerState, a.state = mUtil.hasClasses(a.target, a.targetState) ? "on" : "off"
					},
					build: function() {
						mUtil.addEvent(n, "mouseup", l.toggle)
					},
					toggle: function() {
						return l.eventTrigger("beforeToggle"), "off" == a.state ? l.toggleOn() : l.toggleOff(), a
					},
					toggleOn: function() {
						return l.eventTrigger("beforeOn"), mUtil.addClass(a.target, a.targetState), a.togglerState && mUtil.addClass(n, a.togglerState), a.state = "on", l.eventTrigger("afterOn"), l.eventTrigger("toggle"), a
					},
					toggleOff: function() {
						return l.eventTrigger("beforeOff"), mUtil.removeClass(a.target, a.targetState), a.togglerState && mUtil.removeClass(n, a.togglerState), a.state = "off", l.eventTrigger("afterOff"), l.eventTrigger("toggle"), a
					},
					eventTrigger: function(t) {
						for(i = 0; i < a.events.length; i++) {
							var e = a.events[i];
							e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0, e.handler.call(this, a)) : e.handler.call(this, a))
						}
					},
					addEvent: function(t, e, n) {
						return a.events.push({
							name: t,
							handler: e,
							one: n,
							fired: !1
						}), a
					}
				};
			return a.setDefaults = function(t) {
				o = t
			}, a.getState = function() {
				return a.state
			}, a.toggle = function() {
				return l.toggle()
			}, a.toggleOn = function() {
				return l.toggleOn()
			}, a.toggle = function() {
				return l.toggleOff()
			}, a.on = function(t, e) {
				return l.addEvent(t, e)
			}, a.one = function(t, e) {
				return l.addEvent(t, e, !0)
			}, l.construct.apply(a, [e]), a
		}
	},
	mScrollTop = function(t, e) {
		var a = this,
			n = mUtil.get(t),
			o = mUtil.get("body");
		if(n) {
			var i = {
					offset: 300,
					speed: 600
				},
				l = {
					construct: function(t) {
						return mUtil.data(n).has("scrolltop") ? a = mUtil.data(n).get("scrolltop") : (l.init(t), l.build(), mUtil.data(n).set("scrolltop", a)), a
					},
					init: function(t) {
						a.events = [], a.options = mUtil.deepExtend({}, i, t)
					},
					build: function() {
						navigator.userAgent.match(/iPhone|iPad|iPod/i) ? (window.addEventListener("touchend", function() {
							l.handle()
						}), window.addEventListener("touchcancel", function() {
							l.handle()
						}), window.addEventListener("touchleave", function() {
							l.handle()
						})) : window.addEventListener("scroll", function() {
							l.handle()
						}), mUtil.addEvent(n, "click", l.scroll)
					},
					handle: function() {
						window.pageYOffset > a.options.offset ? mUtil.addClass(o, "m-scroll-top--shown") : mUtil.removeClass(o, "m-scroll-top--shown")
					},
					scroll: function(t) {
						t.preventDefault(), mUtil.scrollTop(0, a.options.speed)
					},
					eventTrigger: function(t, e) {
						for(var n = 0; n < a.events.length; n++) {
							var o = a.events[n];
							o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0, o.handler.call(this, a, e)) : o.handler.call(this, a, e))
						}
					},
					addEvent: function(t, e, n) {
						a.events.push({
							name: t,
							handler: e,
							one: n,
							fired: !1
						})
					}
				};
			return a.setDefaults = function(t) {
				i = t
			}, a.on = function(t, e) {
				return l.addEvent(t, e)
			}, a.one = function(t, e) {
				return l.addEvent(t, e, !0)
			}, l.construct.apply(a, [e]), !0, a
		}
	};
	
! function(t) {}(jQuery);
var mLayout = function() {
	var t, e, a, n, o, i, l = function() {
			0 !== $("#m_aside_left_hide_toggle").length && (l = new mToggle("m_aside_left_hide_toggle", {
				target: "body",
				targetState: "m-aside-left--hide",
				togglerState: "m-brand__toggler--active"
			})).on("toggle", function(a) {
				t.pauseDropdownHover(800), e.pauseDropdownHover(800), Cookies.set("sidebar_hide_state", a.getState())
			})
		},
		r = function() {
			return new mPortlet("main_portlet", {
				sticky: {
					offset: parseInt(mUtil.css(mUtil.get("m_header"), "height")),
					zIndex: 90,
					position: {
						top: function() {
							return parseInt(mUtil.css(mUtil.get("m_header"), "height"))
						},
						left: function() {
							var t = parseInt(mUtil.css(mUtil.getByClass("m-content"), "paddingLeft"));
							return mUtil.isInResponsiveRange("desktop") && (mUtil.hasClass(mUtil.get("body"), "m-aside-left--minimize") ? t += 78 : t += 255), t
						},
						right: function() {
							return parseInt(mUtil.css(mUtil.getByClass("m-content"), "paddingRight"))
						}
					}
				}
			})
		};
	return {
		init: function() {
			this.initHeader(), this.initAside(), this.initMainPortlet()
		},
		initMainPortlet: function() {
			mUtil.get("main_portlet") && ((i = r()).initSticky(), mUtil.addResizeHandler(function() {
				i.updateSticky()
			}))
		},
		resetMainPortlet: function() {
			i.destroySticky(), (i = r()).initSticky()
		},
		initHeader: function() {
			var e, a, o;
			a = mUtil.get("m_header"), o = {
				offset: {},
				minimize: {}
			}, "hide" == mUtil.attr(a, "m-minimize-mobile") ? (o.minimize.mobile = {}, o.minimize.mobile.on = "m-header--hide", o.minimize.mobile.off = "m-header--show") : o.minimize.mobile = !1, "hide" == mUtil.attr(a, "m-minimize") ? (o.minimize.desktop = {}, o.minimize.desktop.on = "m-header--hide", o.minimize.desktop.off = "m-header--show") : o.minimize.desktop = !1, (e = mUtil.attr(a, "m-minimize-offset")) && (o.offset.desktop = e), (e = mUtil.attr(a, "m-minimize-mobile-offset")) && (o.offset.mobile = e), new mHeader("m_header", o), n = new mOffcanvas("m_header_menu", {
				overlay: !0,
				baseClass: "m-aside-header-menu-mobile",
				closeBy: "m_aside_header_menu_mobile_close_btn",
				toggleBy: {
					target: "m_aside_header_menu_mobile_toggle",
					state: "m-brand__toggler--active"
				}
			}), t = new mMenu("m_header_menu", {
				submenu: {
					desktop: "dropdown",
					tablet: "accordion",
					mobile: "accordion"
				},
				accordion: {
					slideSpeed: 200,
					expandAll: !1
				}
			}), $("#m_aside_header_topbar_mobile_toggle").click(function() {
				$("body").toggleClass("m-topbar--on")
			}), new mScrollTop("m_scroll_top", {
				offset: 300,
				speed: 600
			})
		},
		initAside: function() {
			var n, r, s, d, c, m, u, p;
			s = mUtil.get("body"), d = mUtil.get("m_aside_left"), c = mUtil.hasClass(d, "m-aside-left--offcanvas-default") ? "m-aside-left--offcanvas-default" : "m-aside-left", a = new mOffcanvas("m_aside_left", {
				baseClass: c,
				overlay: !0,
				closeBy: "m_aside_left_close_btn",
				toggleBy: {
					target: "m_aside_left_offcanvas_toggle",
					state: "m-brand__toggler--active"
				}
			}), mUtil.hasClass(s, "m-aside-left--fixed") && (mUtil.addEvent(d, "mouseenter", function() {
				r && (clearTimeout(r), r = null), n = setTimeout(function() {
					mUtil.hasClass(s, "m-aside-left--minimize") && mUtil.isInResponsiveRange("desktop") && (mUtil.removeClass(s, "m-aside-left--minimize"), mUtil.addClass(s, "m-aside-left--minimize-hover"), e.scrollerUpdate(), e.scrollerTop())
				}, 300)
			}), mUtil.addEvent(d, "mouseleave", function() {
				n && (clearTimeout(n), n = null), r = setTimeout(function() {
					mUtil.hasClass(s, "m-aside-left--minimize-hover") && mUtil.isInResponsiveRange("desktop") && (mUtil.removeClass(s, "m-aside-left--minimize-hover"), mUtil.addClass(s, "m-aside-left--minimize"), e.scrollerUpdate(), e.scrollerTop())
				}, 500)
			})), u = mUtil.get("m_ver_menu"), p = "1" === mUtil.attr(u, "m-menu-dropdown") ? "dropdown" : "accordion", "1" === mUtil.attr(u, "m-menu-scrollable") && (m = {
				height: function() {
					if(mUtil.isInResponsiveRange("desktop")) return mUtil.getViewPort().height - parseInt(mUtil.css("m_header", "height"))
				}
			}), e = new mMenu("m_ver_menu", {
				scroll: m,
				submenu: {
					desktop: {
						default: p,
						state: {
							body: "m-aside-left--minimize",
							mode: "dropdown"
						}
					},
					tablet: "accordion",
					mobile: "accordion"
				},
				accordion: {
					autoScroll: !1,
					expandAll: !1
				}
			}), 0 !== $("#m_aside_left_minimize_toggle").length && ((o = new mToggle("m_aside_left_minimize_toggle", {
				target: "body",
				targetState: "m-brand--minimize m-aside-left--minimize",
				togglerState: "m-brand__toggler--active"
			})).on("toggle", function(a) {
				mUtil.get("main_portlet") && i.updateSticky(), t.pauseDropdownHover(800), e.pauseDropdownHover(800), Cookies.set("sidebar_toggle_state", a.getState())
			}), o.on("beforeToggle", function(t) {
				var e = mUtil.get("body");
				!1 === mUtil.hasClass(e, "m-aside-left--minimize") && mUtil.hasClass(e, "m-aside-left--minimize-hover") && mUtil.removeClass(e, "m-aside-left--minimize-hover")
			})), l(), this.onLeftSidebarToggle(function(t) {
				i && i.updateSticky();
				var e = $(".m-datatable");
				e && e.each(function() {
					$(this).mDatatable("redraw")
				})
			})
		},
		getAsideMenu: function() {
			return e
		},
		onLeftSidebarToggle: function(t) {
			o && o.on("toggle", t)
		},
		closeMobileAsideMenuOffcanvas: function() {
			mUtil.isMobileDevice() && a.hide()
		},
		closeMobileHorMenuOffcanvas: function() {
			mUtil.isMobileDevice() && n.hide()
		}
	}
}();
$(document).ready(function() {
	!1 === mUtil.isAngularVersion() && mLayout.init()
});
//var mQuickSidebar = function() {}();
//$(document).ready(function() {
//	mQuickSidebar.init()
//});