define("jobs/pc/frameLoginReg.js", ["../../components/units/pageJob", "../../qipaLogin/units/loginBase", "../../qipaLogin/units/normal", "../../qipaLogin/units/passLogin", "../../qipaLogin/units/thirdLogin", "../../qipaLogin/units/mobileRegist", "../../qipaLogin/units/setPwd", "../../qipaLogin/units/setUserInfo", "../../qipaLogin/units/loading"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = [e("../../qipaLogin/units/loginBase"), e("../../qipaLogin/units/normal"), e("../../qipaLogin/units/passLogin"), e("../../qipaLogin/units/thirdLogin"), e("../../qipaLogin/units/mobileRegist"), e("../../qipaLogin/units/setPwd"), e("../../qipaLogin/units/setUserInfo"), e("../../qipaLogin/units/loading")];
	a.forEach(function(e) {
			t.add(e)
		}),
		t.start()
});
define("components/units/pageJob", ["../action/job"], function(e, t, n) {
	var a = e("../action/job");
	n.exports = new a
});
define("components/action/job", ["../../config/config"], function(e, t, n) {
	var a = new Q.ic.InfoCenter({
			moduleName: "Job"
		}),
		i = e("../../config/config"),
		r = Q.event.customEvent,
		o = {};
	seajs.data.base + "units/";
	var l = Q.Class("Job", {
		construct: function() {
			this._oginjobs = [],
				this._asyncjobs = [],
				this._execjobs = [],
				this._execedjobs = []
		},
		methods: {
			create: function(e, t) {
				if(!t)
					throw new Error("Job.create : obj is null.");
				return o[e] || (o[e] = t),
					this
			},
			add: function(e, t) {
				var n = o[e];
				if(!n)
					return this;
				for(var a = 0; a < this._oginjobs.length; a++)
					if(n = this._oginjobs[a],
						n.name == e)
						return this;
				return this._oginjobs.push({
						name: e,
						param: t,
						object: o[e]
					}),
					this._execjobs = this._oginjobs.slice(0),
					this
			},
			reset: function() {
				this._execjobs = this._oginjobs.slice(0),
					this._execedjobs = []
			},
			clear: function() {
				this._oginjobs = [],
					this._execjobs = [],
					this._execedjobs = []
			},
			getJob: function(e) {
				return o[e]
			},
			load: function(e, t) {
				var n = this,
					a = n.getJob(e);
				return -1 === n._asyncjobs.indexOf(e) && (n._asyncjobs.push(e),
						n.add(e),
						n._startJob(e)),
					t && t.call(a, a),
					a
			},
			sync: function() {
				this.load.apply(this, arguments)
			},
			async: function(t, n) {
				var a = this;
				i.projectDebug;
				var r = "../../units/";
				i.projectDebug || (r = "../../" + i["units" + t.replace(/\//g, "_") + "Version"] + "/units/"),
					e.async(r + t, function(e) {
						a.sync(e, n)
					})
			},
			getJobs: function() {
				return this._oginjobs
			},
			check: function(e) {
				var t, n;
				try {
					e.getDependentDoms && (t = e.getDependentDoms()),
						n = e.check(t)
				} catch(a) {}
				return n === !0
			},
			start: function() {
				var e = this,
					t = [],
					n = e._execjobs,
					i = e._execedjobs,
					o = [],
					l = this.check,
					s = new Date;
				window.__qlt && window.__qlt.start && window.__qlt.start("jobCheckReady"),
					n = n.filter(function(e) {
						return e.passed = l(e.object),
							e.passed || a.warn("job[" + e.name + "] check failed!!!"),
							e.passed
					}),
					window.__qlt && window.__qlt.end && window.__qlt.end("jobCheckReady"),
					a.debug("Check all jobs in " + (new Date - s) + " ms"),
					s = new Date,
					n.forEach(function(e) {
						for(var n = 0; n < i.length; n++)
							if(e.name === i[n].name)
								return o.push(e.name),
									void 0;
						t.push(e)
					}),
					o.length > 0 && a.debug("Jobs runed before in page: " + o.join(",")),
					setTimeout(function() {
						e._handleInit(t),
							e._handleExec(t),
							a.debug("Run all jobs in " + (new Date - s) + " ms"),
							r.fire({
								type: "jobdone"
							})
					}, 0)
			},
			_handleInit: function(e) {
				var t = [];
				window.__qlt && window.__qlt.start && window.__qlt.start("jobInitReady"),
					e.forEach(function(e) {
						var n = new Date,
							i = e.name;
						t.push(i);
						var r = e.param,
							l = o[i];
						if(l.init)
							try {
								l.init.call(l, r)
							} catch(s) {
								a.warn("job[" + i + "] init failed!!!"),
									a.warn("message : " + s.message),
									a.warn("stack : " + s.stack)
							}
						a.debug("Init [" + i + "] cost " + (new Date - n) + " ms")
					}),
					window.__qlt && window.__qlt.end && window.__qlt.end("jobInitReady"),
					a.debug("Jobs in page : " + t.join(","))
			},
			_handleExec: function(e) {
				var t = this,
					n = t._execedjobs;
				for(window.__qlt && window.__qlt.start && window.__qlt.start("jobExecReady"); e.length > 0;) {
					var i = new Date,
						r = e[0].name,
						l = e[0].param,
						s = o[r];
					if(s.exec) {
						try {
							s.exec.call(s, l)
						} catch(m) {
							a.warn("job[" + r + "] executed failed!!!"),
								a.warn("message : " + m.message),
								a.warn("stack : " + m.stack)
						}
						a.debug("Exec [" + r + "] cost " + (new Date - i) + " ms")
					}
					n.push(e.shift())
				}
				window.__qlt && window.__qlt.end && window.__qlt.end("jobExecReady")
			},
			_startJob: function(e) {
				var t = this,
					n = t._execjobs,
					i = t._execedjobs,
					r = this.check,
					l = new Date;
				if(n = n.filter(function(t) {
						return t.name !== e ? !1 : (t.passed = r(t.object),
							t.passed || a.warn("job[" + t.name + "] check failed!!!"),
							t.passed)
					}),
					a.debug("Check an async job in " + (new Date - l) + " ms"),
					1 === n.length) {
					l = new Date;
					var s = n[0],
						m = new Date,
						d = s.name,
						h = s.param,
						U = o[d];
					if(U.init) {
						try {
							U.init.call(U, h)
						} catch(c) {
							a.warn("job[" + d + "] init failed!!!"),
								a.warn("message : " + c.message),
								a.warn("stack : " + c.stack)
						}
						a.debug("Init [" + d + "] cost " + (new Date - m) + " ms")
					}
					if(U.exec)
						try {
							U.exec.call(U, h)
						} catch(c) {
							a.warn("job[" + d + "] executed failed!!!"),
								a.warn("message : " + c.message),
								a.warn("stack : " + c.stack)
						}
					i.push(U),
						a.debug("Run an async job [" + d + "] in " + (new Date - l) + " ms")
				}
			}
		}
	});
	n.exports = l
});
define("config/config.js", [], function(e, t, n) {
	var a = {
		projectName: "qiyiV2",
		projectVersion: "20181018104131",
		templateVersion: "20181012141049",
		commonVersion: "20181010103307",
		developer: "zhangzhiming",
		jobPath: "jobs/pc",
		commonPath: "common",
		templatePath: "templates/scripts",
		env: "product",
		projectDebug: !1,
		cookie: {
			pc: "QC020"
		},
		supportTs: Q.browser.iPad || Q.browser.iPhone || navigator.userAgent.match(/miuivideo\//i)
	};
	"development" == a.env,
		n.exports = a
});
define("qipaLogin/units/loginBase.js", ["../../config/projectConfig", "../../config/siteDomain"], function(e) {
	var t = e("../../config/projectConfig");
	t.setConfig({});
	var i = e("../../config/siteDomain");
	try {
		document.domain = i.SITE_DOMAIN
	} catch(a) {}
	window.Q = window.Q || {},
		window.lib = window.lib || {},
		window.onerror = function() {},
		window.onunload = function() {}
});
define("config/projectConfig", [], function(e, t, n) {
	var a;
	n.exports = {
		setConfig: function(e) {
			a = e
		},
		getConfig: function() {
			return a
		}
	}
});
define("config/siteDomain", [], function(e, t, n) {
	n.exports = {
		SITE_DOMAIN: "iqiyi.com",
		getDomain: function() {
			if("file:" == location.protocol)
				return this.SITE_DOMAIN;
			var e = 2,
				t = window.location.hostname.split(".");
			return t = t.slice(t.length - e),
				t.join(".")
		},
		isPPS: function() {
			var e = this.getDomain(),
				t = !1;
			return -1 !== e.indexOf("pps.tv") ? !t : t
		}
	}
});
define("qipaLogin/units/normal.js", ["../../components/units/pageJob", "../action/qrCodeLogin", "../kit/redirect", "../kit/getI18nLang", "../../config/siteDomain", "../kit/blockPingback", "../kit/getPassedParams"], function(e) {
	var t, i = e("../../components/units/pageJob"),
		a = e("../action/qrCodeLogin"),
		n = e("../kit/redirect"),
		o = e("../kit/getI18nLang"),
		r = Q.pageInfo || {},
		s = r.first_show || 1,
		l = e("../../config/siteDomain"),
		d = l.getDomain(),
		c = "normalLogin",
		u = top != this,
		p = e("../kit/blockPingback"),
		m = e("../kit/getPassedParams"),
		h = {},
		f = Q('[data-loginele="normalLogin"]'),
		g = Q.event.customEvent,
		v = "passLogin",
		y = "normal",
		b = "",
		w = "",
		V = !1,
		U = !1,
		k = !1;
	i.create(c, {
			getDependentDoms: function() {
				return h = {
					loginWrapper: Q("[data-qipalogin-login]"),
					regWrapper: Q("[data-qipalogin-reg]"),
					loginPanel: Q('[data-loginele="passLogin"]'),
					qrCodePanel: Q('[data-loginele="codeLogin"]'),
					thirdPanel: Q('[data-loginele="thirdLogin"]'),
					errPanel: Q('[data-loginele="errLogin"]'),
					fengkongPanel: Q('[data-loginele="fengkong"]')
				}, !0
			},
			check: function() {
				return !0
			},
			init: function() {
				var e = this;
				f[0] && (t = new a({
							wrapper: h.qrCodePanel
						}),
						t.init(),
						e.initLoginView()),
					this.bindEvent()
			},
			initLoginView: function() {
				var e = Q.url.getQueryValue(location.href, "is_reg");
				if(!e) {
					var t = Q.cookie.get("QC160");
					t && (t = JSON.parse(t),
							"s1" == t.type && (s = "1"),
							"p1" == t.type && (s = "0")),
						u && /vip.iqiyi.com\/oxlxsjmh-pc.html/gi.test(window.parent.location.href) && (s = "0"),
						"1" == s ? this.showQr() : "0" == s && this.showPass()
				}
			},
			bindEvent: function() {
				var e = this;
				Q(document).delegate("[data-regist]", "click", function() {
						h.loginWrapper.addClass("dn"),
							h.qrCodePanel.hasClass("dn") || t.hide(),
							Q(document.body).removeClass("embed-container"),
							h.regWrapper.removeClass("dn"),
							k || (g.fire({
									type: "lazyloadReg",
									data: {}
								}),
								k = !0)
					}),
					Q(document).delegate("[data-passLogin]", "click", function(t) {
						t.preventDefault(),
							Q(document.body).addClass("embed-container"),
							e.showPass(),
							U || (g.fire({
									type: "lazyloadPassLogin",
									data: {}
								}),
								U = !0)
					}),
					Q(document).delegate("[data-qrLogin]", "click", function(t) {
						t.preventDefault(),
							y = "normal",
							b = "",
							Q(this).attr("data-qrLogin") && (y = "hrisk"),
							e.showQr()
					}),
					Q(document).delegate("[agree-protocol]", "click", function(e) {
						e.preventDefault();
						var t = "http://www.iqiyi.com/user/register/protocol.html";
						"zh_TW" == o.get() && (t = "http://www.iqiyi.com/user/register/protocol_tw.html"),
							n.href("__blank", {
								url: t
							})
					}),
					f[0] && (f.delegate("[data-thirdLogin]", "click", function(t) {
							t.preventDefault(),
								e.showThird()
						}),
						f.delegate("[data-smsLogin]", "click", function(e) {
							e.preventDefault();
							var t = "//www." + d + "/iframe/smslogin",
								i = Q.url.getQueryValue(location.href, "from_url");
							if("zh_TW" == o.get() && (t += "_tw"),
								u) {
								var a = decodeURIComponent(window.parent.location.href);
								t += "?from_url=" + encodeURIComponent(a)
							} else
								i && (t += "?from_url=" + i);
							var r = m.getAllParams();
							r && (t += "&" + r),
								n.href("__blank", {
									url: t,
									decode: !1
								})
						}),
						f.delegate("[data-findpwd]", "click", function(e) {
							e.preventDefault();
							var t = "http://passport.iqiyi.com/pages/secure/password/find_pwd_index.action";
							n.href("__blank", {
								url: t
							})
						}),
						f.delegate('[data-loginele="errReturn"]', "click", function(t) {
							t.preventDefault(),
								"qrLogin" == v ? e.showQr() : "thirdLogin" == v ? e.showThird() : e.showPass()
						})),
					Q(document).delegate("[data-frameClose]", "click", function(e) {
						e.preventDefault(),
							w ? window.parent.__frameOnLogin ? window.parent.__frameOnLogin(w, !0, V) : window.parent.location.reload() : window.parent.__frameClose()
					}),
					g.on("showQrCodeLogin", function(t) {
						t = t.data || {},
							y = t.type || "normal",
							b = t.mobile || "",
							e.showQr()
					g.on("showErrLogin", function(t) {
						t = t.data || {},
							v = t.source || "passLogin",
							y = t.type || "normal",
							b = t.mobile || "",
							e.showErr()
					}),
					g.on("saveLoginSusData", function(e) {
						w = e.data.data || {},
							V = e.data.isReg ? e.data.isReg : !1
					}),
					Q(document).delegate('[data-regele="errReturn"]', "click", function(e) {
						if(e.preventDefault(),
							u && window.parent.__frameClose)
							window.parent.__frameClose();
						else {
							var t = Q.url.getQueryValue(location.href, "from_url");
							n.href("__self", {
								url: t,
								checkUrl: !0
							})
						}
					}),
					g.on("showErrReg", function(t) {
						var i = t.data;
						e.showRegErr(i.wrapper, i.msg)
					})
			},
			initLoginPanel: function() {
				h.regWrapper.addClass("dn"),
					h.loginWrapper.removeClass("dn"),
					h.loginPanel.addClass("dn"),
					h.qrCodePanel.addClass("dn"),
					t.hide(),
					h.thirdPanel.addClass("dn"),
					h.errPanel.addClass("dn"),
					h.fengkongPanel.addClass("dn")
			},
			showPass: function() {
				this.initLoginPanel(),
					h.loginPanel.removeClass("dn");
				var e = h.loginPanel.attr("data-block-name");
				p.send(e)
			},
			showQr: function() {
				this.initLoginPanel(),
					t.show(y, b),
					h.qrCodePanel.removeClass("dn")
			},
			showThird: function() {
				this.initLoginPanel(),
					h.thirdPanel.removeClass("dn");
				var e = h.thirdPanel.attr("data-block-name");
				p.send(e)
			},
			showErr: function() {
				this.initLoginPanel(),
					h.errPanel.removeClass("dn")
			},
			showRegErr: function(e, t) {
				var i = this;
				if(u && window.parent.__frameClose) {
					Q("[data-step]").addClass("dn");
					var a = Q('[data-regele="errReg"]');
					a.find('[data-regele="errmsg"]').html(t),
						a.removeClass("dn")
				} else
					i.getTpl(e, t)
			},
			getTpl: function(e, t) {
				var i = '<div class="login-frame"><div class="login-frame-top"><div class="login-frame-ti"><div class="fla-error"><div class="playerror"></div></div><p class="fla-error-t">{{msg}}</p><a href="javascript:;" class="btn-green btn-login btn-next" data-regele="errReturn">确定</a></div></div></div>';
				i = i.replace("{{msg}}", t),
					"zh_TW" == o.get() && (i = i.replace("确定", "確定")),
					e.html(i),
					e.removeClass("dn")
			}
		}),
		i.add(c)
});
define("qipaLogin/action/qrCodeLogin.js", ["../../config/siteDomain", "../templates/qrCodeTpl", "../../kit/artTemplate", "../kit/redirect", "../interfaces/qrCodeInterface", "../kit/qrCoderUrl", "../kit/getI18nLang", "../kit/setCookie", "../kit/blockPingback", "../kit/getPassedParams", "../kit/newsso"], function(e, t, i) {
	e("../../config/siteDomain");
	var a = Q.event.customEvent,
		n = e("../templates/qrCodeTpl"),
		o = e("../../kit/artTemplate"),
		r = e("../kit/redirect"),
		s = e("../interfaces/qrCodeInterface"),
		l = e("../kit/qrCoderUrl"),
		d = e("../kit/getI18nLang"),
		c = e("../kit/setCookie"),
		u = e("../kit/blockPingback"),
		p = e("../kit/getPassedParams"),
		m = e("../kit/newsso"),
		h = p.getAgenttype(),
		f = p.getPtid();
	window.location.protocol;
	var g = Q.pageInfo || {},
		v = g.show_back || 0,
		y = {},
		b = Q.Class("QrCode", {
			construct: function(e) {
				e = e || {},
					this.type = e.type || "normal",
					this._pullInterval = e.pullInterval || 2e3,
					this.wrapper = e.wrapper,
					this.lang = d.get(),
					this.hidden = !0,
					this.isMoving = null
			},
			methods: {
				init: function() {
					this.wrapper[0] && (this.render({
							lang: this.lang
						}),
						this.bindEvent())
				},
				show: function(e, t) {
					if(e !== this.type) {
						this.type = e;
						var i = {
							lang: this.lang
						};
						t && (i.mobile = t),
							this.render(i)
					}
					this.hidden = !1,
						this.refreshQrcode(),
						this.refreshClass();
					var a = y.codeImgWrap.attr("data-block-name");
					"hrisk" == e && (a = "hriskqr"),
						u.send(a)
				},
				hide: function() {
					this.hidden = !0,
						clearTimeout(this._pollTokenLoginTimer),
						clearTimeout(this.isMoving),
						y.phoneImg.removeClass("qr-code-phone-h"),
						y.rigcon.removeClass("qr-code-rigcon-h")
				},
				refreshQrcode: function() {
					var e = this;
					if(!e.hiden) {
						e._agenttype = h,
							e._device_name = "网页端",
							e._ptid = f;
						var t = {
							agenttype: e._agenttype,
							device_name: e._device_name,
							ptid: e._ptid,
							surl: 1
						};
						y.codeImgWrap.removeClass("qr-code-con2"),
							y.codeFailWrap.addClass("dn"),
							y.codeSuc.addClass("dn"),
							(new s).genLoginToken(t, function(t) {
								if("A00000" === t.code) {
									e._loginToken = t.data.token,
										e._loginTokenExpire = t.data.expire;
									var i, a = {
											data: t.data.url,
											width: 162
										},
										n = l.getQrCoder(a) + "&_=" + Math.random(),
										o = y.codeImg[0];
									o.onload = function() {
											o.onload = o.onerror = function() {},
												clearTimeout(i),
												e.qrcodeImgSrcChanged(),
												u.send("psprt_qrcode"),
												y.codeImgLoading[0] && !y.codeImgLoading.hasClass("dn") && (y.codeImgLoading.addClass("dn"),
													y.codeImg.removeClass("dn"))
										},
										o.onerror = function() {
											o.onload = o.onerror = function() {},
												clearTimeout(i),
												y.codeImgWrap.addClass("qr-code-con2"),
												y.codeFailWrap.removeClass("dn"),
												y.codeSuc.addClass("dn")
										},
										i = setTimeout(function() {
											o.onerror()
										}, 1e4),
										y.codeImg.attr("src", n)
								} else
									y.codeImgWrap.addClass("qr-code-con2"),
									y.codeFailWrap.removeClass("dn"),
									y.codeSuc.addClass("dn")
							})
					}
				},
				qrcodeImgSrcChanged: function() {
					function e() {
						(new s).checkTokenLogin({
							agenttype: t._agenttype,
							ptid: t._ptid,
							token: t._loginToken
						}, function(o) {
							if("A00000" === o.code) {
								if(y.codeImgWrap.addClass("qr-code-con2"),
									y.codeFailWrap.addClass("dn"),
									y.codeSuc.addClass("dn"),
									o.data && o.data.userinfo) {
									var r = o.data.userinfo;
									Q("[data-pwdloginbox='nick']").html(r.nickname || "一名用户"),
										r.icon && Q("[data-pwdloginbox='icon']").attr("src", r.icon),
										Q("[data-loginele='suc']").removeClass("dn"),
										t.wrapper.addClass("dn"),
										Q("[data-loginele='passLogin']").removeClass("dn")
								}
								var s = y.codeSuc.attr("data-block-name");
								u.send(s);
								try {
									m(),
										setTimeout(function() {
											a.fire({
													type: "login",
													data: {}
												}),
												c.setLoginCookie(null, null, null, "s1", o.data, !0)
										}, 2e3)
								} catch(l) {}
							} else
								clearTimeout(t._pollTokenLoginTimer),
								n || t.hidden || (i > 0 ? (t._pollTokenLoginTimer = setTimeout(e, 1e3),
									i--,
									0 === i ? (y.codeImgWrap.addClass("qr-code-con2"),
										y.codeFailWrap.removeClass("dn"),
										y.codeSuc.addClass("dn")) : "P01006" === o.code ? (y.codeSuc.removeClass("dn"),
										Q('[data-qrcode="suctip"]').removeClass("dn"),
										Q('[data-qrcode="failtip"]').addClass("dn")) : "P01007" === o.code && (y.codeSuc.removeClass("dn"),
										Q('[data-qrcode="suctip"]').addClass("dn"),
										Q('[data-qrcode="failtip"]').removeClass("dn"),
										clearTimeout(t._pollTokenLoginTimer),
										setTimeout(function() {
											y.codeSuc.addClass("dn"),
												t.hidePhone(),
												t.refreshQrcode()
										}, 2e3))) : (y.codeImgWrap.addClass("qr-code-con2"),
									y.codeFailWrap.removeClass("dn"),
									y.codeSuc.addClass("dn")))
						})
					}
					var t = this,
						i = 60;
					y.codeImgWrap.removeClass("qr-code-con2"),
						y.codeFailWrap.addClass("dn"),
						y.codeSuc.addClass("dn");
					var n = !1;
					t._pollTokenLoginTimer = setTimeout(e, t._pullInterval),
						clearTimeout(t._loginTokenExpireTimer),
						t._loginTokenExpireTimer = null,
						t._loginTokenExpireTimer = setTimeout(function() {
							n = !0,
								clearTimeout(t._pollTokenLoginTimer),
								t._pollTokenLoginTimer = null,
								clearTimeout(t._loginTokenExpireTimer),
								t._loginTokenExpireTimer = null,
								t.hidden || t.refreshQrcode()
						}, 1e3 * t._loginTokenExpire)
				},
				render: function(e) {
					e.show_back = v;
					var t = o.compile(n.getTemplate(this.type));
					e.blockname = "hrisk" == this.type ? "hriskqr_lgnok" : "abnormal" == this.type ? "pcw2stplgnok" : "pcwqrlgnok",
						this.wrapper.html(t(e)),
						y = {
							codeImgWrap: this.wrapper.find('[data-qrcode="codeImgWrap"]'),
							codeFailWrap: this.wrapper.find('[data-qrcode="codeFailWrap"]'),
							codeSuc: this.wrapper.find('[data-qrcode="codeSucWrap"]'),
							codeImg: this.wrapper.find('[data-qrcode="codeImg"]'),
							codeImgLoading: this.wrapper.find('[data-qrcode="codeImgLoading"]'),
							phoneImg: this.wrapper.find('[data-qrcode="phoneImg"]'),
							rigcon: this.wrapper.find('[data-qrcode="rigcon"]'),
							tip: this.wrapper.find('[data-qrcode="tip"]')
						}
				},
				bindEvent: function() {
					this.openApp(),
						"normal" === this.type && this.showPhone_evet(),
						this.showTip(),
						this.reGenCode()
				},
				openApp: function() {
					var e = this;
					this.wrapper.delegate('[data-qrcode="openApp"]', "click", function(t) {
						t.preventDefault();
						var i = "//store.iqiyi.com/web/iqiyi/detail/mobile.action";
						"zh_TW" == e.lang && (i = "//tw.iqiyi.com/download"),
							r.href("__blank", {
								url: i
							})
					})
				},
				showPhone_evet: function() {
					var e = this;
					this.wrapper.delegate('[data-qrcode="codeImgWrap"]', "mouseover", function() {
						clearTimeout(e.isMoving),
							e.showPhone()
					})
				},
				refreshClass: function() {
					if("normal" !== this.type)
						return y.phoneImg.addClass("dn"),
							void 0;
					var e = this;
					clearTimeout(e.isMoving),
						e.isMoving = setTimeout(function() {
							e.hidePhone()
						}, 5e3)
				},
				hidePhone: function() {
					y.phoneImg.removeClass("qr-code-phone-h").addClass("qr-code-phone-nh"),
						y.rigcon.removeClass("qr-code-rigcon-h").addClass("qr-code-rigcon-nh")
				},
				showPhone: function() {
					y.phoneImg.hasClass("qr-code-phone-nh") && (y.phoneImg.removeClass("qr-code-phone-nh").addClass("qr-code-phone-h"),
						y.rigcon.removeClass("qr-code-rigcon-nh").addClass("qr-code-rigcon-h"))
				},
				showTip: function() {
					this.wrapper.delegate('[data-qrcode="tipTarget"]', "mouseover", function() {
							y.tip.removeClass("dn")
						}),
						this.wrapper.delegate('[data-qrcode="tipWrap"]', "mouseout", function(e) {
							Q(e.toElement).parents('[data-qrcode="tipWrap"]')[0] || y.tip.addClass("dn")
						})
				},
				reGenCode: function() {
					var e = this;
					this.wrapper.delegate('[data-qrcode="reGen"]', "click", function(t) {
						t.preventDefault(),
							e.refreshQrcode()
					})
				}
			}
		});
	i.exports = b
});
define("qipaLogin/templates/qrCodeTpl.js", [], function(e, t, a) {
	var i = '<div class="login-frame-top"><div class="login-frame-ti">{{if show_back == 0}}<a href="javascript:;" class="frame-close" data-frameClose {{if lang == "zh_TW"}}{{else}}rseat="psprt_close"{{/if}}></a><h2 class="login-title"><span class="title-dot"></span>{{if lang == "zh_TW"}}手機掃碼登入{{else}}手机扫码登录{{/if}}</h2>{{else}}<h2 class="login-title">{{if lang == "zh_TW"}}手機掃碼登入{{else}}手机扫码登录{{/if}}</h2>{{/if}}<div class="qr-code-phone" data-qrcode="phoneImg"></div><div class="qr-code-rigcon" data-qrcode="rigcon"><p class="sub-title-ercode">{{if lang == "zh_TW"}}打開{{else}}打开{{/if}}<a href="javascript:;" class="link-app-i" data-qrcode="openApp">{{if lang == "zh_TW"}}愛奇藝手機{{else}}爱奇艺手机{{/if}}APP</a><br>{{if lang == "zh_TW"}}掃描QR Code登入{{else}}扫描二维码登录{{/if}}</p><div class="qr-code-container"> <div class="qr-code-con" data-qrcode="codeImgWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="pcwqrdlg"{{/if}}><img class="qr-code-img dn" src="" data-qrcode="codeImg"/><div class="fla-code-i" data-qrcode="codeImgLoading"></div></div><div class="qr-code-fail dn" data-qrcode="codeFailWrap"><p class="qr-fail-t">{{if lang == "zh_TW"}}QR Code已失效{{else}}二维码已失效{{/if}}</p><a href="javascript:;" class="qr-code-refresh" {{if lang == "zh_TW"}}{{else}}rseat="pqrd_rfrsh"{{/if}} data-qrcode="reGen"><i class="refre-icon"></i>{{if lang == "zh_TW"}}點擊刷新{{else}}点击刷新{{/if}}</a></div></div></div></div></div><div class="login-frame-bottom"><p class="login-frame-ln"><a href="javascript:;" class="fl" {{if lang == "zh_TW"}}{{else}}rseat="cmm_2reg"{{/if}} data-regist>{{if lang == "zh_TW"}}註冊{{else}}注册{{/if}}</a><span class="fr"><a href="javascript:;" {{if lang == "zh_TW"}}{{else}}rseat="cmm_lgn"{{/if}} data-passLogin>{{if lang == "zh_TW"}}帳號密碼登入{{else}}账号密码登录{{/if}}</a><i class="vertical-line"></i><a href="javascript:;" {{if lang == "zh_TW"}}{{else}}rseat="cmm_mrlgn"{{/if}} data-thirdLogin>{{if lang == "zh_TW"}}其他方式登入{{else}}其他方式登录{{/if}}</a></span></p></div>',
		n = '<div class="login-frame-top"><div class="login-frame-ti">{{if show_back == 0}}<a href="javascript:;" class="frame-close" data-frameClose {{if lang == "zh_TW"}}{{else}}rseat="psprt_close"{{/if}}></a><h2 class="login-title"><span class="title-dot"></span>{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{else}}<h2 class="login-title">{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{/if}}<p class="sub-title sub-title-safe">{{if lang == "zh_TW"}}為了您的帳號安全，請打開{{else}}为了您的账号安全，请打开{{/if}}<a href="javascript:;" class="link-app-i" data-qrcode="openApp">{{if lang == "zh_TW"}}愛奇藝手機{{else}}爱奇艺手机{{/if}}APP</a>，{{if lang == "zh_TW"}}掃描QR Code登入{{else}}扫描二维码登录{{/if}}</p><div class="qr-code-container qr-code-consafe"> <div class="qr-code-con" data-qrcode="codeImgWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="pcw2stplgn"{{/if}}><img class="qr-code-img dn" src="" data-qrcode="codeImg"/><div class="fla-code-i" data-qrcode="codeImgLoading"></div></div><div class="qr-code-phone dn" data-qrcode="phoneImg"></div><div class="qr-code-fail dn" data-qrcode="codeFailWrap"><p class="qr-fail-t">{{if lang == "zh_TW"}}QR Code已失效{{else}}二维码已失效{{/if}}</p><a href="javascript:;" class="qr-code-refresh" data-qrcode="reGen"><i class="refre-icon"></i>{{if lang == "zh_TW"}}點擊刷新{{else}}点击刷新{{/if}}</a></div></div></div></div><div class="login-frame-bottom" data-qrcode="tipWrap"><div class="no-app-tip dn" data-qrcode="tip"><p class="no-app-lin">{{if lang == "zh_TW"}}建議您安裝愛奇藝手機APP掃碼安全登入，有效防止盜號。不想安裝？{{else}}建议您安装爱奇艺手机APP扫码安全登录，有效防止盗号。不想安装？{{/if}}</p><p class="no-app-lin">{{if lang == "zh_TW"}}可以用{{else}}可以用{{/if}}<a href="javascript:;" class="txt-green-tip" {{if lang == "zh_TW"}}{{else}}="p2tld_2smslgn"{{/if}} data-smsLogin>{{if lang == "zh_TW"}}簡訊登入{{else}}短信登录{{/if}}</a></p></div><p class="login-frame-ln"><span class="fr"><a href="javascript:;" data-qrcode="tipTarget">{{if lang == "zh_TW"}}沒有安裝愛奇藝手機APP？{{else}}没有安装爱奇艺手机APP？{{/if}}</a></span></p></div>',
		o = '<div class="login-frame-top"><div class="login-frame-ti">{{if show_back == 0}}<a href="javascript:;" class="frame-close" data-frameClose {{if lang == "zh_TW"}}{{else}}rseat="psprt_close"{{/if}}></a><h2 class="login-title"><span class="title-dot"></span>{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{else}}<h2 class="login-title">{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{/if}}<p class="sub-title sub-title-safe">{{if lang == "zh_TW"}}為了您的帳號安全，請打開{{else}}为了您的账号安全，请打开{{/if}}<a href="javascript:;" class="link-app-i" data-qrcode="openApp">{{if lang == "zh_TW"}}愛奇藝手機{{else}}爱奇艺手机{{/if}}APP</a>，{{if lang == "zh_TW"}}掃描QR Code登入{{else}}扫描二维码登录{{/if}}</p><div class="qr-code-container qr-code-consafe"> <div class="qr-code-con" data-qrcode="codeImgWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="pcw2stplgn"{{/if}}><img class="qr-code-img dn" src="" data-qrcode="codeImg"/><div class="fla-code-i" data-qrcode="codeImgLoading"></div></div><div class="qr-code-phone dn" data-qrcode="phoneImg"></div><div class="qr-code-fail dn" data-qrcode="codeFailWrap"><p class="qr-fail-t">{{if lang == "zh_TW"}}QR Code已失效{{else}}二维码已失效{{/if}}</p><a href="javascript:;" class="qr-code-refresh" data-qrcode="reGen"><i class="refre-icon"></i>{{if lang == "zh_TW"}}點擊刷新{{else}}点击刷新{{/if}}</a></div></div></div></div><div class="login-frame-bottom"><p class="login-frame-ln"><a href="javascript:;" class="fl" {{if lang == "zh_TW"}}{{else}}rseat="cmm_2reg"{{/if}} data-regist>{{if lang == "zh_TW"}}註冊{{else}}注册{{/if}}</a><span class="fr"><a href="javascript:;" {{if lang == "zh_TW"}}{{else}}rseat="cmm_lgn"{{/if}} data-smsLogin>{{if lang == "zh_TW"}}手機簡訊登入{{else}}手机短信登录{{/if}}</a><i class="vertical-line"></i><a href="javascript:;" {{if lang == "zh_TW"}}{{else}}rseat="cmm_mrlgn"{{/if}} data-thirdLogin>{{if lang == "zh_TW"}}其他方式登入{{else}}其他方式登录{{/if}}</a></span></p></div>',
		r = '<div class="login-frame-top"><div class="login-frame-ti">{{if show_back == 0}}<a href="javascript:;" class="frame-close" data-frameClose {{if lang == "zh_TW"}}{{else}}rseat="psprt_close"{{/if}}></a><h2 class="login-title"><span class="title-dot"></span>{{if lang == "zh_TW"}}已開啟登入保護{{else}}已开启登录保护{{/if}}</h2>{{else}}<h2 class="login-title">{{if lang == "zh_TW"}}已開啟登入保護{{else}}已开启登录保护{{/if}}</h2>{{/if}}<p class="sub-title sub-title-safe">{{if lang == "zh_TW"}}您的帳號{{else}}您的账号{{/if}}<span>{{mobile}}</span>{{if lang == "zh_TW"}}開啟了登入保護{{else}}开启了登录保护{{/if}}</p><p class="sub-title sub-title-safe">{{if lang == "zh_TW"}}請使用此帳號的常用手機掃碼登入{{else}}请使用此账号的常用手机扫码登录{{/if}}</p><div class="qr-code-container"> <div class="qr-code-con" data-qrcode="codeImgWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="pcwlocklgn"{{/if}}><img class="qr-code-img dn" src="" data-qrcode="codeImg"/><div class="fla-code-i" data-qrcode="codeImgLoading"></div></div><div class="qr-code-phone dn" data-qrcode="phoneImg"></div><div class="qr-code-fail dn" data-qrcode="codeFailWrap"><p class="qr-fail-t">{{if lang == "zh_TW"}}QR Code已失效{{else}}二维码已失效{{/if}}</p><a href="javascript:;" class="qr-code-refresh" data-qrcode="reGen"><i class="refre-icon"></i>{{if lang == "zh_TW"}}點擊刷新{{else}}点击刷新{{/if}}</a></div></div></div></div><div class="login-frame-bottom" data-qrcode="tipWrap"><div class="no-app-tip dn" data-qrcode="tip"><p class="no-app-lin">{{if lang == "zh_TW"}}建議您安裝愛奇藝手機APP掃碼安全登入，有效防止盜號。不想安裝？{{else}}建议您安装爱奇艺手机APP扫码安全登录，有效防止盗号。不想安装？{{/if}}</p><p class="no-app-lin">{{if lang == "zh_TW"}}可以用{{else}}可以用{{/if}}<a href="javascript:;" class="txt-green-tip" {{if lang == "zh_TW"}}{{else}}rseat="plld_2smslgn"{{/if}} data-smsLogin>{{if lang == "zh_TW"}}簡訊登入{{else}}短信登录{{/if}}</a></p></div><p class="login-frame-ln"><a href="javascript:;" class="fl" data-regist>{{if lang == "zh_TW"}}註冊{{else}}注册{{/if}}</a><span class="fr"><a href="javascript:;" data-qrcode="tipTarget">{{if lang == "zh_TW"}}常用手機不在身邊？{{else}}常用手机不在身边？{{/if}}</a></span></p></div>',
		n = '<div class="login-frame-top"><div class="login-frame-ti">{{if show_back == 0}}<a href="javascript:;" class="frame-close" data-frameClose {{if lang == "zh_TW"}}{{else}}rseat="psprt_close"{{/if}}></a><h2 class="login-title"><span class="title-dot"></span>{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{else}}<h2 class="login-title">{{if lang == "zh_TW"}}當前登入可能有風險{{else}}当前登录可能有风险{{/if}}</h2>{{/if}}<p class="sub-title sub-title-safe">{{if lang == "zh_TW"}}為了您的帳號安全，請打開{{else}}为了您的账号安全，请打开{{/if}}<a href="javascript:;" class="link-app-i" data-qrcode="openApp">{{if lang == "zh_TW"}}愛奇藝手機{{else}}爱奇艺手机{{/if}}APP</a>，{{if lang == "zh_TW"}}掃描QR Code登入{{else}}扫描二维码登录{{/if}}</p><div class="qr-code-container qr-code-consafe"> <div class="qr-code-con" data-qrcode="codeImgWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="pcw2stplgn"{{/if}}><img class="qr-code-img dn" src="" data-qrcode="codeImg"/><div class="fla-code-i" data-qrcode="codeImgLoading"></div></div><div class="qr-code-phone dn" data-qrcode="phoneImg"></div><div class="qr-code-fail dn" data-qrcode="codeFailWrap"><p class="qr-fail-t">{{if lang == "zh_TW"}}QR Code已失效{{else}}二维码已失效{{/if}}</p><a href="javascript:;" class="qr-code-refresh" data-qrcode="reGen"><i class="refre-icon"></i>{{if lang == "zh_TW"}}點擊刷新{{else}}点击刷新{{/if}}</a></div></div></div></div><div class="login-frame-bottom" data-qrcode="tipWrap"><div class="no-app-tip dn" data-qrcode="tip"><p class="no-app-lin">{{if lang == "zh_TW"}}建議您安裝愛奇藝手機APP掃碼安全登入，有效防止盜號。不想安裝？{{else}}建议您安装爱奇艺手机APP扫码安全登录，有效防止盗号。不想安装？{{/if}}</p><p class="no-app-lin">{{if lang == "zh_TW"}}可以用{{else}}可以用{{/if}}<a href="javascript:;" class="txt-green-tip" {{if lang == "zh_TW"}}{{else}}="p2tld_2smslgn"{{/if}} data-smsLogin>{{if lang == "zh_TW"}}簡訊登入{{else}}短信登录{{/if}}</a></p></div><p class="login-frame-ln"><span class="fr"><a href="javascript:;" data-qrcode="tipTarget">{{if lang == "zh_TW"}}沒有安裝愛奇藝手機APP？{{else}}没有安装爱奇艺手机APP？{{/if}}</a></span></p></div>',
		s = '<div class="login-frame-top login-frame-ab dn" data-qrcode="codeSucWrap" {{if lang == "zh_TW"}}{{else}}data-block-name="{{blockname}}"{{/if}}><div class="login-frame-ti"><div class="fla-correct"><div class="playgreen" data-qrcode="suctip"></div><div class="playerror dn" data-qrcode="failtip"></div></div><p class="fla-correct-t" data-qrcode="suctip">{{if lang == "zh_TW"}}掃QR Code成功{{else}}扫码成功{{/if}}</p><p class="fla-correct-t" data-qrcode="suctip">{{if lang == "zh_TW"}}按照APP提示完成相關操作{{else}}按照APP提示完成相关操作{{/if}}</p><p class="fla-correct-t dn" data-qrcode="failtip">{{if lang == "zh_TW"}}登入失敗{{else}}登录失败{{/if}}</p></div></div>';
	a.exports = {
		getTemplate: function(e) {
			var t = "";
			return "normal" === e ? t = i + s : "abnormal" === e ? t = n + s : "lock" === e ? t = r + s : "hrisk" === e && (t = o + s),
				t
		}
	}
});
define("kit/artTemplate", [], function(e, t, n) {
	var a;
	! function(e) {
		"use strict";
		a = function(e, t) {
				return a["string" == typeof t ? "compile" : "render"].apply(a, arguments)
			},
			a.version = "2.0.2",
			a.openTag = "<%",
			a.closeTag = "%>",
			a.isEscape = !0,
			a.isCompress = !1,
			a.parser = null,
			a.render = function(e, t) {
				var n = a.get(e) || i({
					id: e,
					name: "Render Error",
					message: "No Template"
				});
				return n(t)
			},
			a.compile = function(e, n) {
				function o(t) {
					try {
						return new l(t, e) + ""
					} catch(r) {
						return m ? i(r)() : a.compile(e, n, !0)(t)
					}
				}
				var l, s = arguments,
					m = s[2],
					d = "anonymous";
				"string" != typeof n && (m = s[1],
					n = s[0],
					e = d);
				try {
					l = r(e, n, m)
				} catch(h) {
					return h.id = e || n,
						h.name = "Syntax Error",
						i(h)
				}
				return o.prototype = l.prototype,
					o.toString = function() {
						return l.toString()
					},
					e !== d && (t[e] = o),
					o
			};
		var t = a.cache = {},
			n = a.helpers = {
				$include: a.render,
				$string: function(e, t) {
					return "string" != typeof e && (t = typeof e,
							"number" === t ? e += "" : e = "function" === t ? n.$string(e()) : ""),
						e
				},
				$escape: function(e) {
					var t = {
						"<": "&#60;",
						">": "&#62;",
						'"': "&#34;",
						"'": "&#39;",
						"&": "&#38;"
					};
					return n.$string(e).replace(/&(?![\w#]+;)|[<>"']/g, function(e) {
						return t[e]
					})
				},
				$each: function(e, t) {
					var n = Array.isArray || function(e) {
						return "[object Array]" === {}.toString.call(e)
					};
					if(n(e))
						for(var a = 0, i = e.length; i > a; a++)
							t.call(e, e[a], a, e);
					else
						for(var r in e)
							t.call(e, e[r], r)
				}
			};
		a.helper = function(e, t) {
				n[e] = t
			},
			a.onerror = function(t) {
				var n = "Template Error\n\n";
				for(var a in t)
					n += "<" + a + ">\n" + t[a] + "\n\n";
				e.console && e.console.error(n)
			},
			a.get = function(n) {
				var i;
				if(t.hasOwnProperty(n))
					i = t[n];
				else if("document" in e) {
					var r = document.getElementById(n);
					if(r) {
						var o = r.value || r.innerHTML;
						i = a.compile(n, o.replace(/^\s*|\s*$/g, ""))
					}
				}
				return i
			};
		var i = function(e) {
				return a.onerror(e),
					function() {
						return "{Template Error}"
					}
			},
			r = function() {
				var e = n.$each,
					t = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",
					i = new RegExp(["\\/\\*[\\w\\W]*?\\*\\/", "\\/\\/[^\\n]*\\n", "\\/\\/[^\\n]*$", '"(?:[^"\\\\]|\\\\[\\w\\W])*"', "'(?:[^'\\\\]|\\\\[\\w\\W])*'", "[\\s\\t\\n]*\\.[\\s\\t\\n]*[$\\w\\.]+"].join("|"), "g"),
					r = /[^\w$]+/g,
					o = new RegExp(["\\b" + t.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
					l = /^\d[^,]*|,\d[^,]*/g,
					s = /^,+|,+$/g,
					m = function(e) {
						return e.replace(i, "").replace(r, ",").replace(o, "").replace(l, "").replace(s, "").split(/^$|,+/)
					};
				return function(t, i, r) {
					function o(e) {
						return "'" + e.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'"
					}

					function l(e) {
						return p += e.split(/\n/).length - 1,
							a.isCompress && (e = e.replace(/[\n\r\t\s]+/g, " ").replace(/<!--.*?-->/g, "")),
							e && (e = k[1] + o(e) + k[2] + "\n"),
							e
					}

					function s(e) {
						var t = p;
						if(u ? e = u(e) : r && (e = e.replace(/\n/g, function() {
								return p++,
									"$line=" + p + ";"
							})),
							0 === e.indexOf("=")) {
							var i = 0 !== e.indexOf("==");
							if(e = e.replace(/^=*|[\s;]*$/g, ""),
								i && a.isEscape) {
								var o = e.replace(/\s*\([^\)]+\)/, "");
								n.hasOwnProperty(o) || /^(include|print)$/.test(o) || (e = "$escape(" + e + ")")
							} else
								e = "$string(" + e + ")";
							e = k[1] + e + k[2]
						}
						return r && (e = "$line=" + t + ";" + e),
							d(e),
							e + "\n"
					}

					function d(t) {
						t = m(t),
							e(t, function(e) {
								g.hasOwnProperty(e) || (h(e),
									g[e] = !0)
							})
					}

					function h(e) {
						var t;
						"print" === e ? t = L : "include" === e ? (y.$include = n.$include,
								t = w) : (t = "$data." + e,
								n.hasOwnProperty(e) && (y[e] = n[e],
									t = 0 === e.indexOf("$") ? "$helpers." + e : t + "===undefined?$helpers." + e + ":" + t)),
							b += e + "=" + t + ","
					}
					var c = a.openTag,
						U = a.closeTag,
						u = a.parser,
						V = i,
						f = "",
						p = 1,
						g = {
							$data: 1,
							$id: 1,
							$helpers: 1,
							$out: 1,
							$line: 1
						},
						y = {},
						b = "var $helpers=this," + (r ? "$line=0," : ""),
						v = "".trim,
						k = v ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
						x = v ? "if(content!==undefined){$out+=content;return content;}" : "$out.push(content);",
						L = "function(content){" + x + "}",
						w = "function(id,data){data=data||$data;var content=$helpers.$include(id,data,$id);" + x + "}";
					e(V.split(c), function(e) {
							e = e.split(U);
							var t = e[0],
								n = e[1];
							1 === e.length ? f += l(t) : (f += s(t),
								n && (f += l(n)))
						}),
						V = f,
						r && (V = "try{" + V + "}catch(e){" + "throw {" + "id:$id," + "name:'Render Error'," + "message:e.message," + "line:$line," + "source:" + o(i) + ".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')" + "};" + "}"),
						V = b + k[0] + V + "return new String(" + k[3] + ");";
					try {
						var W = new Function("$data", "$id", V);
						return W.prototype = y,
							W
					} catch(_) {
						throw _.temp = "function anonymous($data,$id) {" + V + "}",
							_
					}
				}
			}()
	}(window),
	function(e) {
		e.openTag = "{{",
			e.closeTag = "}}",
			e.parser = function(t) {
				t = t.replace(/^\s/, "");
				var n = t.split(" "),
					a = n.shift(),
					i = n.join(" ");
				switch(a) {
					case "if":
						t = "if(" + i + "){";
						break;
					case "else":
						n = "if" === n.shift() ? " if(" + n.join(" ") + ")" : "",
							t = "}else" + n + "{";
						break;
					case "/if":
						t = "}";
						break;
					case "each":
						var r = n[0] || "$data",
							o = n[1] || "as",
							l = n[2] || "$value",
							s = n[3] || "$index",
							m = l + "," + s;
						"as" !== o && (r = "[]"),
							t = "$each(" + r + ",function(" + m + "){";
						break;
					case "/each":
						t = "});";
						break;
					case "echo":
						t = "print(" + i + ");";
						break;
					case "include":
						t = "include(" + n.join(",") + ");";
						break;
					default:
						e.helpers.hasOwnProperty(a) ? t = "==" + a + "(" + n.join(",") + ");" : (t = t.replace(/[\s;]*$/, ""),
							t = "=" + t)
				}
				return t
			}
	}(a),
	n.exports = a
});
define("qipaLogin/kit/redirect.js", ["../../config/siteDomain", "../kit/getI18nLang"], function(e, t, a) {
	var i = e("../../config/siteDomain"),
		n = i.getDomain(),
		o = top != this,
		r = e("../kit/getI18nLang").get(),
		s = {
			href: function(e, t) {
				var a = this;
				t = t || {};
				var i = a.goFromUrl(t);
				if("__blank" == e)
					o ? window.parent.open(i, "_blank") : window.open(i, "_blank");
				else {
					if("__window" == e) {
						var n, r = t.config || "";
						return n = o ? window.parent.open(i, "newwindow", r) : window.open(i, "newwindow", r),
							n || alert("请允许弹窗验证窗体。"),
							n
					}
					"__self" == e ? window.location.href = i : o ? i === window.parent.location.href ? window.parent.location.reload() : window.parent.location.href = i : window.location.href = i
				}
			},
			goFromUrl: function(e) {
				var t = e.decode === !1 ? !1 : !0,
					a = e.url,
					i = e.checkUrl,
					o = "//www." + n;
				"zh_TW" == r && (o = "http://tw.iqiyi.com"),
					t && (a = a ? decodeURIComponent(a) : "");
				var s = a;
				if(i && a && a.split("/")[2]) {
					a = a.split("/")[2];
					var l = 2;
					if(a = a.split("."),
						a = a.slice(a.length - l),
						"iqiyi.com" == a.join(".") || "pps.tv" == a.join("."))
						return s;
					a = o
				} else
					i && (a = o);
				return a
			}
		};
	a.exports = s
});
define("qipaLogin/kit/getI18nLang", [], function(e, t, n) {
	n.exports = {
		get: function() {
			var e = Q.pageInfo || {},
				t = e.lang || !1;
			return t
		}
	}
});
define("qipaLogin/interfaces/qrCodeInterface.js", ["./postInterface", "../../config/siteDomain"], function(e, t, a) {
	var i = e("./postInterface"),
		n = e("../../config/siteDomain"),
		o = n.getDomain(),
		r = i.protocol;
	a.exports = Q.Class("RIIsLogin", {
		construct: function() {
			this._remoteInterface = new i({
				genLoginTokenIf: {
					url: r + "//passport." + o + "/apis/qrcode/gen_login_token.action"
				},
				checkTokenLoginIf: {
					url: r + "//passport." + o + "/apis/qrcode/is_token_login.action"
				}
			})
		},
		methods: {
			genLoginToken: function(e, t) {
				this._remoteInterface.send({
					ifname: "genLoginTokenIf",
					param: e
				}, function(e) {
					t && t(e)
				})
			},
			checkTokenLogin: function(e, t) {
				this._remoteInterface.send({
					ifname: "checkTokenLoginIf",
					param: e
				}, function(e) {
					t && t(e)
				})
			}
		}
	})
});
define("qipaLogin/interfaces/postInterface", ["../kit/blockPingback", "./formReq", "../../kit/interceptors"], function(e, t, n) {
	var a = e("../kit/blockPingback"),
		i = new Q.ic.InfoCenter({
			moduleName: "PostInterface"
		}),
		r = e("./formReq"),
		o = Q.support && Q.support.cors,
		l = e("../../kit/interceptors"),
		s = Q.Class("RemoteInterface", {
			construct: function(e) {
				this._remoteInterfaces = e
			},
			statics: {
				protocol: o ? "https:" : window.location.protocol
			},
			methods: {
				send: function(e, t) {
					var n = this,
						s = "POST",
						m = e.withCredentials === !1 ? !1 : !0,
						d = e.ifname,
						h = n._getIfData(d);
					if(o)
						Q.ajax({
							url: h.url,
							data: e.param,
							dataType: "JSON",
							method: s,
							xhrFields: {
								withCredentials: m
							},
							success: function(e) {
								l.deepMap(e, [l.removeHttp, l.replaceQiyipic]),
									t && t(e)
							},
							error: function(e) {
								n._log(e),
									i.error("RemoteInterface onfailure url: " + h.url),
									a.send("psprt_timeout"),
									t && t({
										code: "E00000"
									})
							}
						});
					else {
						var c = {
							__POST: 1,
							cb: 1
						};
						c = Q.extend(c, e.param),
							new r({
								form: {
									action: h.url
								},
								data: c,
								callback: t,
								needDestroy: !0,
								needMd5: e.needMd5
							}).submit()
					}
				},
				_getIfData: function(e) {
					return this._remoteInterfaces[e] || this._remoteInterfaces
				},
				_log: function(e) {
					i.log("iferror" + e)
				},
				_getUrl: function(e, t) {
					var n = [];
					for(var a in t)
						n.push(a + "=" + t[a]);
					return e + "?" + n.join("&")
				}
			}
		});
	n.exports = s
});
define("qipaLogin/kit/blockPingback", ["./getPassedParams", "./getI18nLang"], function(e, t) {
	var n = e("./getPassedParams"),
		a = e("./getI18nLang").get();
	t.send = function(e, t) {
		if(e && "zh_TW" != a) {
			var i = {
				pf: n.getPF(),
				p: n.getP(),
				p1: n.getP1(),
				p2: n.getP2(),
				jsuid: Q.cookie.get("QC005"),
				u: Q.cookie.get("QC005"),
				pu: Q.cookie.get("P00003")
			};
			t ? (i.t = "20",
				i.rseat = e) : (i.t = "21",
				i.block = e);
			var r = "http://msg.qy.net/b";
			"https:" === window.location.protocol && (r = "https://msg.qy.net/b"),
				Q.log.server(i, r)
		}
	}
});
define("qipaLogin/kit/getPassedParams", ["./getI18nLang"], function(e, t, n) {
	var a = e("./getI18nLang").get();
	n.exports = {
		getAgenttype: function() {
			var e = Q.url.getQueryValue(location.href, "agenttype");
			return e = e ? e : 1
		},
		getPtid: function() {
			var e = Q.url.getQueryValue(location.href, "ptid"),
				t = "zh_TW" == a ? "01010021010010000000" : "01010021010000000000";
			return e = e ? e : t
		},
		getPF: function() {
			var e = Q.url.getQueryValue(location.href, "pf"),
				t = 1;
			return e = e ? e : t
		},
		getP: function() {
			var e = Q.url.getQueryValue(location.href, "p"),
				t = 10;
			return e = e ? e : t
		},
		getP1: function() {
			var e = Q.url.getQueryValue(location.href, "p1"),
				t = 101;
			return e = e ? e : t
		},
		getP2: function() {
			var e = Q.url.getQueryValue(location.href, "p2"),
				t = "1_10_101";
			return e = e ? e : t
		},
		getAllParams: function() {
			var e = this.getAgenttype(),
				t = this.getPtid(),
				n = this.getPF(),
				a = this.getP(),
				i = this.getP1(),
				r = this.getP2();
			if(1 === e)
				return "";
			var o = "agenttype=" + e;
			return o += "&ptid=" + t,
				o += "&pf=" + n,
				o += "&p=" + a,
				o += "&p1=" + i,
				o += "&p2=" + r
		}
	}
});
define("qipaLogin/interfaces/formReq", ["../../kit/interceptors", "../kit/blockPingback"], function(e, t, n) {
	var a = new Q.ic.InfoCenter({
			moduleName: "FormReq"
		}),
		i = window.jQuery || window.Q,
		r = "__IFRAME__",
		o = "display:none;",
		l = "__FORM__",
		s = "display:none;",
		m = "__CALLBACK__",
		d = function(e) {
			a.log(e)
		},
		h = e("../../kit/interceptors"),
		c = e("../kit/blockPingback"),
		U = Q.Class("FormRequest", {
			construct: function(e) {
				e = e || {},
					this.form = e.form || {},
					this.data = e.data || [],
					this.iframe = e.iframe || {},
					this.callbackName = e.callbackName || m + Math.floor(2147483648 * Math.random()).toString(36),
					this.randomCb = e.callbackName ? !1 : !0,
					this.callback = e.callback || d,
					this.needIframe = e.needIframe === !1 || e.needIframe === !0 ? e.needIframe : !0,
					this.needDestroy = e.needDestroy || !1,
					this.noTranslateKeys = e.noTranslateKeys || [],
					this.needMd5 = e.needMd5 || !1,
					this.init()
			},
			methods: {
				init: function() {
					r += Math.floor(2147483648 * Math.random()).toString(36),
						this.form = this._dealForm(this.form),
						this.formElem = this._createForm(this.form),
						this._importData(this.formElem, this.data),
						this.needIframe && (this.iframe = this._dealIframe(this.iframe),
							this.iframeElem = this._createIframe(this.iframe))
				},
				_translateStr: function(e, t) {
					if(e = e || "",
						e && "string" == typeof e && e.length)
						for(var n = [{
								origin: '"',
								dest: "&quot;"
							}, {
								origin: "<",
								dest: "&lt;"
							}, {
								origin: ">",
								dest: "&gt;"
							}, {
								origin: "\\\\",
								dest: "&#92;"
							}, {
								origin: "&",
								dest: "&amp;"
							}], a = "&", i = 0; i < n.length; i++) {
							var r = n[i].origin;
							if(r !== a || !t) {
								var o = new RegExp(r, "g"),
									l = n[i].dest;
								e = e.replace(o, l)
							}
						}
					return e
				},
				_dealForm: function(e) {
					return e = e || {},
						e instanceof i || (e["accept-charset"] = e["accept-charset"] || "utf-8",
							e.action = e.action || "",
							e.enctype = e.enctype || "application/x-www-form-urlencoded",
							e.method = e.method || "post",
							e.name = e.name || l,
							e.target = e.target || r,
							e.style = e.style || s,
							e["class"] = e["class"] || ""),
						e
				},
				_createForm: function(e) {
					e = e || {};
					var t = {};
					if(e instanceof i || i.isEmptyObject(e))
						t = e;
					else {
						i('form[name="' + e.name + '"]').length ? (t = i('form[name="' + e.name + '"]'),
							t.empty()) : (t = i("<form></form>"),
							t.appendTo("body"));
						for(var n in e)
							e[n] && t.attr(n, e[n])
					}
					return t
				},
				_dealIframe: function(e) {
					return e = e || {},
						e instanceof i || (e.style = e.style || o,
							e.name = e.name || r),
						e
				},
				_createIframe: function(e) {
					e = e || {};
					var t = {};
					return e instanceof i || i.isEmptyObject(e) ? t = e : i('iframe[name="' + e.name + '"]').length ? t = i('iframe[name="' + e.name + '"]') : (t = i('<iframe style="' + e.style + '" name="' + e.name + '"></iframe>'),
							t.appendTo("body")),
						t
				},
				_importData: function(e, t) {
					if(e instanceof i) {
						i.isEmptyObject(t) || i.isArray(t) || (this.randomCb && (t.callback = "window.parent." + this.callbackName),
							t = this.sortData(t));
						for(var n = 0; n < t.length; n++) {
							var a = this._translateStr(String(t[n].name)),
								r = String(t[n].value);
							t[n].noTranslateAmp || !1,
								r = this.noTranslateKeys.indexOf(a) >= 0 ? this._translateStr(r, !0) : this._translateStr(r);
							var o = String(t[n].type || "text");
							if(a) {
								var l = e.find('input[name="' + a + '"]');
								if(l.length)
									l.attr("name", r);
								else {
									var s = '<input name="{{name}}" value="{{value}}" type="{{type}}" />';
									s = s.replace(/{{name}}/g, a),
										s = s.replace(/{{value}}/g, r),
										s = s.replace(/{{type}}/g, o),
										e.append(i(s))
								}
							}
						}
					}
					return !0
				},
				submit: function() {
					var e = this;
					if(this.formElem instanceof i) {
						var t = this.formElem[0];
						try {
							this.needIframe && (window[this.callbackName] = this.needDestroy && this.callback ? function(t) {
										h.deepMap(t, [h.removeHttp, h.replaceQiyipic]),
											e.callback(t),
											e.iframeElem instanceof i && e.iframeElem.remove(),
											e.randomCb && (window[e.callbackName] = null)
									} :
									this.callback),
								t.submit(),
								this.needDestroy && this.formElem.remove()
						} catch(n) {
							a.log(n),
								c.send("psprt_timeout"),
								this.callback && this.callback({
									code: "E00000",
									msg: "表单出错！",
									data: n
								})
						}
					}
				},
				reset: function() {
					if(this.formElem instanceof i) {
						var e = this.formElem[0];
						e.reset()
					}
				},
				sortData: function(e) {
					var t = [];
					for(var n in e) {
						var a = {
							name: n,
							value: e[n],
							type: "text"
						};
						t.push(a)
					}
					if(this.needMd5) {
						t.sort(function(e, t) {
							return e.name < t.name ? -1 : e.name > t.name ? 1 : 0
						});
						for(var i = {}, r = 0; r < t.length; r++)
							i[t[r].name] = t[r].value;
						var o = Q.crypto.md5(decodeURIComponent(Q.url.jsonToQuery(i)) + "tS7BdPLU2w0JD89dh");
						t.push({
							name: "qd_sc",
							value: o,
							type: "text"
						})
					}
					return t
				}
			}
		});
	n.exports = U
});
define("kit/interceptors", [], function(e, t) {
	"use strict";

	function n(e, t) {
		var a, i, r, o, l, s = e;
		if("string" == typeof e) {
			for(r = 0; r < t.length; r++)
				i = t[r],
				s = i(s);
			return s
		}
		for(o in e)
			if(e.hasOwnProperty(o))
				if(l = e[o],
					a = "object" == typeof l && null !== l)
					n(l, t);
				else if("string" == typeof l)
			for(r = 0; r < t.length; r++)
				i = t[r],
				e[o] = i(e[o], o, e)
	}

	function a(e) {
		if("string" == typeof e)
			return e.replace(/^http:/, "");
		var t, n, i;
		for(t in e)
			e.hasOwnProperty(t) && (n = e[t],
				i = "object" == typeof n && null !== n,
				i ? a(n) : "string" == typeof n && (e[t] = n.replace(/^http:/, "")));
		return e
	}
	t.deepMap = n,
		t.removeHttp = a,
		t.replaceQiyipic = function(e) {
			return "string" != typeof e ? e : e.replace(".qiyipic.com", ".iqiyipic.com")
		}
});
define("qipaLogin/kit/qrCoderUrl.js", [], function(e, t, a) {
	var i = "//qrcode.iqiyipic.com/login/?";
	a.exports = {
		getQrCoder: function(e) {
			var t = e.data,
				a = encodeURIComponent(t),
				n = e.md5 || "35f4223bb8f6c8638dc91d94e9b16f5";
			e.property = e.property || 0;
			for(var o = [{
					key: "!",
					value: "%21"
				}], r = 0, s = o.length; s > r; r++) {
				var l = new RegExp(o[r].key, "g");
				a = a.replace(l, o[r].value)
			}
			var d = n + a,
				c = Q.crypto.md5(d),
				u = [];
			u.push("data=" + a),
				u.push("salt=" + c);
			for(var p in e)
				"data" != p && u.push(p + "=" + e[p]);
			var m = i + u.join("&");
			return m
		}
	}
});
define("qipaLogin/kit/setCookie.js", ["../../config/siteDomain", "../kit/redirect", "../kit/getI18nLang"], function(e, t, a) {
	new Q.ic.InfoCenter({
			moduleName: "setCookie"
		}),
		Q.event.customEvent;
	var i = e("../../config/siteDomain"),
		n = i.getDomain(),
		o = top != this,
		r = e("../kit/redirect"),
		s = e("../kit/getI18nLang").get();
	a.exports = {
		setLoginCookie: function(e, t, a, i, o, r) {
			var l = this,
				d = Q.cookie.get("QC160");
			if(d) {
				d = JSON.parse(d),
					e && (d.local.acode = e),
					t && (d.local.name = t),
					a && (d.u = a),
					d.lang = s ? s : "",
					d.type = i ? i : "p1";
				var c = JSON.stringify(d);
				Q.cookie.set("QC160", c, {
					expires: 2592e6,
					path: "/",
					domain: n
				})
			}
			o && l.closeFrame(o, r)
		},
		closeFrame: function(e, t) {
			setTimeout(function() {
				if(o)
					window.parent.__frameOnLogin ? (Q.browser.iPad && Q.browser.SAFARI && window.location.reload(),
						window.parent.__frameOnLogin(e, t)) : t && window.parent.location.reload();
				else if(t) {
					var a = Q.url.getQueryValue(location.href, "from_url");
					r.href("__self", {
						url: a,
						checkUrl: !0
					})
				}
			}, 1e3)
		}
	}
});
define("qipaLogin/kit/newsso.js", ["../../config/siteDomain", "./jsonp", "../../kit/checkI18nType"], function(e, t, a) {
	var i = new Q.ic.InfoCenter({
			moduleName: "qipalogin/kit/sso"
		}),
		n = e("../../config/siteDomain"),
		o = e("./jsonp"),
		r = e("../../kit/checkI18nType"),
		s = top != this,
		l = function(e, t) {
			if(s && window.parent.__frameDoSync)
				window.parent.__frameDoSync();
			else {
				var a = n.getDomain(),
					l = "",
					d = "";
				/pps/.test(a) && !t ? (l = "https://passport.pps.tv/apis/user/sso/cd/token.action",
					d = "https://passport.iqiyi.com/apis/user/sso/cd/cookie.action") : (l = "https://passport.iqiyi.com/apis/user/sso/cd/token.action",
					d = "https://passport.pps.tv/apis/user/sso/cd/cookie.action");
				var c = r.type ? "01010021010000000000" : "01010021010010000000",
					u = {
						agenttype: "1",
						callback: "callback",
						ptid: c
					};
				o(l, {
					data: u,
					sign: !0,
					onsuccess: function(t) {
						if(t && "A00000" == t.code)
							if(t.data && t.data.token) {
								var a = {
									agenttype: "1",
									callback: "callback",
									token: t.data.token
								};
								o(d, {
									data: a,
									sign: !0,
									onsuccess: function() {
										"function" == typeof e && e("A00000"),
											i.log("调用" + d + "接口成功")
									},
									onfailure: function() {
										"function" == typeof e && e("E00001"),
											i.log("调用" + d + "接口超时")
									}
								})
							} else
								"function" == typeof e && e("A00000"),
								i.log("调用" + l + "接口成功")
					},
					onfailure: function() {
						"function" == typeof e && e("E00001"),
							i.warn("调用" + l + "接口超时")
					}
				})
			}
		};
	a.exports = l
});
define("qipaLogin/kit/jsonp.js", ["../../kit/getSign"], function(e, t, a) {
	var i = Q.url.jsonToQuery,
		n = e("../../kit/getSign");
	window.lib = window.lib || {},
		window.lib.__callbacks__ = window.lib.__callbacks__ || {};
	var o = function(e) {
			return RegExp("\\?").test(e) ? "&" : "?"
		},
		r = function(e, t) {
			var a = document.createElement("SCRIPT");
			return a.setAttribute("type", "text/javascript"),
				t && a.setAttribute("charset", t),
				a.setAttribute("src", e),
				document.getElementsByTagName("head")[0].appendChild(a),
				a
		},
		s = function(e) {
			e.clearAttributes && e.clearAttributes(),
				e && e.parentNode && e.parentNode.removeChild(e),
				e = null
		},
		l = function(e, t) {
			var a, l, d, c = t.data,
				u = t.timeout || 1e4,
				p = t.onsuccess,
				m = t.onfailure,
				h = "cb" + Math.floor(2147483648 * Math.random()).toString(36),
				f = "callback",
				g = "window.lib.__callbacks__." + h,
				v = window.lib.__callbacks__;
			p && (c[f] = g,
					t.sign && (c.qd_sc = n(c)),
					v[h] = function(e) {
						a && clearTimeout(a),
							p(e),
							delete v[h],
							s(l)
					},
					d = e + o(e) + i(c, window.encodeURIComponent)),
				l = r(d, t.charset),
				a = setTimeout(function() {
					s(l),
						m()
				}, u)
		};
	a.exports = l
});
define("kit/getSign", [], function(e, t, n) {
	"use strict";

	function a(e) {
		var t = Q.url.jsonToQuery(e),
			n = decodeURIComponent(t),
			a = Q.crypto.md5(n + "tS7BdPLU2w0JD89dh");
		return a
	}
	n.exports = a
});
define("kit/checkI18nType", [], function(e, t, n) {
	var a, i = Q.PageInfo || {},
		r = "tw_t" === i.i18n ? !1 : !0;
	a = r ? "cn_s" : "tw_t",
		n.exports = {
			type: r,
			mod: a
		}
});
define("qipaLogin/units/passLogin.js", ["../../components/units/pageJob", "../../config/siteDomain", "../kit/mailSuggest", "../kit/zoneList", "../kit/pwdEye", "../kit/formateMobile", "../../kit/validate", "../kit/mobileCheck", "../kit/piccode", "../kit/slidePiccode", "../interfaces/loginInterface", "../kit/newsso", "../config/loginreg", "../kit/getI18nLang", "../kit/setCookie", "../kit/redirect", "../kit/blockPingback", "../kit/bindPhone", "../kit/getPassedParams"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = e("../../config/siteDomain");
	a.getDomain();
	var i, n, o = e("../kit/mailSuggest"),
		r = e("../kit/zoneList"),
		s = e("../kit/pwdEye"),
		l = e("../kit/formateMobile"),
		d = e("../../kit/validate"),
		c = e("../kit/mobileCheck"),
		u = e("../kit/piccode"),
		p = e("../kit/slidePiccode"),
		m = e("../interfaces/loginInterface"),
		h = new m,
		f = e("../kit/newsso"),
		g = e("../config/loginreg"),
		v = e("../kit/getI18nLang").get(),
		y = e("../kit/setCookie"),
		b = Q.event.customEvent,
		w = e("../kit/redirect"),
		V = top != this,
		U = e("../kit/blockPingback"),
		k = e("../kit/bindPhone"),
		_ = e("../kit/getPassedParams"),
		x = _.getAgenttype(),
		I = _.getPtid(),
		C = v ? v : "",
		L = "passLogin",
		P = "",
		T = {},
		S = {},
		E = null,
		W = null,
		D = null,
		A = "",
		X = !1,
		N = "请稍后重试",
		F = !1,
		K = Q.browser.iPad && Q.browser.SAFARI;
	t.create(L, {
			getDependentDoms: function() {
				return T = {
						passLogin: Q("[data-loginele='passLogin']")
					},
					"zh_TW" == v ? (S = g.twMsg,
						N = "請稍後嘗試") : S = g.msg, !0
			},
			check: function() {
				return !0
			},
			init: function() {
				var e = this;
				T.passLogin[0] && (Q("[data-qipalogin-login]").hasClass("dn") || T.passLogin.hasClass("dn") || (e.initDom(),
						e._bindEvent(),
						X = !0),
					b.on("lazyloadPassLogin", function() {
						X || (e.initDom(),
							e._bindEvent(),
							X = !0)
					}))
			},
			initDom: function() {
				T = {
					passLogin: Q("[data-loginele='passLogin']"),
					loding: Q("[data-loginele='loding']"),
					suc: Q("[data-loginele='suc']"),
					nameContainer: Q("[data-pwdloginbox='nameContainer']"),
					pwdContainer: Q("[data-pwdloginbox='pwdContainer']"),
					name: Q("[data-pwdloginbox='name']"),
					nameInputArea: Q("[data-pwdloginbox='nameInputArea']"),
					nameTip: Q("[data-pwdloginbox='nameTip']"),
					nameErr: Q("[data-pwdloginbox='nameErr']"),
					pwd: Q("[data-pwdloginbox='pwd']"),
					pwdInputArea: Q("[data-pwdloginbox='pwdInputArea']"),
					pwdTip: Q("[data-pwdloginbox='pwdTip']"),
					pwdErr: Q("[data-pwdloginbox='pwdErr']"),
					eyeBtn: Q("[data-pwdloginbox='eye']"),
					zoneArea: Q("[data-pwdloginbox='zoneArea']"),
					selectedZ: Q("[data-pwdloginbox='selectedZone']"),
					zoneArrow: Q("[data-pwdloginbox='zoneArrow']"),
					zone: Q("[data-pwdloginbox='zone']"),
					mailWrapper: Q('[data-pwdloginbox="loginMailSuggest"]'),
					loginBtn: Q("[data-pwdloginbox='loginBtn']"),
					forgetPwdBtn: Q("[data-pwdloginbox='forgetPwdBtn']"),
					forgetPwdZone: Q("[data-pwdloginbox='forgetPwdZone']"),
					goRegBtn: Q("[data-pwdloginbox='goReg']"),
					nick: Q("[data-pwdloginbox='nick']"),
					icon: Q("[data-pwdloginbox='icon']"),
					hit: Q("[data-loginele='hit']"),
					fengkong: Q("[data-loginele='fengkong']")
				}
			},
			_bindEvent: function() {
				var e = this;
				e._pwdEvent(),
					e._initZoneList(),
					e._initMobileKit(),
					K ? e._padSafariEvent() : e._initMailSuggest(),
					e._initPwdEye(),
					T.loginBtn.on("click", function(t) {
						Q(this).hasClass("btn-gray") ? T.name.val().trim() ? U.send("psprt_formerr") : U.send("psprt_nonull") : (Q.event.get(t).preventDefault(),
							e.checkLoginInfo(!1))
					}),
					T.goRegBtn.on("click", function() {
						if(T.name.val().indexOf("@") < 0) {
							var e = T.selectedZ.attr("data-key"),
								t = T.selectedZ.html();
							b.fire({
								type: "LoginGuideReg",
								data: {
									newKey: e,
									zoneName: t,
									mobile: T.name.val()
								}
							})
						} else
							b.fire({
								type: "LoginGuideReg",
								data: {}
							});
						Q(document.body).removeClass("embed-container")
					}),
					Q(document).on("click", function(e) {
						try {
							var t = Q(e.target).attr("data-pwdloginbox"),
								a = "zoneArea" == t || "zoneArea" == Q(e.target.parentNode).attr("data-pwdloginbox");
							!a && T.zoneArrow.hasClass("arrow-all-reverse") && (T.zoneArrow.removeClass("arrow-all-reverse"),
									T.zone.addClass("dn")),
								"forgetPwdBtn" != t && T.forgetPwdZone.addClass("dn")
						} catch(i) {}
					}),
					b.on("passLoginCheckPiccode", function(t) {
						P = t.data.picVal,
							e.doLogin(!0)
					}),
					b.on("setEnableStatusLogin", function(e) {
						e.data.enable && T.pwd.val() ? T.loginBtn.removeClass("btn-gray") : T.loginBtn.addClass("btn-gray"),
							e.hideReg && T.goRegBtn.addClass("dn")
					})
			},
			_padSafariEvent: function() {
				var e = T.loginBtn.parent(),
					t = e.parent(),
					a = Q('<form onsubmit="return false"></form');
				t.append(a),
					a.append(e)
			},
			_pwdEvent: function() {
				var e = this;
				T.pwd.val() && T.pwdContainer.addClass("accountIn"),
					T.pwdInputArea.on("click", function() {
						e.hideErrMsg(T.pwdErr, T.pwdTip, T.pwdContainer),
							T.pwd.focus()
					}),
					T.pwd.on("focus", function() {
						T.pwdErr.addClass("vh"),
							T.pwdTip.show(),
							T.pwdContainer.addClass("accountIn")
					}),
					T.pwd.on("blur", function() {
						var t = e.checkPwdValidate(!0);
						e.setLoginBtnStatus(t),
							T.pwdContainer.removeClass("accountIn"),
							T.pwd.val() ? T.pwdTip.addClass("tip-info-active") : T.pwdTip.removeClass("tip-info-active")
					}),
					T.pwd.on("keydown", function(t) {
						var a = t.keyCode + "";
						"13" == a ? (U.send("pld_lgbtn", !0),
							e.checkLoginInfo(!0)) : e.hideErrMsg(T.pwdErr, T.pwdTip, T.pwdContainer)
					}),
					T.pwd.on("keyup input", function(t) {
						var a = Q(t.target).val().trim();
						e.setLoginBtnStatus(a)
					}),
					T.forgetPwdBtn.on("mouseenter", function(e) {
						e.preventDefault(),
							T.forgetPwdZone.removeClass("dn")
					}),
					T.forgetPwdBtn.on("mouseleave", function(e) {
						e.preventDefault(),
							i = window.setTimeout(function() {
								T.forgetPwdZone.addClass("dn")
							}, 300)
					}),
					T.forgetPwdZone.on("mouseenter", function(e) {
						e.preventDefault(),
							clearTimeout(i)
					}),
					T.forgetPwdZone.on("mouseleave", function(e) {
						e.preventDefault(),
							T.forgetPwdZone.addClass("dn")
					})
			},
			checkPwdValidate: function(e) {
				var t = this;
				return T.pwd.val() ? (t.hideErrMsg(T.pwdErr, T.pwdTip, T.pwdContainer), !0) : e ? (t.showPlacehoder(T.pwdTip, T.pwdContainer), !1) : (t.showErrMsg(T.pwdErr, S.pwdMsg, T.pwdTip),
					t.showPlacehoder(T.pwdTip, T.pwdContainer), !1)
			},
			_initPwdEye: function() {
				var e = new s({
					wrapper: T.eyeBtn,
					pwdArea: T.pwd
				});
				e.init()
			},
			_initZoneList: function() {
				var e = this,
					t = new r({
						wrapper: T.zone,
						zoneArea: T.zoneArea,
						selZone: T.selectedZ,
						arrow: T.zoneArrow,
						zoneChangeFireName: "zoneChangedLogin"
					});
				t.init(function(t) {
					var a = !1;
					t.u ? (a = !0,
							e.hideErrMsg(T.nameErr, T.nameTip, T.nameContainer),
							T.name.val(t.u),
							W ? (W.updateUnderline(),
								F = !1) : F = !0) : T.name.val(""), !a && T.name.val() && T.name.val().indexOf("@") < 0 && T.name.trigger("blur"),
						T.name.val() && T.pwd.val() && T.nameErr.hasClass("vh") && T.loginBtn.removeClass("btn-gray");
					var i = T.selectedZ.attr("data-key");
					b.fire({
						type: "zoneChangedLogin",
						data: {
							key: i,
							noFormate: !0
						}
					})
				})
			},
			_initMobileKit: function() {
				W = new c({
						nameContainer: T.nameContainer,
						name: T.name,
						nameInputArea: T.nameInputArea,
						nameTip: T.nameTip,
						nameErr: T.nameErr,
						mailWrapper: T.mailWrapper,
						zoneKey: T.selectedZ.attr("data-key"),
						fireEnableName: "setEnableStatusLogin",
						zoneChangeFireName: "zoneChangedLogin"
					}),
					W.init(),
					F && W.updateUnderline()
			},
			_initMailSuggest: function() {
				var e = new o({
					wrapper: T.mailWrapper,
					input: T.name,
					pattern: /^[0-9a-zA-Z_][-_\.0-9a-zA-Z-]{1,}@([0-9a-zA-Z][0-9a-zA-Z-])*/,
					prompt: !1,
					max: 3
				});
				e.init()
			},
			_hitEvent: function() {
				var e = Q("[data-hit-pwdtip]"),
					t = Q("[data-hit-pwdcont]");
				e.on("mouseenter", function(e) {
						e.preventDefault(),
							t.removeClass("dn")
					}),
					e.on("mouseleave", function(e) {
						e.preventDefault(),
							n = window.setTimeout(function() {
								t.addClass("dn")
							}, 300)
					}),
					t.on("mouseenter", function(e) {
						e.preventDefault(),
							clearTimeout(n)
					}),
					t.on("mouseleave", function(e) {
						e.preventDefault(),
							t.addClass("dn")
					}),
					T.hit.find("[data-type]").on("click", function(e) {
						e.preventDefault(),
							Q(this).attr("data-type");
						var t = Q(this).attr("data-url");
						w.href("", {
							url: t
						})
					})
			},
			showPlacehoder: function(e, t) {
				e.show(),
					t.removeClass("accountIn")
			},
			showErrMsg: function(e, t, a, i) {
				a.hide();
				var n = "<span>" + t + "</span>";
				i && (t.length >= 16 ? e.addClass("errorInfo-m") : e.removeClass("errorInfo-m")),
					e.html(n).removeClass("vh")
			},
			hideErrMsg: function(e, t, a) {
				e.addClass("vh"),
					t.show(),
					a.addClass("accountIn")
			},
			checkLoginInfo: function(e) {
				var t = this,
					a = W.checkNameValidate(!0, !1);
				if(a) {
					var i = t.checkPwdValidate();
					i && (T.loginBtn.removeClass("btn-gray"),
						t.doLogin())
				} else
					e && !T.pwd.val().trim() ? (t.showPlacehoder(T.pwdTip, T.pwdContainer),
						T.pwd.blur(),
						T.loginBtn.addClass("btn-gray"),
						U.send("psprt_nonull")) : U.send("psprt_formerr")
			},
			setLoginBtnStatus: function(e) {
				T.nameErr.hasClass("vh") && e ? T.loginBtn.removeClass("btn-gray") : T.loginBtn.addClass("btn-gray")
			},
			doLogin: function(e) {
				var t = this,
					a = t.getLoginData();
				K && T.eyeBtn.hasClass("eye-open") && (T.eyeBtn.removeClass("eye-open"),
						T.pwd.attr("type", "password")),
					T.passLogin.addClass("dn"),
					T.loding.removeClass("dn"),
					h.send(a, function(a) {
						T.loding.addClass("dn"),
							T.goRegBtn.addClass("dn");
						var i = a.msg || S[a.code] || N;
						if(A = "",
							P = "",
							"A00000" == a.code && a.data) {
							var n = a.data;
							"1" == n.highrisk_state && n.redirect ? (U.send("pcwsklrt"),
								w.href("", {
									url: n.redirect
								})) : (f(),
								b.fire({
									type: "login",
									data: {}
								}),
								t.getUserInfo(n))
						} else if("P00107" == a.code) {
							var o = a.data.imgtype;
							"4" != o || Q.browser.IE7 ? t.showPiccode(e, i) : t.showSlidePiccode()
						} else
							"P00807" == a.code ? k.goBndPhone("passLogin") : "P00159" === a.code ? b.fire({
								type: "showQrCodeLogin",
								data: {
									type: "hrisk"
								}
							}) : (T.passLogin.removeClass("dn"),
								"P00117" == a.code ? t.showErrMsg(T.pwdErr, i, T.pwdTip) : "P00119" == a.code || "P00125" == a.code ? (t.showErrMsg(T.pwdErr, i, T.pwdTip),
									T.forgetPwdZone.removeClass("dn")) : "P00108" == a.code ? (t.showErrMsg(T.nameErr, i, T.nameTip, !0),
									T.goRegBtn.removeClass("dn")) : "A00055" == a.code ? b.fire({
									type: "showQrCodeLogin",
									data: {
										type: "abnormal"
									}
								}) : "P00908" == a.code ? b.fire({
									type: "showQrCodeLogin",
									data: {
										type: "lock",
										mobile: T.name.val().replace(/^(\d{3})\s?\d{4}\s?(\d{4})$/, "$1****$2")
									}
								}) : t.showErrMsg(T.nameErr, i, T.nameTip, !0))
					})
			},
			getRealNameVal: function() {
				var e, t = T.name.val();
				return e = t.indexOf("@") < 0 ? d.trimALLToE(t) : d.trimAllBlank(t)
			},
			getLoginData: function() {
				var e = this.getRealNameVal(),
					t = {
						email: e,
						passwd: T.pwd.val().trim(),
						agenttype: x,
						__NEW: 1,
						checkExist: 1,
						piccode: P ? P.trim() : "",
						lang: C,
						ptid: I
					};
				return "zh_TW" != v && (t.verifyPhone = 1),
					e.indexOf("@") < 0 && (t.area_code = T.selectedZ.attr("data-key")),
					A && (t.slide = 1,
						t.slidetoken = A), {
						param: t
					}
			},
			getUserInfo: function(e) {
				var t = this;
				t.showLoginSucInfo(e),
					t.setCookie(),
					V && b.fire({
						type: "saveLoginSusData",
						data: {
							data: e
						}
					});
				var a = {
					agenttype: x,
					ptid: I,
					lang: C
				};
				h.info(a, function(a) {
					var i = a.data;
					if("A00000" == a.code && i)
						if("1" == i.insecure_account || "2" == i.insecure_account) {
							T.passLogin.addClass("dn"),
								i.userinfo.phone || T.hit.find('[data-show="bindphone"]').removeClass("dn"), !i.userinfo.activated && i.userinfo.email && T.hit.find('[data-show="verifyemail"]').removeClass("dn"),
								T.hit.removeClass("dn");
							var n = T.hit.attr("data-block-name");
							U.send(n),
								t._hitEvent()
						} else
							y.closeFrame(e, !0);
					else
						"A00000" != a.code && y.closeFrame(e, !0)
				})
			},
			showLoginSucInfo: function(e) {
				T.passLogin.removeClass("dn"),
					T.nick.html(e.nickname || "一名用户"),
					e.icon && T.icon.attr("src", e.icon),
					T.suc.removeClass("dn");
				var t = T.suc.attr("data-block-name");
				U.send(t)
			},
			setCookie: function() {
				var e = this,
					t = T.selectedZ.attr("data-key"),
					a = T.selectedZ.html(),
					i = e.getRealNameVal();
				y.setLoginCookie(t, a, i, "p1", null, !1)
			},
			showPiccode: function(e, t) {
				var a = Q("[data-loginele='wrapper']");
				e && E ? E.showPiccodeErr(t) : E ? E.reloadPiccode() : (E = new u({
						container: Q("[data-loginele='piccode']"),
						wrapper: a,
						fireName: "passLoginCheckPiccode"
					}),
					E.init());
				var i = a.attr("data-block-name");
				U.send(i)
			},
			showFengkong: function() {
				var e = T.passLogin.find("[data-pwdloginbox='selectedZone']"),
					t = T.passLogin.find("[data-pwdloginbox='name']"),
					a = T.fengkong.find('[data-show="bindphone"]'),
					i = e.attr("data-key"),
					n = e.html(),
					o = d.trimALLToE(t.val());
				Q(document).undelegate("[data-fengkong-sendsms]", "click"),
					l.getFormateType(i, o) ? (a.removeClass("dn"),
						Q(document).delegate("[data-fengkong-sendsms]", "click", function(e) {
							e.preventDefault(),
								y.setLoginCookie(i, n, o, "p1", null, !1),
								w.href("__blank", {
									url: "//www.iqiyi.com/iframe/smslogin?is_reg=1&first_show=1&type=1&smsup=1"
								})
						})) : a.addClass("dn"),
					T.fengkong.removeClass("dn");
				var r = T.fengkong.attr("data-block-name");
				U.send(r)
			},
			showSlidePiccode: function() {
				var e = this,
					t = Q('[data-loginele="slidePiccode"]');
				if(D)
					D.render(),
					e.dealSpiccode();
				else {
					T.loding.removeClass("dn");
					var a = !1,
						i = null;
					p.requireSlide(function() {
						function n() {
							clearTimeout(i),
								i = setTimeout(function() {
									a || (T.loding.addClass("dn"),
										clearTimeout(i),
										T.passLogin.removeClass("dn"),
										window.console && window.console.warn && window.console.warn("滑动验证码加载失败"),
										e.showErrMsg(T.nameErr, N, T.nameTip, !0))
								}, 3e3)
						}
						n(),
							window._vcs.run("slide", {
								id: "slidePiccode",
								title: !1,
								agenttype: x,
								type: !1,
								width: 360,
								height: 214,
								ptid: I,
								language: "zh_TW" == v ? "t_cn" : "s_cn",
								callback: function(a) {
									"A00000" == a.code ? (A = a.token,
										e.doLogin(),
										t.addClass("dn"),
										U.send("slip_ok")) : U.send("slip_fail")
								},
								DomLoadCallback: function() {
									a = !0,
										clearTimeout(i),
										T.loding.addClass("dn"),
										e.dealSpiccode()
								}
							}, function(e) {
								D = e
							})
					})
				}
			},
			dealSpiccode: function() {
				var e = Q('[data-loginele="slidePiccode"]');
				e.find(".refresh").attr("rseat", "vp_refresh"),
					e.find(".help").attr("rseat", "psprt_sliphelp"),
					e.removeClass("dn");
				var t = e.attr("data-block-name");
				U.send(t)
			}
		}),
		t.add(L)
});
define("qipaLogin/kit/mailSuggest.js", ["../../kit/validate"], function(e, t, a) {
	var i = Q.event.customEvent,
		n = e("../../kit/validate"),
		o = function(e) {
			this.wrapper = e.wrapper,
				this._input = e.input,
				this._curStr = "",
				this.pattern = e.pattern,
				this._mails = e.mails || ["qq.com", "163.com", "126.com", "sina.com", "sina.cn", "hotmail.com", "gmail.com", "yahoo.cn", "139.com"],
				this._max = e.max || 4
		};
	o.prototype = {
			init: function() {
				return this.wrapper[0] && this._input[0] ? (this.bindEvent(),
					this) : void 0
			},
			getTpl: function(e) {
				for(var t = "<ul>", a = e.length, i = 0; a > i; i++) {
					var n = e[i];
					t += 0 === i ? '<li><a href="javascript:;" class="selected dropDown_item" data-index="' + n.index + '" data-mailsuggest-elem="item">' + n.mail + "</a></li>" : '<li ><a href="javascript:;" class="dropDown_item" data-index="' + n.index + '" data-mailsuggest-elem="item">' + n.mail + "</a></li>"
				}
				return t += "</ul>"
			},
			bindEvent: function() {
				var e = this,
					t = {
						13: "enter",
						27: "esc",
						37: "left",
						38: "up",
						39: "right",
						40: "down",
						9: "tab"
					};
				e._input.on("keydown", function(a) {
						var i = a.keyCode + "";
						return i in t ? ("38" == i || "40" == i ? ("38" == i && a.preventDefault(),
								e.changeSuggest(t[i])) : "13" == i && e.enterSuggest(),
							void 0) : (setTimeout(function() {
								e.useCorrectSuggest()
							}, 50),
							void 0)
					}),
					e._input.on("focus", function() {
						e._input.val() && e.useCorrectSuggest()
					}),
					e._input.on("blur", function() {
						i.fire({
							type: "mailSuggestHide",
							data: {
								input: e._input
							}
						})
					}),
					e.wrapper.delegate('[data-mailsuggest-elem="item"]', "click", function() {
						var t = parseInt(Q(this).attr("data-index"), 10);
						if(0 !== t) {
							var a = Q(this).html();
							e._input.val(a),
								e.wrapper.hide(),
								i.fire({
									type: "mailSuggestHide",
									data: {
										input: e._input
									}
								})
						}
					}),
					e.wrapper.delegate('[data-mailsuggest-elem="item"]', "mouseover", function() {
						var t = parseInt(Q(this).attr("data-index"), 10),
							a = e.suggests;
						a.each(function(a, i) {
							i = Q(i),
								a !== t ? i.removeClass("selected") : (i.addClass("selected"),
									e._input.val(i.html()))
						})
					})
			},
			useCorrectSuggest: function() {
				var e = this,
					t = e._input.val() || "";
				e._curStr = n.trimAllBlank(t);
				var a = e.assemble(e.parseMail());
				if(e._curStr && a.length > 0)
					if(!e.pattern || e.pattern && e.pattern.test(e._curStr)) {
						var i = e.getTpl(a);
						e.wrapper.html(i),
							e.suggests = e.wrapper.find('[data-mailsuggest-elem="item"]'),
							e.wrapper.show()
					} else
						e.wrapper.hide();
				else
					e.wrapper.hide()
			},
			changeSuggest: function(e) {
				var t = this,
					a = t.suggests,
					i = a.length,
					n = 0,
					o = 1;
				n = "up" == e ? -1 : 1,
					a.each(function(e, t) {
						var a = Q(t);
						a.hasClass("selected") && (o = parseInt(a.attr("data-index"), 10))
					}),
					o += n,
					0 >= o && (o = 0),
					o >= i - 1 && (o = i - 1),
					a.each(function(e, a) {
						var i = Q(a),
							n = parseInt(i.attr("data-index"), 10);
						n == o ? (i.addClass("selected"),
							t._input.val(i.html())) : i.removeClass("selected")
					})
			},
			enterSuggest: function() {
				var e = this;
				if("block" == e.wrapper.css("display")) {
					var t = e.suggests;
					t.each(function(t, a) {
						var n = Q(a);
						if(n.hasClass("selected")) {
							var o = n.html();
							e._input.val(o),
								e.wrapper.hide(),
								i.fire({
									type: "mailSuggestHide",
									data: {
										input: e._input
									}
								})
						}
					})
				} else
					e._input.val() && i.fire({
						type: "mailSuggestHide",
						data: {
							input: e._input
						}
					})
			},
			parseMail: function() {
				var e = this._mails.concat(),
					t = this._curStr.match(/(@)(.*)/);
				return t && t[2] && (e = e.filter(function(e) {
						return e.indexOf(t[2]) > -1
					})),
					this._max && e.length > this._max && (e.length = this._max),
					e
			},
			assemble: function(e) {
				var t = e,
					a = this._curStr.replace(/@.*/, "");
				return t.length && (t = t.map(function(e) {
							return {
								mail: a + "@" + e
							}
						}),
						t.forEach(function(e, t) {
							e.index = t
						})),
					t
			}
		},
		a.exports = o
});
define("kit/validate", [], function(e, t, n) {
	var a = {
		empty: function(e) {
			return !!e.trim()
		},
		mail: function(e) {
			return /^[0-9a-zA-Z_][-_\.0-9a-zA-Z-]{0,31}@([0-9a-zA-Z][0-9a-zA-Z-]*\.)+[a-zA-Z]{2,4}$/.test(e.trim())
		},
		newMail: function(e) {
			var t = e.replace(/(^\s*)|(\s*$)/g, "");
			return /^[0-9a-zA-Z_][-_\.0-9a-zA-Z-]{0,31}@([0-9a-zA-Z][0-9a-zA-Z-]*\.)+[a-zA-Z]{2,4}$/.test(t)
		},
		oldPwd: function(e) {
			return /^[A-Za-z0-9_\!@#\$%\^&\*\(\)_\+=|<>,\.{}:;\]\[\~\/\?\"'\\-]{4,20}$/.test(e.trim())
		},
		pwd: function(e) {
			var t = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![_\!@#\$%\^&\*\(\)_\+=|<>,\.{}:;\]\[\~\/\?\"'\\-]+$)[A-Za-z0-9_\!@#\$%\^&\*\(\)_\+=|<>,\.{}:;\]\[\~\/\?\"'\\-]{8,20}$/;
			return t.test(e.trim())
		},
		specialPwd: function(e) {
			return /^[A-Za-z0-9_\!@#\$%\^&\*\(\)_\+=|<>,\.{}:;\]\[\~\/\?\"'\\-]{0,}$/.test(e)
		},
		mobile: function(e) {
			return /^(1\d{10})$/.test(e.trim())
		},
		len: function(e, t, n) {
			return new RegExp("^.{" + n + "," + (t || 0) + "}$").test(e)
		},
		dwordLen: function(e, t, n) {
			e = e.replace(/[^\x00-\xff]/g, "__");
			var a = Math.ceil(e.length / 2);
			return a >= n && t >= a
		},
		ic: function(e) {
			return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(e)
		},
		cardid: function(e) {
			return /(^\d{15}$)|(^\d{12}$)|((^E|^G)\d{8}$)|(^\d{8}-\d{1}$)|(^\d{17}([0-9]|X)$)/.test(e)
		},
		nickName: function(e) {
			return /^[\u4e00-\u9fa5a-zA-Z0-9]+[\u4e00-\u9fa5a-zA-Z0-9_\-]*$/.test(e) && Q.string.getLength(e) >= 4 && Q.string.getLength(e) <= 20
		},
		number: function(e) {
			return /^\d+(\.\d+)?$/.test(e)
		},
		integer: function(e) {
			return /^\d+$/.test(e)
		},
		postCode: function(e, t) {
			var n = /^\d{6}$/.test(e);
			return t = t || function() {},
				t(n),
				n
		},
		telephone: function(e, t) {
			var n = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,9}))?$/,
				a = n.test(e);
			return t = t || function() {},
				t(a),
				a
		},
		getIsTooSimple: function(e) {
			if(/^(.)\1*$/.test(e))
				return !0;
			for(var t = e.length, n = !0, a = 0; t > a; a++)
				if(a > 0) {
					var i = e.charCodeAt(a) - e.charCodeAt(a - 1);
					if(1 != i && -1 != i) {
						n = !1;
						break
					}
				}
			return n ? !0 : !1
		},
		getScore: function(e) {
			for(var t = 0, n = 0, a = 0, i = 0, r = 0, o = e.length, l = "", s = 0; o > s; s++)
				l = e.charAt(s),
				t += /\d/.test(l) ? 1 : 0,
				a += /[A-Z]/.test(l) ? 1 : 0,
				i += /[a-z]/.test(l) ? 1 : 0,
				n += /\W/.test(l) ? 1 : 0;
			o > 15 ? r += 25 : o >= 13 && 15 >= o ? r += 10 : o >= 8 && 13 > o && (r += 5);
			var m = a > 0 && i > 0,
				d = a > 0 && 0 === i,
				h = i > 0 && 0 === a;
			m ? r += 20 : (d || h) && (r += 10),
				t >= 1 && 3 > t ? r += 10 : t >= 3 && (r += 20),
				1 == n ? r += 10 : n > 1 && (r += 25);
			var c = (a > 0 || i > 0) && t > 0,
				U = (a > 0 || i > 0) && t > 0 && n > 0,
				u = a > 0 && i > 0 && t > 0 && n > 0,
				V = t > 0 && n > 0,
				f = (a > 0 || i > 0) && n > 0;
			return u ? r += 10 : U ? r += 5 : (c || V || f) && (r += 2),
				r
		},
		zhCharacters: function(e) {
			return /^[\u4e00-\u9fa5a]+$/.test(e)
		},
		twoDecimal: function(e) {
			return /^\d+\.?\d{0,2}$/.test(e)
		},
		numCharacters: function(e) {
			return /^[0-9a-zA-Z]+$/.test(e)
		},
		trimSE: function(e) {
			return e.replace(/(^\s*)|(\s*$)/g, "")
		},
		trimALLToE: function(e) {
			return e.replace(/\s|-|\*|\(|\)/g, "")
		},
		trimAll: function(e) {
			return e.replace(/\s|-|\(|\)/g, "*")
		},
		trimAllBlank: function(e) {
			return e.replace(/\s/g, "")
		}
	};
	n.exports = a
});
define("qipaLogin/kit/zoneList.js", ["./zone"], function(e, t, a) {
	var i = Q.event.customEvent,
		n = e("./zone"),
		o = function(e) {
			this.wrapper = e.wrapper,
				this.zoneArea = e.zoneArea,
				this.arrow = e.arrow,
				this.selZone = e.selZone,
				this.arrowCls = e.arrowCls || "arrow-all-reverse",
				this.zoneChangeFireName = e.zoneChangeFireName
		};
	o.prototype = {
			init: function(e) {
				var t = this;
				t.wrapper[0] && t.arrow[0] && t.selZone[0] && t.zoneArea[0] && n.getHistory(function(a) {
					return t.renderZone(a, e),
						t.bindEvent(),
						t
				})
			},
			renderZone: function(e, t) {
				var a = "<ul>";
				if(e.acode,
					e.acode)
					for(var i in e.acode)
						a += '<li><a href="javascript:;" class="dropDown_item" data-key="' + i + '" data-value="' + e.acode[i] + '" data-zonesuggest-elem="item">' + e.acode[i] + '<span class="ml7"> +' + i + "</span></a></li>";
				if(a += "</ul>",
					this.wrapper.html(a),
					e.local) {
					var n = e.local.acode;
					this.selZone.attr("data-key", n),
						this.selZone.html(e.acode[n])
				}
				t && t(e)
			},
			bindEvent: function() {
				var e = this;
				e.wrapper.delegate('[data-zonesuggest-elem="item"]', "click", function() {
						var t = Q(this),
							a = t.attr("data-key");
						e.selZone.attr("data-key", a),
							e.selZone.html(t.attr("data-value")),
							i.fire({
								type: e.zoneChangeFireName,
								data: {
									key: a
								}
							}),
							e._zoneToggle()
					}),
					e.zoneArea.on("click", function(t) {
						Q.event.get(t).preventDefault(),
							e._zoneToggle()
					})
			},
			_zoneToggle: function(e) {
				e || this.arrow.hasClass(this.arrowCls) ? (this.arrow.removeClass(this.arrowCls),
					this.wrapper.addClass("dn")) : (this.arrow.addClass(this.arrowCls),
					this.wrapper.removeClass("dn"))
			}
		},
		a.exports = o
});
define("qipaLogin/kit/zone.js", ["../interfaces/zoneInterface", "../../kit/userInfo", "../../config/siteDomain", "../kit/getI18nLang"], function(e, t, a) {
	var i = e("../interfaces/zoneInterface"),
		n = e("../../kit/userInfo"),
		o = e("../../config/siteDomain"),
		r = o.getDomain(),
		s = e("../kit/getI18nLang").get(),
		l = s ? s : "",
		d = Q.Class("zoneInfo", {
			construct: function() {
				this.zoneHistory = null
			},
			methods: {
				getHistory: function(e) {
					var t = this;
					e && (t.zoneHistory && t.zoneHistory.lang == l ? e(t.zoneHistory) : t.getList(e))
				},
				getList: function(e) {
					var t = this,
						a = "",
						o = n.getUserInfo() ? n.getUserInfo().user_name : "",
						s = Q.cookie.get("QC160");
					s = s ? JSON.parse(s) : {
							u: o,
							lang: l
						},
						(new i).send({}, function(i) {
							if("A00000" == i.code && i.data)
								i = i.data,
								t.zoneHistory = {
									acode: i.acode,
									local: s.local || i.local,
									lang: l,
									u: s.u
								},
								s.local = s.local || i.local;
							else {
								var n = {
									acode: 86,
									name: "中国大陆"
								};
								t.zoneHistory = {
										acode: {
											86: "中国大陆",
											886: "台湾"
										},
										local: s.local || n,
										lang: l,
										u: s.u
									},
									s.local = s.local || n
							}
							a = JSON.stringify(s),
								Q.cookie.set("QC160", a, {
									expires: 2592e6,
									path: "/",
									domain: r
								}),
								e && e(t.zoneHistory)
						})
				}
			}
		}),
		c = new d;
	a.exports = {
		getHistory: function(e) {
			return c.getHistory(e)
		},
		getList: function(e) {
			return c.getList(e)
		}
	}
});
define("qipaLogin/interfaces/zoneInterface.js", ["./postInterface", "../../config/siteDomain", "../kit/getI18nLang", "../kit/getPassedParams"], function(e, t, a) {
	var i = e("./postInterface"),
		n = e("../../config/siteDomain"),
		o = n.getDomain(),
		r = e("../kit/getI18nLang"),
		s = e("../kit/getPassedParams"),
		l = s.getAgenttype(),
		d = s.getPtid(),
		c = i.protocol;
	a.exports = Q.Class("zoneInterface", {
		construct: function() {
			this._remoteInterface = new i({
				url: c + "//passport." + o + "/apis/phone/get_support_areacode.action"
			})
		},
		methods: {
			send: function(e, t) {
				e.param = e.param || {},
					e.param.local = 1,
					e.param.agenttype = l,
					e.param.ptid = d,
					"zh_TW" == r.get() && (e.param.lang = "zh_TW"),
					this._remoteInterface.send(e, function(e) {
						t && t(e)
					})
			}
		}
	})
});
define("kit/userInfo.js", ["../config/siteDomain", "../interfaces/isLogin", "../action/reLogin", "../kit/checkI18nType"], function(require, exports, module) {
	var ic = new Q.ic.InfoCenter({
			moduleName: "kit/userInfo"
		}),
		siteDomain = require("../config/siteDomain"),
		customEvent = Q.event.customEvent,
		RIIsLogin = require("../interfaces/isLogin"),
		relogin = require("../action/reLogin"),
		zh_cn = require("../kit/checkI18nType").type,
		callbackList = [],
		UserInfo = Q.Class("UserInfo", {
			properties: {
				uid: "",
				name: "",
				phone: "",
				icon: "",
				email: "",
				deadline_date: "",
				deadline_t: "",
				deadline_day: "",
				level: "",
				vipType: "",
				payType: "",
				remind: "",
				status: "",
				isThirdParty: !1,
				thirdPartyFrom: "",
				type: "",
				mobile: "",
				vip: !1,
				mediaBigVUser: !1,
				isSportVIP: !1,
				sportInfo: {},
				shareProfitUser: void 0,
				verifyClass: "",
				lockedVip: !1,
				expireVip: !1,
				expectPayVip: !1,
				mobilePayVip: !1,
				bindedSNS: null,
				isLoginInfo: null,
				accounts: null,
				tokens: null,
				subaccount: null,
				surplus: "",
				isAwardVip: !1,
				pps: !1,
				isAutoRenew: !1,
				isHitUser: null,
				isAbLogin: null
			},
			construct: function() {
				this.hasVipInfo = !1,
					this.isValidVip = !1
			},
			methods: {
				init: function() {
					this.bindEvent(),
						this.checkUserInfo()
				},
				bindEvent: function() {
					customEvent.on("login", this.doLogin.bind(this)),
						customEvent.on("logout", this.doLogout.bind(this))
				},
				doLogin: function() {
					this.checkUserInfo()
				},
				doLogout: function() {
					this.clearUserInfo(),
						window.sdkPack && window.sdkPack.userinfo && (window.sdkPack.userinfo = "")
				},
				checkUserInfo: function() {
					if(this.isLogin()) {
						var p00002 = Q.cookie.get("P00002");
						null !== p00002 && "" !== p00002 && (p00002 = window.JSON ? window.JSON.parse(p00002) : eval("(" + p00002 + ")"),
							this.uid = p00002.uid,
							this.name = p00002.nickname,
							this.email = p00002.email)
					}
				},
				getUserInfo: function() {
					if(this.isLogin()) {
						var p00002 = Q.cookie.get("P00002");
						if(null !== p00002 && "" !== p00002)
							return window.JSON ? window.JSON.parse(p00002) : eval("(" + p00002 + ")")
					}
				},
				getSubAuthCookies: function() {
					var e = Q.cookie.get("P00007");
					return "deleted" === e && (e = ""),
						e
				},
				getAuthCookies: function() {
					var e = Q.cookie.get("P00001");
					return "deleted" === e && (e = ""),
						e
				},
				getIsThirdParty: function() {
					return this.isThirdParty
				},
				setIsThirdParty: function(e) {
					return this.isThirdParty = e,
						this.isThirdParty
				},
				checkVipInfo: function(e, t) {
					this.isLogin() ? this.hasVipInfo ? e && e(t ? this[t] : "") : this.getInfoFromInterface(e, t) : e && e(t ? this[t] : "")
				},
				renewUserInfo: function(e) {
					var t = this,
						n = {};
					n.param = n.param || {},
						n.dataType = "jsonp";
					var i = new RIIsLogin;
					i.sendInfoAction(n, function(n) {
						if("A00005" == n.code || "A00055" == n.code || "P00806" == n.code)
							relogin.reLogin(n),
							window.lib.__callbacks__.logout_callback(n);
						else if("A00000" == n.code) {
							window.sdkPack = window.sdkPack ? window.sdkPack : {},
								window.sdkPack.userinfo = n.data,
								t.setVipInfo(n.data || {}),
								t.isLoginInfo = n.data.userinfo || {},
								t.phone = n.data.userinfo.phone || " ",
								t.icon = n.data.userinfo.icon || " ";
							var i = t.isMain(n.data.accounts);
							t.thirdPartyFrom = i || "10",
								t.accounts = n.data.accounts || [],
								t.tokens = n.data.tokens || {},
								t.setShareProfitUserInfo(n.data || {}),
								t.setMediaBigVUser(n.data || {}),
								t.isHitUser = n.data.insecure_account || " ",
								t.isAbLogin = n.data.ablogin
						} else
							ic.warn("调用vip信息接口（https://passport.iqiyi.com/apis/user/info.action）失败。"),
							t.clearVipInfo();
						e && e()
					})
				},
				getInfoFromInterface: function(e, t) {
					var n = this;
					if(n.isLoginInfo)
						e && e(t ? n[t] : "");
					else if(callbackList && callbackList.length)
						callbackList.push({
							cb: e,
							param: t
						});
					else {
						callbackList.push({
							cb: e,
							param: t
						});
						var i = {};
						i.param = i.param || {},
							i.dataType = "jsonp";
						var a = new RIIsLogin;
						a.sendInfoAction(i, function(e) {
							if("A00005" == e.code || "A00055" == e.code || "P00806" == e.code)
								relogin.reLogin(e),
								window.lib.__callbacks__.logout_callback(e);
							else {
								if("A00000" == e.code) {
									window.sdkPack = window.sdkPack ? window.sdkPack : {},
										window.sdkPack.userinfo = e.data,
										n.setVipInfo(e.data || {}),
										n.isLoginInfo = e.data.userinfo || {},
										n.phone = e.data.userinfo.phone || " ",
										n.icon = e.data.userinfo.icon || " ";
									var t = n.isMain(e.data.accounts);
									n.thirdPartyFrom = t || "10",
										n.accounts = e.data.accounts || [],
										n.tokens = e.data.tokens || {},
										n.setShareProfitUserInfo(e.data || {}),
										n.setMediaBigVUser(e.data || {}),
										n.isHitUser = e.data.insecure_account || " ",
										n.isAbLogin = e.data.ablogin
								} else
									ic.warn("调用vip信息接口（https://passport.iqiyi.com/apis/user/info.action）失败。"),
									n.clearVipInfo();
								for(var i; callbackList && callbackList.length > 0;)
									try {
										var a = callbackList.shift();
										i = "A00000" == e.code ? a.param ? n[a.param] : "" : !1,
											a.cb && ("shareProfitUser" === a.param ? a.cb(i, n.verifyClass) : a.cb(i))
									} catch(r) {
										ic.log(r)
									}
							}
						})
					}
				},
				getBindedSnsInfo: function(e) {
					var t = this;
					this.tokens ? e && e(this.tokens) : this.getInfoFromInterface(function() {
						e && e(t.tokens)
					})
				},
				getPhoneInfo: function(e) {
					var t = this;
					this.phone ? e && e(this.phone) : this.getInfoFromInterface(function() {
						e && e(t.phone)
					})
				},
				getIconInfo: function(e) {
					var t = this;
					this.icon ? e && e(this.icon) : this.getInfoFromInterface(function() {
						e && e(t.icon)
					})
				},
				isMain: function(e) {
					for(var t, n = 0; n < e.length; n++)
						e[n].is_main === !0 && (t = e[n].type);
					return t
				},
				getThirdPartyFromInfo: function(e) {
					var t = this;
					this.getInfoFromInterface(function() {
						e && e(t.thirdPartyFrom)
					})
				},
				getIsLoginInfo: function(e) {
					var t = this;
					t.isLoginInfo ? e && e(t.isLoginInfo) : t.getInfoFromInterface(function(n) {
						n || "" === n ? e && e(t.isLoginInfo) : e && e({})
					})
				},
				getAllAccountsInfo: function(e) {
					var t = this;
					t.accounts ? e && e(t.accounts) : t.getInfoFromInterface(function() {
						e(t.accounts)
					})
				},
				setVipInfo: function(e) {
					var t = e.qiyi_vip_info || {},
						n = e.sport_vip || {},
						i = e.fun_vip || {},
						a = parseFloat(t.type, 10),
						r = parseFloat(n.type, 10) || 0,
						o = parseFloat(i.type, 10) || 0;
					parseFloat(n.status, 10) || 0;
					var s = t.vipType;
					if(this.isAwardVip = e.award_vip ? !0 : !1,
						this.vip = a ? !0 : !1,
						t.level && (this.level = t.level + ""),
						"1" == s || "2" == s || "3" == s || "4" == s || "16" == s) {
						var l = 0;
						t.deadline && (l = t.deadline.t,
								this.deadline_t = l,
								this.deadline_date = t.deadline.date + "",
								this.deadline_day = t.surplus),
							this.vipType = t.vipType + "",
							this.payType = t.payType + "",
							this.remind = void 0,
							this.status = t.status + "",
							this.type = t.type + "",
							this.mobile = t.mobile + "",
							this.lockedVip = "1" == t.type && "2" == t.status,
							this.expireVip = "1" == t.type && "3" == t.status,
							this.expectPayVip = "1" == t.type && "1" == t.status && "0" == t.payType,
							this.mobilePayVip = "1" == t.type && "1" == t.status && "1" == t.payType,
							this.surplus = t.surplus + "",
							this.hasVipInfo = !0,
							this.isValidVip = "1" == t.status,
							this.autoRenew = t.autoRenew
					}
					if(this.sportInfo = Q.extend(this.sportInfo, n),
						this.isSportVIP = r ? !0 : !1,
						zh_cn) {
						var d = "1";
						a || r || o || (d = "0"),
							Q.cookie.set("QC170", d, {
								path: "/",
								domain: siteDomain.getDomain(),
								expires: 31536e6
							})
					}
				},
				setShareProfitUserInfo: function(e) {
					var t = e.verify_info,
						n = t.verifyState,
						i = t.verifyClass;
					isNaN(n) || isNaN(i) || (this.shareProfitUser = (4 == n || 5 == n) && 3 == i,
						this.verifyClass = i)
				},
				setMediaBigVUser: function(e) {
					if(e) {
						var t = e.verify_info,
							n = t.verifyState,
							i = t.copyright;
						isNaN(n) || isNaN(i) || (this.mediaBigVUser = 4 == n && 1 == i)
					}
				},
				clearUserInfo: function() {
					this.uid = "",
						this.name = "",
						this.icon = "",
						this.email = "",
						this.phone = "",
						this.clearVipInfo(),
						this.shareProfitUser = void 0,
						this.mediaBigVUser = !1,
						this.bindedSNS = null,
						this.isLoginInfo = null,
						this.accounts = null,
						this.tokens = null,
						this.subaccount = null,
						this.thirdPartyFrom = "",
						this.isHitUser = "",
						this.isAbLogin = "",
						this.isSportVIP = !1,
						this.sportInfo = {}
				},
				clearVipInfo: function() {
					this.deadline_date = "",
						this.deadline_day = "",
						this.deadline_t = "",
						this.level = "",
						this.vipType = "",
						this.payType = "",
						this.remind = "",
						this.status = "",
						this.type = "",
						this.mobile = "",
						this.vip = !1,
						this.lockedVip = !1,
						this.expireVip = !1,
						this.expectPayVip = !1,
						this.mobilePayVip = !1,
						this.hasVipInfo = !1,
						this.surplus = "",
						this.isValidVip = !1,
						this.autoRenew = !1
				},
				isLogin: function() {
					return "" !== Q.cookie.get("P00002") && null !== Q.cookie.get("P00002") && "deleted" !== Q.cookie.get("P00002") && "" !== Q.cookie.get("P00003") && null !== Q.cookie.get("P00003") && "deleted" !== Q.cookie.get("P00003") && void 0 !== Q.cookie.get("P00003")
				},
				isVip: function(e) {
					return this.checkVipInfo(e, "vip"),
						this.vip
				},
				checkSport: function(e) {
					return this.checkVipInfo(e, "isSportVIP"),
						this.isSportVIP
				},
				getSportInfo: function(e) {
					return this.checkVipInfo(e, "sportInfo"),
						this.sportInfo
				},
				isShareProfitUser: function(e) {
					return void 0 === this.shareProfitUser ? this.getInfoFromInterface(e, "shareProfitUser") : e && e(this.shareProfitUser, this.verifyClass),
						this.shareProfitUser
				},
				isMediaBigVUser: function(e) {
					return this.getInfoFromInterface(e, "mediaBigVUser"),
						this.mediaBigVUser
				},
				isPPS: function() {
					return 10001 <= parseInt(this.getUid(), 10) && parseInt(this.getUid(), 10) <= 564375554 && (this.pps = !0),
						this.pps
				},
				isAutoRenew: function(e) {
					return this.checkVipInfo(e, "autoRenew"),
						this.autoRenew
				},
				getUserHit: function(e) {
					var t = this;
					this.isHitUser ? e && e(this.isHitUser) : this.getInfoFromInterface(function() {
						e && e(t.isHitUser)
					})
				},
				getUserAbLogin: function(e) {
					var t = this;
					this.isAbLogin ? e && e(this.isAbLogin) : this.getInfoFromInterface(function() {
						e && e(t.isAbLogin)
					})
				},
				isThirdPartyAccount: function() {
					if(!this.isLogin())
						return !1;
					var e = this.getUserInfo(),
						t = parseInt(e.type, 10),
						n = parseInt(e.uid, 10);
					return !!(t && 13 !== t && n > 2e9 && 3e9 > n)
				},
				isLockedVip: function(e) {
					return this.checkVipInfo(e, "lockedVip"),
						this.lockedVip
				},
				isExpireVip: function(e) {
					return this.checkVipInfo(e, "expireVip"),
						this.expireVip
				},
				isExpectPayVip: function(e) {
					return this.checkVipInfo(e, "expectPayVip"),
						this.expectPayVip
				},
				isMobilePayVip: function(e) {
					return this.checkVipInfo(e, "mobilePayVip"),
						this.mobilePayVip
				},
				getUid: function() {
					return this.uid
				},
				getName: function() {
					return this.name
				},
				getIcon: function(e) {
					return this.getIconInfo(e, "icon"),
						this.icon
				},
				getPhone: function(e) {
					return this.getPhoneInfo(e, "phone"),
						this.phone
				},
				getThirdPartyFrom: function(e) {
					return this.getThirdPartyFromInfo(e, "thirdPartyFrom"),
						this.thirdPartyFrom
				},
				getEmail: function() {
					return this.email
				},
				getDeadlineDate: function(e) {
					return this.checkVipInfo(e, "deadline_date"),
						this.deadline_date
				},
				getDeadlineTime: function(e) {
					return this.checkVipInfo(e, "deadline_t"),
						this.deadline_t
				},
				getDeadlineDay: function(e) {
					return this.checkVipInfo(e, "deadline_day"),
						this.deadline_day
				},
				getLevel: function(e) {
					return this.checkVipInfo(e, "level"),
						this.level
				},
				getVipType: function(e) {
					return this.checkVipInfo(e, "vipType"),
						this.vipType
				},
				getPayType: function(e) {
					return this.checkVipInfo(e, "payType"),
						this.payType
				},
				getRemind: function(e) {
					return this.checkVipInfo(e, "remind"),
						this.remind
				},
				getStatus: function(e) {
					return this.checkVipInfo(e, "status"),
						this.status
				},
				getType: function(e) {
					return this.checkVipInfo(e, "type"),
						this.type
				},
				getMobile: function(e) {
					return this.checkVipInfo(e, "mobile"),
						this.mobile
				},
				getSurplus: function(e) {
					return this.checkVipInfo(e, "surplus"),
						this.surplus
				},
				getIsValidVip: function(e) {
					return this.checkVipInfo(e, "isValidVip"),
						this.isValidVip
				},
				getAwardVip: function(e) {
					return this.checkVipInfo(e, "isAwardVip"),
						this.isAwardVip
				},
				isSubaccount: function() {
					var e = this.getUid();
					return !!(e + "").match(/^4\d{9}$/)
				},
				getHitUser: function(e) {
					return this.getUserHit(e, "isHitUser"),
						this.isHitUser
				},
				getAblogin: function(e) {
					return this.getUserAbLogin(e, "isAblogin"),
						this.isAblogin
				},
				refreshUserIcon: function(e) {
					var t = this,
						n = {};
					n.param = {},
						n.dataType = "jsonp";
					var i = new RIIsLogin;
					i.sendInfoAction(n, function(n) {
						"A00000" == n.code && (window.sdkPack = window.sdkPack ? window.sdkPack : {},
							window.sdkPack.userinfo = n.data,
							t.icon = n.data.userinfo.icon,
							e(n.data.userinfo.icon))
					})
				}
			}
		}),
		userInfo = new UserInfo;
	userInfo.init(),
		module.exports = {
			getSubAuthCookies: function() {
				return userInfo.getSubAuthCookies()
			},
			isLogin: function() {
				return userInfo.isLogin()
			},
			getUid: function() {
				return userInfo.getUid()
			},
			getName: function() {
				return userInfo.getName()
			},
			getIcon: function(e) {
				return userInfo.getIcon(e)
			},
			getThirdPartyFrom: function(e) {
				return userInfo.getThirdPartyFrom(e)
			},
			getPhone: function(e) {
				return userInfo.getPhone(e)
			},
			getAuthCookies: function() {
				return userInfo.getAuthCookies()
			},
			getEmail: function() {
				return userInfo.getEmail()
			},
			getDeadlineDate: function(e) {
				return userInfo.getDeadlineDate(e)
			},
			getDeadlineTime: function(e) {
				return userInfo.getDeadlineTime(e)
			},
			getDeadlineDay: function(e) {
				return userInfo.getDeadlineDay(e)
			},
			getLevel: function(e) {
				return userInfo.getLevel(e)
			},
			getVipType: function(e) {
				return userInfo.getVipType(e)
			},
			getPayType: function(e) {
				return userInfo.getPayType(e)
			},
			getRemind: function(e) {
				return userInfo.getRemind(e)
			},
			getStatus: function(e) {
				return userInfo.getStatus(e)
			},
			getType: function(e) {
				return userInfo.getType(e)
			},
			getMobile: function(e) {
				return userInfo.getMobile(e)
			},
			isVip: function(e) {
				return userInfo.isVip(e)
			},
			isShareProfitUser: function(e) {
				return userInfo.isShareProfitUser(e)
			},
			isMediaBigVUser: function(e) {
				return userInfo.isMediaBigVUser(e)
			},
			isLockedVip: function(e) {
				return userInfo.isLockedVip(e)
			},
			isExpireVip: function(e) {
				return userInfo.isExpireVip(e)
			},
			isExpectPayVip: function(e) {
				return userInfo.isExpectPayVip(e)
			},
			isMobilePayVip: function(e) {
				return userInfo.isMobilePayVip(e)
			},
			checkVipInfo: function(e) {
				return userInfo.checkVipInfo(e)
			},
			checkUserInfo: function() {
				return userInfo.checkUserInfo()
			},
			getUserInfo: function() {
				return userInfo.getUserInfo()
			},
			getIsThirdParty: function() {
				return userInfo.getIsThirdParty()
			},
			getAwardVip: function(e) {
				return userInfo.getAwardVip(e)
			},
			setIsThirdParty: function(e) {
				return userInfo.setIsThirdParty(e)
			},
			getBindedSnsInfo: function(e) {
				return userInfo.getBindedSnsInfo(e)
			},
			getIsLoginInfo: function(e) {
				return userInfo.getIsLoginInfo(e)
			},
			getAllAccountsInfo: function(e) {
				return userInfo.getAllAccountsInfo(e)
			},
			getSurplus: function(e) {
				return userInfo.getSurplus(e)
			},
			clearUserInfo: function() {
				userInfo.clearUserInfo()
			},
			getIsValidVip: function(e) {
				return userInfo.getIsValidVip(e)
			},
			isSportVIP: function(e) {
				return userInfo.checkSport(e)
			},
			getSportInfo: function(e) {
				return userInfo.getSportInfo(e)
			},
			isPPS: function() {
				return userInfo.isPPS()
			},
			isThirdPartyAccount: function(e) {
				if(!userInfo.isLogin())
					return !1;
				if(0 === arguments.length)
					return userInfo.isThirdPartyAccount();
				if(e && userInfo.accounts && userInfo.accounts.length)
					for(var t, n = 0, i = userInfo.accounts.length; i > n; n++)
						if(t = userInfo.accounts[n].account,
							t && -1 !== t.indexOf("@" + e))
							return !0;
				return !1
			},
			isAccountBinded: function() {
				return userInfo.isLogin() ? userInfo.accounts && userInfo.accounts.length > 1 : !1
			},
			isAutoRenew: function(e) {
				return userInfo.isAutoRenew(e)
			},
			isHitUser: function(e) {
				return userInfo.getHitUser(e)
			},
			isAblogin: function(e) {
				return userInfo.getAblogin(e)
			},
			isSubaccount: function() {
				return userInfo.isSubaccount()
			},
			refreshUserIcon: function(e) {
				return userInfo.refreshUserIcon(e)
			},
			renewUserInfo: function(e) {
				userInfo.renewUserInfo(e)
			}
		}
});
define("interfaces/isLogin", ["../kit/remoteInterface", "../qipaLogin/interfaces/postInterface", "../config/siteDomain"], function(e, t, n) {
	var a = e("../kit/remoteInterface"),
		i = e("../qipaLogin/interfaces/postInterface"),
		r = i.protocol,
		o = e("../config/siteDomain"),
		l = o.getDomain();
	n.exports = Q.Class("RIIsLogin", {
		construct: function() {
			this._remoteInterface = new a({
				url: "https://passport." + l + "/apis/user/islogin.php"
			})
		},
		methods: {
			send: function(e, t) {
				e.param = e.param || {},
					e.method = e.method || "POST",
					e.cors = !0,
					e.withCredentials = !0,
					e.param.authcookie = e.param.authcookie || Q.cookie.get("P00001"),
					e.param.antiCsrf = Q.crypto.md5(Q.cookie.get("P00001")),
					this._remoteInterface.send(e, function(e) {
						t && t(e)
					})
			},
			sendInfoAction: function(e, t) {
				e.param = e.param || {},
					e.param.authcookie = e.param.authcookie || Q.cookie.get("P00001"),
					e.param.antiCsrf = Q.crypto.md5(e.param.authcookie),
					e.param.agenttype = 1,
					e.param.fields = e.param.fields || "sport_vip,r,userinfo,qiyi_vip,pps,accounts,tokens,v,insecure_account,ablogin,fun_vip";
				for(var n = r + "//passport." + l + "/apis/user/info.action", a = r + "//passport." + l + "/apis/user/info/queryWithVerify.action", o = e.param.fields.split(","), s = 0, m = o.length; m > s; s++)
					if("verify_info" == o[s] || "all" == o[s] || "v" == o[s]) {
						n = a;
						break
					}
				new i({
					url: n
				}).send({
					param: e.param
				}, function(e) {
					t && t(e)
				})
			}
		}
	})
});
define("kit/remoteInterface", ["./checkRemoteData", "./rhf8vg", "./qoepingback", "./interceptors"], function(e, t, n) {
	var a = e("./checkRemoteData"),
		i = e("./rhf8vg"),
		r = "789f23df6ebb918b767638003f1e52f4",
		o = new Q.ic.InfoCenter({
			moduleName: "RemoteInterface"
		}),
		l = e("./qoepingback"),
		s = e("./interceptors"),
		m = Q.Class("RemoteInterface", {
			construct: function(e) {
				this._remoteInterfaces = e
			},
			properties: {
				interceptors: [{
					name: "correctUrlProtocol",
					configName: "i_removeHttp",
					defaultValue: !0
				}, {
					name: "replaceQiyipic",
					configName: "i_replaceQiyipic",
					defaultValue: !0
				}]
			},
			methods: {
				_initInterceptorConfig: function(e) {
					for(var t = {}, n = this.interceptors, a = 0; a < n.length; a++) {
						var i = n[a];
						t[i.name] = e ? void 0 === e[i.configName] ? i.defaultValue : e[i.configName] : i.defaultValue
					}
					return t
				},
				_removeInterceptorConfig: function(e) {
					if(e)
						for(var t = this.interceptors, n = 0; n < t.length; n++)
							delete e[t[n].configName]
				},
				send: function(e, t) {
					var n = e.ifname,
						s = e.param,
						m = e.method || "GET",
						d = e.jsonp,
						h = e.spliter || "1",
						c = this,
						U = this._getIfData(n),
						V = new Date,
						u = e.timeout || 2e4,
						f = e.withCredentials,
						p = e.ifr,
						g = e.dataType,
						y = Q.cookie.get("P00001"),
						b = e.qoe,
						v = this._initInterceptorConfig(s);
					this._removeInterceptorConfig(s);
					var k = {
						data: s,
						dataType: g,
						method: m,
						jsonp: d,
						spliter: h,
						cors: e.cors,
						withCredentials: f,
						timeout: u,
						ifr: p,
						qoe: b,
						headers: e.headers,
						memory: e.memory,
						encodeFn: e.encodeFn,
						jsonpCallback: e.jsonpCallback,
						onsuccess: function(i, r) {
							e.qoe && l.sendQOEPingback(n + "_succ", e.startTime),
								new Date - V > 5e3 && (o.log("RemoteInterface [" + n + "] timeout."),
									o.log("RemoteInterface [" + U.url + "] timeout.")),
								(d || "object" == typeof s && ("varname" in s || "cb" in s)) && ((r || "0" == r) && "code" in r || (r = {
									code: "A00000",
									data: r
								}));
							try {
								o.log("send url : " + c._getUrl(U.url, s) + ", Check " + "result : " + a.check(U.struct, r))
							} catch(m) {
								o.error("RemoteInterface error url " + U.url + ";error message " + m.message)
							}
							t && (r = c.handleInterceptor(r, v, n),
								t(r))
						},
						onfailure: function(a, i) {
							o.error("RemoteInterface onfailure url: " + U.url),
								o.error("RemoteInterface data: " + JSON.stringify(i)),
								e.qoe && (i.code && "A000000" === i.code ? l.sendQOEPingback(n + "_succ", e.startTime) : l.sendQOEPingback(n + "_err", e.startTime)),
								t && (i = c.handleInterceptor(i, v, n),
									t(i || {
										code: "E00000"
									}))
						}
					};
					e.antiCsrf && y && (k.data = k.data || {},
							k.data.antiCsrf = Q.crypto.md5(y)),
						e.guard && y && (k.data = k.data || {},
							k.data.d41fc5 = 1 * new Date + "",
							k.data.ea166b = Q.crypto.md5(y + r + k.data.d41fc5));
					var x = U.url;
					e.rhf8vg && (s.isFromSafeLevel = "1",
							x = i(U.url, s, e.safePlatFormKey, e.safeSrckeyKey, e.domain).fullUrl,
							k.data = {}),
						e.startTime = +new Date,
						Q.http.json(x, k)
				},
				handleInterceptor: function(e, t) {
					var n, a, i = [];
					for(n = 0; n < this.interceptors.length; n++)
						a = this.interceptors[n],
						t[a.name] && i.push(this[a.name]);
					return s.deepMap(e, i),
						e
				},
				replaceQiyipic: function(e) {
					return s.replaceQiyipic(e)
				},
				correctUrlProtocol: function(e) {
					return s.removeHttp(e)
				},
				_getIfData: function(e) {
					return this._remoteInterfaces[e] || this._remoteInterfaces
				},
				_log: function(e) {
					o.log("iferror" + e)
				},
				_getUrl: function(e, t) {
					var n = [];
					for(var a in t)
						n.push(a + "=" + t[a]);
					return e + "?" + n.join("&")
				}
			}
		});
	n.exports = m
});
define("kit/checkRemoteData", [], function(e, t, n) {
	n.exports = {
		check: function(e) {
			if(!e)
				return !0;
			var t = !0;
			return t
		},
		checkArray: function(e, t) {
			var n = this;
			if(Q.array.isArray(t)) {
				var a = !0;
				return t.forEach(function(t) {
						return n.checkData(e.item, t) ? void 0 : (a = !1, !1)
					}),
					a
			}
			return !1
		},
		checkObject: function(e, t) {
			return this.check(e, t)
		},
		isEmpty: function(e, t) {
			return "object" == e.type ? null === t : "array" == e.type ? 0 === t.length : "" === t
		},
		checkData: function(e, t) {
			return "number" == e.type && "number" == typeof t ? !0 : "string" == e.type && "string" == typeof t ? !0 : "boolean" == e.type && "boolean" == typeof t ? !0 : "array" == e.type ? this.checkArray(e.item, t) : "object" == e.type ? this.checkObject(e.struct, t) : !1
		},
		log: function() {}
	}
});
define("kit/rhf8vg", [], function(require, exports, module) {
	var _RHF8VG = eval(function(e, t, n, a, i, r) {
		if(i = function(e) {
				return(t > e ? "" : i(parseInt(e / t))) + ((e %= t) > 35 ? String.fromCharCode(e + 29) : e.toString(36))
			}, !"".replace(/^/, String)) {
			for(; n--;)
				r[i(n)] = a[n] || i(n);
			a = [function(e) {
					return r[e]
				}],
				i = function() {
					return "\\w+"
				},
				n = 1
		}
		for(; n--;)
			a[n] && (e = e.replace(new RegExp("\\b" + i(n) + "\\b", "g"), a[n]));
		return e
	}('(19(){18 13={\'33\':19(a,b){1d a*b},\'N\':19(a,b){1d a<b},\'2C\':19(a,b){1d a&b},\'2p\':19(a,b){1d a&b},\'39\':19(a,b){1d a>>b},\'T\':19(a,b){1d a&b},\'1a\':(19(){18 d=0,1B=\'\',1z=[[],1g,[],[],\'\',\'\',\'\',\'\',\'\',\'\',1i,-1,-1,1g,1i,1i,1f,1f,{},-1,-1,/ /,1f,{},1g,{},1g,/ /,/ /,-1,1i,-1,/ /,/ /,1f,1f,1f,1f,1g,1g,1g],1I=1z["1r"];1e(;d<1I;){1B+=+(4U 1z[d++]===\'4T\')}18 e=3g(1B,2),1A=\'4F://4A?q=;%29%4x.%29%4v%4u%4t\',3e=1A.3d.3d(1C(/;.+/["4q"](1A))["4l"](\'\')["4h"]()["3b"](\'\'))();1d{1c:19(a){18 b,d=0,1K=e-3e>1I,1q;1e(;d<a["1r"];d++){1q=3g(a["1w"](d),16)["1y"](2);18 c=1q["1w"](1q["1r"]-1);b=d===0?c:b^c}1d b?1K:!1K}}})(),\'36\':19(a,b){1d a<b},\'35\':19(a,b){1d a>>b},\'H\':19(a,b){1d a*b},\'Z\':19(a,b){1d a*b},\'W\':19(a,b){1d a&b},\'34\':19(a,b){1d a<b},\'31\':19(a,b){1d a&b},\'2Z\':19(a,b){1d a%b},\'K\':19(a,b){1d a-b},\'2Y\':19(a,b,e){1d a^b^e},\'2X\':19(a,b){1d a 1o b},\'2W\':19(a,b){1d a*b},\'2V\':19(a,b){1d a<b},\'2U\':19(a,b){1d a<=b},\'2T\':19(a,b){1d a>>>b},\'Q\':19(a,b){1d a<<b},\'E\':19(a,b){1d a===b},\'2S\':19(a,b){1d a>b},\'2Q\':19(a,b){1d a<<b},\'2P\':19(a,b){1d a%b},\'2L\':19(a,b){1d a===b}};19 2K(F,u,2G,2E,1l){18 1m=13.1a.1c("4S")?\'/4s/\':";&&&2B=",2A=13.1a.1c("47")?\'41.3Z\':20,2z=13.1a.1c("3V")?25:\'//1H.\',2v=13.1a.1c("4b")?"2t":"2s",2j=13.1a.1c("3M")?"2t":"3y",2d=13.1a.1c("3p")?"x":"4P",2b=13.1a.1c("3Q")?2:\'&3z=\',26=13.1a.1c("2c")?\'1W\':\'&2M=\',2F=";&&&2B=",1X="3Y",1Y=";",1Z="3r",24=13.1a.1c("3X")?12:"2S",1U="",1T=13.1a.1c("3B")?"1C":"1r",27=13.1a.1c("1b")?44:\'2a\',1S=13.1a.1c("4c")?\'$1\':\'\',1R="3n",1P="3q",1O=13.1a.1c("3t")?6:\'/\',2e="3A",2g=\'a\',2h=13.1a.1c("3F")?"1N":"2i",G=8,2k=13.1a.1c("49")?\'1i\':2l,2m=13.1a.1c("3m")?\'2a\':43,2n=13.1a.1c("15")?\'a\':38,2o="1N",j=4,2q=2r,1L=16,I="3b",2u=40,1u=13.1a.1c("3E")?12:11,1s=\'=\',2w=13.1a.1c("3P")?38:25,k=1,2x="K",x=13.1a.1c("3S")?44:5,w=2,2y="H",1F=44,1D="1y",z=13.1a.1c("46")?2r:\'&\',1p=\'?\',l=0,A=13.1a.1c("4d")?"4i":"4r",J=13.1a.1c("4z")?"4J":"2i";19 4K(a){18 b="4L";1d(4O[b](a))}19 f(a,b){a[J](b)}18 1n=13.1a.1c("3l")?19(a){18 b="2D";h[b]=a}:2,1V=19(){18 a="1w",b="E";h[A]=13.1a.1c("3o")?13[b](h[A][a](l),1p)?(h[A]+z+y):(1p+y):\'//1H.2H.\'},2I=19(){18 b=13.1a.1c("3s")?\'&2M=\':\'2J\',e=13.1a.1c("3u")?\'1W\':\'=\',q=13.1a.1c("3v")?"j":"3w",r=13.1a.1c("3x")?"2L":0,M=13.1a.1c("4Z")?"2N":"2O",O="3D",P=\'2R\',R="2X",S=\'1i\',U=\'19%3G%28%29%20%3H%20%3I%3J%3K%20%3L\',V=13.1a.1c("3N")?"3O":U,s=S;1Q(13[R](P,1M[O][M])){1Q(13[r](3R(2s[q][1D]()),V)){18 X=19(a){s=13.1a.1c("3T")?a:"30"};X(e)}3U{18 Y=19(a){s=13.1a.1c("3W")?a:"2N"};Y(b)}};1d s},g=13.1a.1c("2c")?"2D":[];f(g,1F);f(g,13[2y](w,x));f(g,13[2x](l,w));18 y=[];f(g,-k*w);f(g,-2w);1e(18 1j 1o u){y[J](1j+1s+u[1j])}f(g,x*-1u);f(g,2u);y=y[I](z);f(g,-1L);f(g,2q);f(g,-j);g[2o]([1F,-2n,2m,-2k,-G]);18 h=1M[2h](2g);1n(F);1V();18 C=[];18 1h=(42 45())[2e]();f(C,1O+h[1P][1R](/^\\/(.*)/,1S)+h[A]);f(C,1h);f(C,2G||27);18 37=19(t){18 1m=13.1a.1c("48")?"N":"1y",1x=4a,3a=19(p){18 g=13.1a.1c("4e")?2l:"2C";18 h="36";18 u=13.1a.1c("4f")?\'2J\':\'\';18 y=13.1a.1c("4g")?32:8;18 z=15;18 A=7;18 B=3;18 C="34";18 E="2V";18 F=13.1a.1c("3c")?4j:\'?\';18 H="4k";18 I="2Q";18 J="35";18 K="2U";18 L=13.1a.1c("4m")?"":4n;18 N=4o;18 Q=14;18 T=13.1a.1c("4p")?\'//1H.2H.\':6;18 W=13.1a.1c("3c")?19(a){n=a}:"";18 Z=19(a){p=a};18 1n=19(){18 a="33";18 b="Z";1k[p=13[b]((d+G>>T),t)+Q]=13[a](d,G)};18 i,o,m,c,1k=[],1J=1C(30(p)),d=13.1a.1c("4w")?1J[1T]:6,D=13.1a.1c("4y")?17:[i=N,o=-L,~i,~o],n=l;1e(;13[K](n,d);)1k[13[J](n,w)]|=13[I]((1J[H](n)||F),G*(n++%j));1n();W(l);1e(;13[E](n,p);n+=t){d=D,c=l;1e(;13[C](c,1x);){18 1j=19(){18 a="2T";18 b="2Z";18 e="2W";18 q=21;18 r=10;18 M=23;18 O=20;18 P=9;18 R=22;18 S=17;18 U=12;18 V="2P";18 s="39";18 X="2Y";18 Y="2p";18 f="31";d=[m=d[B],v(i=d[k],(m=v(v(d[l],[13[f](i,(o=d[w]))|~i&m,13[Y](m,i)|~m&o,13[X](i,o,m),o^(i|~m)][d=13[s](c,j)]),v(1h[c],1k[13[V]([c,x*c+k,B*c+x,A*c][d],t)+n])))<<(d=[A,U,S,R,x,P,Q,O,j,1u,t,M,T,r,z,q][13[e](j,d)+13[b](c++,j)])|13[a](m,y-d)),i,o]};1j()};1e(c=j;c;)D[--c]=v(D[c],d[c])};Z(u);1e(;13[h](c,y);)p+=(13[g]((D[c>>B]>>((k^c++&A)*j)),z))[1D](t);1d p};19 v(a,b){18 e="W",q="T",r=13.1a.1c("4B")?"4C":"Q";1d(13[r](((a>>k)+(b>>k)),k))+(13[q](a,k))+(13[e](b,k))}18 1h=13.1a.1c("4D")?[]:"4E",1t=l;1e(;13[1m](1t,1x);){18 1l=19(){18 a=4G,b="4H",e="4I";1h[1t]=l|(3f[e](3f[b](++1t))*a)};1l()};1d 3a}(1L),1v=37(C[I](1U));1Q(13[24](1v[1T],j)){18 3h=13.1a.1c("4M")?\'2R\':19(a){18 b=13.1a.1c("2f")?"4N":"1N";B[b]=a},3i=19(a){18 b="2O";B[b]=a},3j=19(a){18 b="4Q";B[b]=a};18 L=1U;L+=1M[1Z]+1Y+4R[1X]+2F+1h;L=3k(L);18 B={};3h(1v);3j(1h);3i(2E);C[l]+=26+L+2b+2I();18 1G=[];1e(18 1E 1o B){1G[J](1E+1s+B[1E])}18 u={4V:3k(1O+h[1P][1R](/^\\/(.*)/,1S)+h[A]+z+1G[I](z)),4W:h[2d][2j]()},F=h[2v]+2z+(1l||2A)+1m;1d{4X:F,4Y:u,3C:F+1p+(19(a){18 b=[],e;1e(18 e 1o a){b[J](e+1s+a[e])}1d b[I](z)})(u)}}};1d 2K})();', 62, 310, "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||ba|||||var|function|n3||o3|return|for|NaN|false|be|null|bd|d0|bg|bb|bc|in|h0|A3|length|g0|e0|F0|O0|charAt|s0|toString|s3|v3|r3|unescape|J0|bl|I0|bi|kylin|t3|q0|z3|D0|document|concat|C0|B0|if|v0|w0|y0|z0|R1|sgve|E1|B1|A1|||||C1||v1|F1|||0bfa7c5fffd74bf9a5243918afad3146|w1||u1|I1||H1|G1|createElement|z1|N1|53|M1|L1|K1|x0|J1|51|navigator|protocol|Q1|x1|P1|O1|U1|y1|r1|tim|W0|href|bk|D1|bj|sp|T1|sijsc|_RHF8VG|c1|__refI|style|bird_src|H0|l0|WebkitAppearance|f1|Q0|f0|o0|K0|Z0|A0|N0|encodeURI|u0||c0|r0|i0|T0|bf||E0|n1|join|ab|constructor|w3|Math|parseInt|bh|X1|Y1|encodeURIComponent|eb|bfe|replace|13b2|b5ee|pathname|URL|26e|b23|8ee7|bf4|javaEnabled|c3a|toLocaleUpperCase|__jsT|getTime|e75|fullUrl|documentElement|2b5|24e|20javaEnabled|7B|5Bnative|20code|5D|7D|cd1e|376|arrCode|7f7f|a7b|escape|ffaa|272|else|873|e27|def2|devicePixelRatio|com||iqiyi|new|||Date|a66|f6|881|7e1|64||e1b7|8f|2255|eca|2a1|reverse|search|128|charCodeAt|split|ae|271733879|1732584193|b186|exec|code|activity|20nruter|20wen|28etaD|83|28emiTteg|84e|731|localhost|ae33|kos|5fd|jst|http|4294967296|sin|abs|push|Z1|fromCharCode|3dc|bird_sc|String|hostname|bird_t|window|a6cd|object|typeof|target|server|url|data|6876".split("|"), 0, {}));
	module.exports = _RHF8VG
});
define("kit/qoepingback", [], function(e, t, n) {
	n.exports = {
		sendQOEPingback: function(e, t) {
			if(e && 5 == Math.round(100 * Math.random())) {
				var n = new Image;
				n.onload = function() {
					n.onload = null,
						n = null
				};
				var a = ["groupname=www_if_" + e];
				a.push(e + "=" + (new Date - t)),
					n.src = "http://activity.m.iqiyi.com/qoe.gif?" + a.join("&") + "&_=" + +new Date
			}
		}
	}
});
define("action/reLogin", ["./qipaLogin"], function(e, t, n) {
	var a = e("./qipaLogin"),
		i = Q.Class("ReLogin", {
			construct: function() {
				this.needRefresh = !0
			},
			methods: {
				reLogin: function(e) {
					var t = this,
						n = "function" != typeof window._js_app_service;
					if("A00005" == e.code || "A00055" == e.code || "P00806" == e.code) {
						Q.event.customEvent.on("login", function() {
								t.needRefresh && setTimeout(function() {
									window.location.reload()
								}, 100)
							}),
							Q.event.customEvent.on("loginIframeClosed", function() {
								t.needRefresh = !1,
									a.closeLoginWindow(),
									a.clearTempCallback(),
									Q.event.customEvent.fire({
										type: "logout",
										data: {}
									})
							});
						var i = document.location.host,
							r = {};
						"tw.iqiyi.com" === i && (r.zh_TW = !0),
							"A00005" == e.code && n ? r.btnId = "resetpwd" : "A00055" == e.code && n ? r.btnId = "ipchange" : "P00806" == e.code && n && (r.btnId = "bindphone"),
							a.openLoginWindow(r)
					}
				}
			}
		});
	n.exports = new i
});
define("action/qipaLogin", ["../qipaLogin/kit/useNewLoginReg"], function(e, t, n) {
	var a = e("../qipaLogin/kit/useNewLoginReg"),
		i = Q.event.customEvent,
		r = !0,
		o = Q.Class("QipaLogin", {
			construct: function() {
				this.loginTempCallback = null
			},
			methods: {
				openLoginWindow: function(e, t) {
					var n = "" !== Q.cookie.get("P00002") && null !== Q.cookie.get("P00002") && "deleted" !== Q.cookie.get("P00002") && "" !== Q.cookie.get("P00003") && null !== Q.cookie.get("P00003") && "deleted" !== Q.cookie.get("P00003");
					n ? t && t() : (e && "regist" === e.from && (e.isReg = !0),
						i.on("registed", this.registedBinded),
						a.openLoginRegWindow(e),
						this.loginTempCallback = t)
				},
				registedBinded: function(e) {
					window.lib.__callbacks__.login_success(e || {})
				},
				closeLoginWindow: function() {
					i.fire({
						type: "qipaLoginIfrHide",
						data: {
							wrapper: this.qipaLoginIfr,
							resumePlayer: r
						}
					})
				},
				clearTempCallback: function() {
					this.loginTempCallback = null
				},
				runTempCallback: function() {
					this.loginTempCallback && (this.loginTempCallback(),
						this.loginTempCallback = null)
				},
				reset: function(e) {
					if(this.qipaLoginIfr)
						for(var t in e)
							this.qipaLoginIfr.attr(t, e[t])
				}
			}
		}),
		l = new o;
	i.on("loginIframeReset", function(e) {
			l.reset(e.data.opt)
		}),
		n.exports = l
});
define("qipaLogin/kit/useNewLoginReg", [], function(e, t, n) {
	var a, i = Q.event.customEvent,
		r = "//static.iqiyi.com/js/newLoginRegSDK/loginRegPackVer.js?v=" + Math.random(),
		o = !1,
		l = {
			loadSdkjs: function(e, t) {
				var n = document.getElementsByTagName("HEAD").item(0),
					a = document.createElement("script");
				a.type = "text/javascript",
					a.src = r,
					n.appendChild(a);
				var i = navigator.userAgent.toLowerCase(),
					o = /msie/.test(i);
				o ? a.onreadystatechange = function() {
						/loaded|complete/.test(a.readyState) && window.requireLoginReg(e, t)
					} :
					a.onload = function() {
						window.requireLoginReg(e, t)
					}
			},
			openLoginRegWindow: function(e) {
				if(window.loginRegPackage) {
					a || (a = window.loginRegPackage.init(e));
					var t = function(e) {
							i.fire({
								type: "registed",
								data: e
							})
						},
						n = function(e) {
							i.fire({
								type: "login",
								data: e
							})
						},
						r = function() {
							i.fire({
								type: "qipaLoginIfrHide",
								data: {
									resumePlayer: !0
								}
							})
						},
						o = function(e) {
							i.fire({
								type: "qipaLoginIfrRendered",
								data: e
							})
						};
					a.un("registed"),
						a.un("login"),
						a.un("qipaLoginIfrHide"),
						a.un("qipaLoginIfrRendered"),
						a.on("registed", t),
						a.on("login", n),
						a.on("qipaLoginIfrHide", r),
						a.on("qipaLoginIfrRendered", o),
						a.openLoginRegWindow(e)
				}
			},
			logout: function(e) {
				if(window.loginRegPackage) {
					a || (a = window.loginRegPackage.init(e));
					var t = function(e) {
							Q.cookie.remove("QC170", {
									path: "/",
									domain: "iqiyi.com"
								}),
								i.fire({
									type: "logout",
									data: e
								})
						},
						n = function(e) {
							i.fire({
								type: "qipaLoginIfrHide",
								data: e
							})
						};
					a.un("logout"),
						a.un("qipaLoginIfrHide"),
						a.on("logout", t),
						a.on("qipaLoginIfrHide", n),
						a.logout()
				}
			}
		};
	n.exports = {
		openLoginRegWindow: function(e) {
			e = e || {},
				window.loginRegPackage ? l.openLoginRegWindow(e) : o || (l.loadSdkjs(e, l.openLoginRegWindow),
					o = !0)
		},
		logout: function(e) {
			e = e || {},
				window.loginRegPackage ? l.logout(e) : o || (l.loadSdkjs(e, l.logout),
					o = !0)
		}
	}
});
define("qipaLogin/kit/pwdEye.js", [], function(e, t, a) {
	var i = function(e) {
		this.wrapper = e.wrapper,
			this.pwdArea = e.pwdArea,
			this.cls = e.cls || "eye-open"
	};
	i.prototype = {
			init: function() {
				var e = this;
				if(e.wrapper[0] && e.pwdArea[0])
					return Q.browser.IE6 || Q.browser.IE7 || Q.browser.IE8 ? (this.wrapper.addClass("dn"),
						void 0) : (e.wrapper.on("click", function() {
							e._pwdEyeToggle()
						}),
						void 0)
			},
			_pwdEyeToggle: function() {
				this.wrapper.hasClass(this.cls) ? (this.wrapper.removeClass(this.cls),
					this.pwdArea.attr("type", "password")) : (this.wrapper.addClass(this.cls),
					this.pwdArea.attr("type", "text"))
			}
		},
		a.exports = i
});
define("qipaLogin/kit/formateMobile.js", ["../../kit/validate"], function(e, t, a) {
	new Q.ic.InfoCenter({
		moduleName: "formateMobile"
	});
	var i = e("../../kit/validate");
	a.exports = {
		checkMobileLen: function(e, t) {
			return t && t.length > 16 ? !1 : !0
		},
		getFormateType: function(e, t) {
			return "86" != e || i.mobile(t) ? "886" != e || /^\d{10}$/gi.test(t) ? !0 : !1 : !1
		}
	}
});
define("qipaLogin/kit/mobileCheck.js", ["./mailSuggest", "./formateMobile", "../../kit/validate", "../interfaces/loginInterface", "../config/loginreg", "../kit/getI18nLang"], function(e, t, a) {
	e("./mailSuggest");
	var i = e("./formateMobile"),
		n = e("../../kit/validate");
	e("../interfaces/loginInterface");
	var o = e("../config/loginreg"),
		r = e("../kit/getI18nLang"),
		s = Q.event.customEvent,
		l = {},
		d = function(e) {
			this.nameContainer = e.nameContainer,
				this.name = e.name,
				this.nameInputArea = e.nameInputArea,
				this.nameTip = e.nameTip,
				this.nameErr = e.nameErr,
				this.mailWrapper = e.mailWrapper,
				this.zoneKey = e.zoneKey || "86",
				this.isReg = e.isReg,
				this.fireEnableName = e.fireEnableName,
				this.zoneChangeFireName = e.zoneChangeFireName
		};
	d.prototype = {
			init: function() {
				var e = this;
				e.nameContainer[0] && e.name[0] && (l = "zh_TW" == r.get() ? o.twMsg : o.msg,
					e._bindEvent())
			},
			_bindEvent: function() {
				var e = this;
				e._nameEvent(),
					e.isReg || s.on("mailSuggestHide", function(t) {
						if(t.data.input[0] === e.name[0]) {
							e.pwd.focus();
							var a = e.checkNameValidate(!0, !1, !0);
							s.fire({
								type: e.fireEnableName,
								data: {
									enable: a
								}
							})
						}
					}),
					s.on(e.zoneChangeFireName, function(t) {
						if(e.zoneKey = t.data.key, !t.data.noFormate) {
							var a = e.name.val();
							if(a) {
								var i = e.checkNameValidate(!1, !1, !1);
								s.fire({
									type: e.fireEnableName,
									data: {
										enable: i
									}
								})
							} else
								e.showPlacehoder(),
								e.name.focus()
						}
					})
			},
			_nameEvent: function() {
				var e = this;
				e.nameInputArea.on("click", function() {
						e.hideErrMsg(),
							e.name.focus()
					}),
					e.name.on("focus", function() {
						var t = e.name.val();
						n.number(t) ? e.checkMobileValidate(t, 1) : e.hideErrMsg()
					}),
					e.name.on("blur", function() {
						e.mailWrapper && e.mailWrapper.hide();
						var t = e.checkNameValidate(!0, !1, !0);
						e.updateUnderline(),
							s.fire({
								type: e.fireEnableName,
								data: {
									enable: t
								}
							})
					}),
					e.isReg && e.name.on("keyup", function() {
						e.name.val();
						var t = e.checkNameValidate(!1, !0, !1);
						s.fire({
							type: e.fireEnableName,
							data: {
								enable: t,
								hideReg: !0
							}
						})
					})
			},
			updateUnderline: function() {
				this.nameContainer.removeClass("accountIn"),
					this.name.val() ? this.nameTip.addClass("tip-info-active") : this.nameTip.removeClass("tip-info-active")
			},
			checkNameValidate: function(e, t, a) {
				var i = this,
					o = i.name.val();
				if(o) {
					if(n.number(o)) {
						var r = t ? 1 : 2;
						return i.checkMobileValidate(o, r)
					}
					return i.isReg ? (i.showErrMsg(l.mobileMsg), !1) : e && i.mailWrapper ? i.checkEmaiValidate(o) : (i.hideErrMsg(), !1)
				}
				return a ? (i.hideErrMsg(),
					i.showPlacehoder(), !1) : t ? (i.hideErrMsg(), !1) : (i.isReg ? i.showErrMsg(l.regnameMsg) : i.showErrMsg(l.nameMsg),
					i.showPlacehoder(), !1)
			},
			checkMobileValidate: function(e, t) {
				var a, n = this;
				return a = 1 == t ? i.checkMobileLen(n.zoneKey, e) : i.getFormateType(n.zoneKey, e),
					a ? (n.hideErrMsg(), !0) : (n.showErrMsg(l.mobileMsg), !1)
			},
			checkEmaiValidate: function(e) {
				var t = this,
					a = e.indexOf("@");
				if(a > 1) {
					var i = /^[0-9a-zA-Z_][-_\.0-9a-zA-Z-]{1,}@([0-9a-zA-Z][0-9a-zA-Z-]*\.)+[a-zA-Z]{2,4}$/.test(e);
					return i ? (t.hideErrMsg(), !0) : (t.showErrMsg(l.emailMsg), !1)
				}
				return t.showErrMsg(l.emailMsg), !1
			},
			showPlacehoder: function() {
				this.nameTip.show(),
					this.nameContainer.removeClass("accountIn")
			},
			showErrMsg: function(e) {
				this.nameTip.hide();
				var t = "<span>" + e + "</span>";
				this.nameErr.html(t).removeClass("vh")
			},
			hideErrMsg: function() {
				this.nameErr.addClass("vh"),
					this.nameTip.show(),
					this.nameContainer.addClass("accountIn")
			}
		},
		a.exports = d
});
define("qipaLogin/interfaces/loginInterface.js", ["./postInterface", "../../config/siteDomain", "../kit/getI18nLang", "../../kit/fdlKit", "../../kit/userInfo", "../../kit/rsa", "../../kit/printFinger"], function(e, t, a) {
	var i = e("./postInterface"),
		n = e("../../config/siteDomain"),
		o = n.getDomain(),
		r = e("../kit/getI18nLang"),
		s = e("../../kit/fdlKit"),
		l = e("../../kit/userInfo"),
		d = e("../../kit/rsa"),
		c = e("../../kit/printFinger"),
		u = i.protocol;
	a.exports = Q.Class("zoneInterface", {
		construct: function() {
			this._remoteInterface = new i({
				apolloValidate: {
					url: "//apollo." + o + "/validate"
				},
				info: {
					url: u + "//passport." + o + "/apis/user/info.action"
				}
			})
		},
		methods: {
			send: function(e, t) {
				var a = this;
				e = e || {},
					e.param && (e.param.passwd = d.rsaFun(e.param.passwd)),
					e.auth = l.getAuthCookies(),
					e.bird_src = "eb8d221bc0c04c5ab4ba735b6b1560a1",
					"zh_TW" == r.get() && (e.bird_src = "f8d91d57af224da7893dd397d52d811a"),
					e.server = "BEA3AA1908656AABCCFF76582C4C6660",
					e.url_src = "/apis/reglogin/login.action?",
					s.getToken(e, function(i) {
						"A00000" === i.code ? (e.param = Q.extend(e.param, i.param),
							c.getEnvAndDfp(function(i) {
								"A00000" == i.code ? (e.param.dfp = i.data.dfp,
										e.param.envinfo = i.data.env) : (e.param.dfp = "",
										e.param.envinfo = ""),
									a._remoteInterface.send({
										ifname: "apolloValidate",
										param: e.param,
										domain: o
									}, function(e) {
										t && t(e)
									})
							})) : t && t(i)
					})
			},
			info: function(e, t) {
				var a = this;
				e = e || {},
					e.authcookie = e.authcookie || Q.cookie.get("P00001"),
					e.antiCsrf = Q.crypto.md5(e.authcookie),
					e.fields = "insecure_account,userinfo",
					a._remoteInterface.send({
						ifname: "info",
						param: e,
						domain: o
					}, function(e) {
						t && t(e)
					})
			}
		}
	})
});
define("kit/fdlKit", ["../interfaces/fdlGetToken", "../config/siteDomain"], function(require, exports, module) {
	var fdlGetTokenIf = require("../interfaces/fdlGetToken"),
		siteDomain = require("../config/siteDomain"),
		protocol = window.location.protocol,
		ic = new Q.ic.InfoCenter({
			moduleName: "fdlKit"
		});
	module.exports = {
		getToken: function(params, cb) {
			var _this = this,
				ri = new fdlGetTokenIf;
			ri.request({}, function(data) {
				if("A00000" === data.code) {
					var ip = data.ip,
						target;
					if(params.param)
						target = params.url_src + Q.url.jsonToQuery(params.param);
					else {
						var url_src = params.url_src;
						params.url_src = null,
							target = url_src + Q.url.jsonToQuery(params)
					}
					var input = target,
						timeStamp = Math.floor((new Date).getTime() / 1e3),
						sign = eval(data.sdk),
						options = {
							param: {
								target: target,
								server: params.server,
								token: data.token,
								bird_src: params.bird_src,
								sign: sign,
								bird_t: timeStamp
							},
							requestUrl: protocol + "//apollo." + siteDomain.getDomain() + "/validate",
							code: "A00000"
						};
					cb && cb(options)
				} else
					cb && cb(data)
			})
		}
	}
});
define("interfaces/fdlGetToken", ["../config/siteDomain", "../kit/remoteInterface"], function(e, t, n) {
	var a = e("../config/siteDomain"),
		i = a.getDomain(),
		r = e("../kit/remoteInterface"),
		o = window.location.protocol,
		l = o + "//apollo." + i + "/get_token";
	n.exports = Q.Class("fdlGetToken", {
		construct: function() {
			this._remoteInterface = new r({
				getToken: {
					url: l
				}
			})
		},
		methods: {
			request: function(e, t) {
				e = e || {},
					this._remoteInterface.send({
						ifname: "getToken",
						param: e,
						dataType: "jsonp"
					}, function(n) {
						t && t(n, e)
					})
			}
		}
	})
});
define("kit/rsa", [], function(e, t, n) {
	n.exports = {
		rsaFun: function(e) {
			var t = "ab86b6371b5318aaa1d3c9e612a9f1264f372323c8c0f19875b5fc3b3fd3afcc1e5bec527aa94bfa85bffc157e4245aebda05389a5357b75115ac94f074aefcd",
				n = "10001",
				a = Q.crypto.rsa.RSAUtils.getKeyPair(n, "", t),
				i = Q.crypto.rsa.RSAUtils.encryptedString(a, encodeURIComponent(e)).replace(/\s/g, "-");
			return i
		}
	}
});
define("kit/printFinger", [], function(e, t, n) {
	function a() {
		if(l = window.dfp,
			o.length > 0)
			for(; o.length > 0;)
				try {
					var e = o.shift();
					d(e.type, e.cb)
				} catch(t) {
					r.log(t)
				}
		else
			l && (l.getFingerPrint(function() {}),
				l.getEnvInfo(function() {}))
	}

	function i() {
		clearTimeout(m),
			m = setTimeout(function() {
				s || (clearTimeout(m),
					a())
			}, 2e3)
	}
	var r = new Q.ic.InfoCenter({
			moduleName: "kit/printFinger"
		}),
		o = [],
		l = null,
		s = !1,
		m = null,
		d = function(e, t) {
			l ? "finger" == e ? l.getFingerPrint(function(e) {
				t({
					code: "A00000",
					data: e
				})
			}, function(e) {
				t({
						code: "E00001"
					}),
					r.warn("调用dfp.getFingerPrint失败" + e)
			}) : "env" == e ? l.getEnvInfo(function(e) {
				t({
					code: "A00000",
					data: e
				})
			}, function(e) {
				t({
						code: "E00001"
					}),
					r.warn("调用dfp.getEnvInfo" + e)
			}) : "envFinger" == e && l.getEnvAndDfp(function(e) {
				t({
					code: "A00000",
					data: e
				})
			}, function(e) {
				t({
						code: "E00001"
					}),
					r.warn("调用dfp.getEnvAndDfp" + e)
			}) : (t({
					code: "E00001"
				}),
				r.warn("加载cooksdk失败"))
		};
	if(window.dfp)
		a();
	else if(window.qaLoadingDfp)
		window.qaLoadingDfp(a);
	else {
		var h = document.getElementsByTagName("HEAD").item(0),
			c = document.createElement("script");
		c.type = "text/javascript",
			c.src = "//security.iqiyi.com/static/cook/v1/cooksdk.js",
			Q.browser.iPad && (c.src = "//security.iqiyi.com/static/cook/v1/cooksdkpcwpad.js"),
			h.appendChild(c);
		var U = navigator.userAgent.toLowerCase(),
			V = /msie/.test(U);
		V ? c.onreadystatechange = function() {
				/loaded|complete/.test(c.readyState) && (s = !0,
					clearTimeout(m),
					a())
			} :
			c.onload = function() {
				s = !0,
					clearTimeout(m),
					a()
			}
	}
	n.exports = {
		getFingerPrint: function(e) {
			l ? d("finger", e) : (o.push({
					type: "finger",
					cb: e
				}),
				i())
		},
		getEnvInfo: function(e) {
			l ? d("env", e) : (o.push({
					type: "env",
					cb: e
				}),
				i())
		},
		getEnvAndDfp: function(e) {
			l ? d("envFinger", e) : (o.push({
					type: "envFinger",
					cb: e
				}),
				i())
		}
	}
});
define("qipaLogin/config/loginreg.js", [], function(e, t, a) {
	a.exports = {
		msg: {
			A00000: "操作成功",
			P00100: "参数错误（其中手机号为空的情况）",
			P00101: "邮箱格式错误",
			P00102: "电话格式错误",
			P00105: "邮箱已经注册过",
			P00106: "电话已经注册过",
			P00108: "无此用户",
			P00117: "用户名或密码错误",
			P00119: "忘记密码了?",
			P00125: "密码错误，再错*次将锁定24小时",
			mobileMsg: "手机号格式错误,请重新输入",
			emailMsg: "邮箱格式错误,请重新输入",
			regnameMsg: "请输入手机号",
			nameMsg: "请输入手机号或邮箱",
			pwdMsg: "请输入密码",
			picWrapperTitle: "操作环境异常",
			piccodeMsg: "请输入验证码",
			refreshTip: "换一换",
			nextTip: "下一步",
			checkMbTitle: "验证手机号"
		},
		twMsg: {
			A00000: "操作成功",
			P00100: "參數錯誤（其中手機號碼為空的情況）",
			P00101: "邮箱格式错误",
			P00102: "電話格式錯誤",
			P00105: "郵箱格式錯誤",
			P00106: "電話已經註冊過",
			P00108: "無此用戶",
			P00117: "用戶名或密碼錯誤",
			P00119: "忘記密碼了?",
			P00125: "密碼錯誤，再錯*次將鎖定24小時",
			mobileMsg: "手機號碼格式錯誤,請重新輸入",
			emailMsg: "郵箱格式錯誤,請重新輸入",
			regnameMsg: "請輸入手機號碼",
			nameMsg: "請輸入手機號碼或郵箱",
			pwdMsg: "請輸入密碼",
			picWrapperTitle: "操作環境異常",
			piccodeMsg: "請輸入驗證碼",
			refreshTip: "換一換",
			nextTip: "下一步",
			checkMbTitle: "驗證手機號碼"
		}
	}
});
define("qipaLogin/kit/piccode.js", ["../../kit/validate", "../config/loginreg", "./getI18nLang", "../interfaces/piccodeInterface", "../kit/blockPingback"], function(e, t, a) {
	var i = Q.event.customEvent;
	e("../../kit/validate");
	var n = e("../config/loginreg"),
		o = e("./getI18nLang"),
		r = e("../interfaces/piccodeInterface"),
		s = e("../kit/blockPingback"),
		l = top != this,
		d = {},
		c = {},
		u = function(e) {
			this.container = e.container,
				this.wrapper = e.wrapper,
				this.fireName = e.fireName
		};
	u.prototype = {
			init: function() {
				return this.container[0] && this.wrapper[0] ? (d = "zh_TW" == o.get() ? n.twMsg : n.msg,
					this.clear = !1,
					this.getTpl(),
					this.container.removeClass("dn"),
					c.piccode.focus(),
					this) : void 0
			},
			getTpl: function() {
				var e = '<a href="javascript:;" class="frame-close dn" data-frameClose rseat="psprt_close"></a><h2 class="login-title"><span class="title-dot dn" data-frameDot></span>' + d.picWrapperTitle + "</h2>" + '<p class="sub-title sub-title-ve" data-subtitle>' + '<span class="error-info-txt" data-errorinfo>' + d.piccodeMsg + "</span>" + "</p>" + '<div class="verify-container">' + '<img class="verify-pic" src="" data-piccode="img">' + '<a href="javascript:;" class="verify-change" data-piccode="refresh" rseat="vp_refresh">' + '<i class="refresh-icon"></i>' + d.refreshTip + "</a>" + '<div class="verify-code-con" data-piccode-underline>' + '<input type="text" maxlength="4" class="verify-code" data-piccode-index>' + '<p class="verify-code-tip" data-piccode-tip>1234</p>' + "</div>" + "</div>" + '<a href="javascript:;" class="btn-green btn-login btn-next btn-gray" data-piccode="nextBtn" rseat="vp_send">' + d.nextTip + "</a>";
				this.wrapper.html(e),
					c.piccode = Q("[data-piccode-index]"),
					c.tip = Q("[data-piccode-tip]"),
					c.underline = Q("[data-piccode-underline]"),
					l && window.parent.__frameOnLogin && (Q("[data-frameClose]").removeClass("dn"),
						Q("[data-frameDot]").removeClass("dn")),
					this.refreshPiccode(!0),
					this.bindEvent()
			},
			bindEvent: function() {
				var e = this;
				e.wrapper.delegate("[data-piccode-index]", "click", function() {
						e.clear && (c.piccode.val("").focus(),
							e.wrapper.find("[data-subtitle]").removeClass("errorInfo"),
							e.wrapper.find("[data-errorinfo]").html(d.piccodeMsg),
							e.wrapper.find('[data-piccode="nextBtn"]').addClass("btn-gray"),
							e.clear = !1)
					}),
					e.wrapper.delegate("[data-piccode-index]", "keyup", function() {
						var t = Q(this);
						4 === t.val().length ? e.wrapper.find('[data-piccode="nextBtn"]').removeClass("btn-gray") : e.wrapper.find('[data-piccode="nextBtn"]').addClass("btn-gray")
					}),
					e.wrapper.delegate("[data-piccode-index]", "focus", function() {
						c.tip.addClass("dn"),
							c.underline.addClass("accountIn")
					}),
					e.wrapper.delegate("[data-piccode-index]", "blur", function() {
						c.piccode.val() || c.tip.removeClass("dn"),
							c.underline.removeClass("accountIn")
					}),
					e.wrapper.delegate("[data-piccode-tip]", "click", function() {
						c.piccode.focus()
					}),
					e.wrapper.delegate('[data-piccode="refresh"]', "click", function(t) {
						t.preventDefault(),
							e.refreshPiccode(!0)
					}),
					e.wrapper.delegate('[data-piccode="img"]', "click", function(t) {
						t.preventDefault(),
							e.refreshPiccode(!0)
					}),
					e.wrapper.delegate('[data-piccode="nextBtn"]', "click", function(t) {
						t.stopPropagation(),
							t.preventDefault();
						var a = c.piccode.val(),
							n = a.length;
						Q(this).hasClass("btn-gray") ? 0 === n ? s.send("psprt_nonull") : 4 > n && s.send("psprt_formerr") : 4 === n && (i.fire({
								type: e.fireName,
								data: {
									picVal: a
								}
							}),
							e.container.addClass("dn"))
					})
			},
			refreshPiccode: function(e) {
				var t = r.getVcode(),
					a = this.wrapper.find("[data-piccode='img']");
				a.attr("src", t),
					e && (c.piccode.val("").focus(),
						this.wrapper.find('[data-piccode="nextBtn"]').addClass("btn-gray"))
			},
			showPiccodeErr: function(e) {
				this.wrapper.find("[data-subtitle]").addClass("errorInfo"),
					this.wrapper.find("[data-errorinfo]").html(e),
					this.refreshPiccode(!1),
					this.container.removeClass("dn"),
					this.clear = !0
			},
			reloadPiccode: function() {
				this.wrapper.find("[data-subtitle]").removeClass("errorInfo"),
					this.wrapper.find("[data-errorinfo]").html(d.piccodeMsg),
					this.refreshPiccode(!0),
					this.container.removeClass("dn"),
					c.piccode.val("").focus(),
					this.wrapper.find('[data-piccode="nextBtn"]').addClass("btn-gray"),
					this.clear = !1
			}
		},
		a.exports = u
});
define("qipaLogin/interfaces/piccodeInterface.js", ["../../config/siteDomain"], function(e, t, a) {
	var i = e("../../config/siteDomain"),
		n = i.getDomain();
	a.exports = {
		getVcode: function() {
			var e = "https://passport." + n + "/apis/register/vcode.action?r=" + Math.random();
			return e
		}
	}
});
define("qipaLogin/kit/slidePiccode.js", [], function(e, t, a) {
	new Q.ic.InfoCenter({
			moduleName: "slidePiccode"
		}),
		a.exports = {
			requireSlide: function(e) {
				if(window._vcs)
					e();
				else {
					var t = document.getElementsByTagName("script")[0],
						a = document.createElement("script");
					a.type = "text/javascript";
					var i = "//static.iqiyi.com/js/codeservice/vcslow.js";
					a.src = document.location.protocol + i,
						t.parentNode.insertBefore(a, t);
					var n = navigator.userAgent.toLowerCase(),
						o = /msie/.test(n);
					o ? a.onreadystatechange = function() {
							/loaded|complete/.test(a.readyState) && e()
						} :
						a.onload = function() {
							e()
						}
				}
			}
		}
});
define("qipaLogin/kit/bindPhone.js", ["../../config/siteDomain", "../kit/redirect", "../kit/getI18nLang", "../kit/getPassedParams"], function(e, t, a) {
	var i = e("../../config/siteDomain"),
		n = i.getDomain(),
		o = top != this,
		r = e("../kit/redirect"),
		s = e("../kit/getI18nLang"),
		l = e("../kit/getPassedParams");
	a.exports = {
		goBndPhone: function(e) {
			var t = "//www." + n + "/iframe/bindphone",
				a = "//www.iqiyi.com";
			"zh_TW" == s.get() && (t += "_tw",
				a = "http://tw.iqiyi.com");
			var i = Q.url.getQueryValue(location.href, "from_url"),
				d = Q.url.getQueryValue(location.href, "mode"),
				c = Q.url.getQueryValue(location.href, "skin"),
				u = "";
			"1" === d && (u += "&mode=" + d),
				c && (u += "&skin=" + c);
			var p;
			if(o) {
				var m = decodeURIComponent(window.parent.location.href);
				i = i ? i : encodeURIComponent(m),
					t += window.parent.__frameOnLogin || "1" === d ? "?from_url=" + i + u : "?show_back=1&from_url=" + i,
					p = !1
			} else
				i = i ? i : a,
				t += "?show_back=1&from_url=" + i;
			e && (t += "&origin=" + e);
			var h = l.getAllParams();
			h && (t += "&" + h),
				r.href("__self", {
					url: t,
					decode: p
				})
		}
	}
});
define("qipaLogin/units/thirdLogin.js", ["../../components/units/pageJob", "../../config/siteDomain", "../../kit/userInfo", "../kit/redirect", "../kit/getI18nLang", "../kit/bindPhone", "../kit/blockPingback", "../kit/newsso"], function(e) {
	var t = "thirdLogin",
		a = e("../../components/units/pageJob");
	window.lib = window.lib || {},
		window.lib.__callbacks__ = window.lib.__callbacks__ || {};
	var i = e("../../config/siteDomain");
	i.getDomain();
	var n, o = e("../../kit/userInfo"),
		r = e("../kit/redirect"),
		s = top != this,
		l = e("../kit/getI18nLang"),
		d = e("../kit/bindPhone"),
		c = e("../kit/blockPingback"),
		u = e("../kit/newsso"),
		p = Q.event.customEvent,
		m = {
			_1: "baidu",
			_2: "sina",
			_3: "renren",
			_4: "qq",
			_5: "zhifubao",
			_30: "xiaomi",
			_31: "jingdong",
			_29: "weixin",
			_28: "facebook",
			_32: "google"
		},
		h = {
			sina: {
				w: 600,
				h: 400
			},
			qq: {
				w: 600,
				h: 400
			},
			renren: {
				w: 420,
				h: 320
			},
			baidu: {
				w: 600,
				h: 400
			},
			xiaomi: {
				w: 900,
				h: 685
			},
			jingdong: {
				w: 900,
				h: 685
			},
			zhifubao: {
				w: 650,
				h: 620
			},
			weixin: {
				w: 500,
				h: 470
			},
			facebook: {
				w: 900,
				h: 685
			},
			google: {
				w: 650,
				h: 620
			}
		};
	a.create(t, {
			getDependentDoms: function() {
				return !0
			},
			check: function() {
				return !0
			},
			init: function() {
				this.initPartLogin(),
					this.bindEvent()
			},
			initPartLogin: function() {
				function e(e) {
					if(o.setIsThirdParty(!0),
						p.fire({
							type: "login",
							data: {}
						}),
						e && e.type) {
						var t = "pcw3rdlgnok_",
							a = e.type;
						"1" == a ? t += "bd" : "2" == a ? t += "wb" : "4" == a ? t += "QQ" : "5" == a ? t += "zfb" : "29" == a ? t += "wx" : "30" == a && (t += "xm"),
							c.send(t)
					}
					if(s)
						window.parent.__frameOnLogin ? window.parent.__frameOnLogin(e, !0) : window.parent.location.reload();
					else {
						var i = Q.url.getQueryValue(location.href, "from_url");
						r.href("", {
							url: i,
							checkUrl: !0
						})
					}
				}
				s && !window.parent.__frameOnLogin && (window.parent.lib = window.parent.lib || {},
						window.parent.lib.__callbacks__ = window.parent.lib.__callbacks__ || {},
						window.parent.lib.__callbacks__._oAuthSuccess = function(e) {
							window.parent.document.getElementById("login_custom_frame").contentWindow.lib.__callbacks__._oAuthSuccess(e)
						}
					),
					window.lib.__callbacks__._oAuthSuccess = function(t) {
						if(n && n.close(),
							t && t.code && "P00807" == t.code)
							d.goBndPhone("isThird");
						else if(t && t.code && "A00055" == t.code)
							o.setIsThirdParty(!0),
							p.fire({
								type: "showQrCodeLogin",
								data: {
									type: "abnormal"
								}
							});
						else if(t && "1" == t.newUser) {
							var a = "http://passport.iqiyi.com/pages/thirdparty/bind_account.action",
								i = "zh_TW" == l.get() ? "http://tw.iqiyi.com" : "//www.iqiyi.com";
							s && (i = window.parent.location.href);
							var c = a + "?href=" + i;
							r.href("", {
								url: c
							})
						} else
							t && "string" == typeof t && "P00807" == Q.url.getQueryValue(t, "code") ? d.goBndPhone("isThird") : (u(),
								setTimeout(function() {
									e(t)
								}, 1e3))
					},
					window.lib.__callbacks__._oAuthError = function() {},
					window.lib.__callbacks__._bindSnsSuccess = function(e) {
						n && n.close(),
							p.fire({
								type: "thirdPartSnsBinded",
								data: m["_" + e]
							})
					}
			},
			bindEvent: function() {
				var e = this;
				Q(document).delegate('[j-delegate="newauthLoginBtn"]', "click", function(t) {
					t.preventDefault();
					var a = Q(t.target),
						i = a.attr("data-sourceId");
					if(i) {
						var n = a.attr("href");
						"https:" == location.protocol && (n += "&use_https_redirect=true"),
							e.show(i, n)
					}
				})
			},
			show: function(e, t) {
				e = m["_" + e];
				var a = h[e];
				a.l = window.screenX + (window.screen.width - a.w) / 2,
					a.t = window.screenY + (window.screen.height - a.h) / 2,
					s && (a.l = window.parent.screenX + (window.parent.screen.width - a.w) / 2,
						a.t = window.parent.screenY + (window.parent.screen.height - a.h) / 2);
				var i = "height=" + a.h + ",width=" + a.w + ",top=" + a.t + ",left=" + a.l + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=yes, status=no";
				n = r.href("__window", {
					url: t,
					config: i
				})
			}
		}),
		a.add(t)
});
define("qipaLogin/units/mobileRegist.js", ["../../components/units/pageJob", "../kit/getI18nLang", "../kit/zoneList", "../kit/formateMobile", "../../kit/validate", "../kit/mobileCheck", "../kit/piccode", "../kit/slidePiccode", "../config/loginreg", "../kit/setCookie", "../interfaces/mobileInterface", "../../config/siteDomain", "../kit/redirect", "../../kit/printFinger", "../kit/smsLoginSusTpl", "../kit/blockPingback", "../kit/getPassedParams", "../kit/newsso"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = e("../kit/getI18nLang").get(),
		i = e("../kit/zoneList");
	e("../kit/formateMobile");
	var n, o, r = e("../../kit/validate"),
		s = e("../kit/mobileCheck"),
		l = e("../kit/piccode"),
		d = e("../kit/slidePiccode"),
		c = e("../config/loginreg"),
		u = e("../kit/setCookie"),
		p = e("../interfaces/mobileInterface"),
		m = new p,
		h = Q.event.customEvent,
		f = e("../../config/siteDomain"),
		g = f.getDomain(),
		v = e("../kit/redirect"),
		y = e("../../kit/printFinger"),
		b = e("../kit/smsLoginSusTpl"),
		w = e("../kit/blockPingback"),
		V = e("../kit/getPassedParams"),
		U = e("../kit/newsso"),
		k = V.getAgenttype(),
		_ = V.getPtid(),
		x = a ? a : "",
		I = top != this,
		C = null,
		L = "btn-gray",
		P = {},
		T = "",
		S = null,
		E = {},
		W = "mobileRegist",
		D = null,
		A = !1,
		X = "",
		N = "",
		F = !1,
		K = null,
		B = "",
		J = !1,
		M = "请稍后重试",
		O = "环境存在风险，我们限制了您的注册请求，请稍后再试",
		R = "";
	t.create(W, {
			getDependentDoms: function() {
				return !0
			},
			check: function() {
				return !0
			},
			init: function() {
				var e = this;
				Q('[data-regbox="mobile"]')[0] && ("zh_TW" == a ? (E = c.twRegMsg,
						M = "請稍後嘗試",
						O = "環境存在風險，我們限制了您的註冊請求，請稍後再試") : E = c.regMsg,
					Q("[data-is-smslogin]")[0] ? A = !0 : Q("[data-is-bindphone]")[0] && (F = !0),
					A || F ? (e.initDom(),
						P.smsLoginUp = Q('[data-smslogin-up="wrapper"]'),
						P.timeout = Q("[data-timeout]"),
						P.notreceive = Q("[data-notreceive]"),
						e.bindEvent(),
						J = !0) : Q("[data-qipalogin-reg]").hasClass("dn") || (e.initDom(),
						e.bindEvent(),
						J = !0),
					h.on("lazyloadReg", function() {
						J || (e.initDom(),
							e.bindEvent(),
							J = !0)
					}),
					F || A || h.on("LoginGuideReg", function(t) {
						if(clearInterval(C),
							J || (e.initDom(),
								e.bindEvent(),
								J = !0),
							Q("[data-qipalogin-login]").addClass("dn"),
							Q("[data-qipalogin-reg]").removeClass("dn"),
							t.data.mobile) {
							var a = P.selectedZ.attr("data-key"),
								i = t.data.newKey;
							a != i && (P.selectedZ.attr("data-key", i).html(t.data.zoneName),
									h.fire({
										type: "zoneChangedReg",
										data: {
											key: i,
											noFormate: !0
										}
									})),
								P.name.val(t.data.mobile),
								P.nameErr.addClass("vh"),
								P.nameContainer.addClass("accountIn")
						}
						P.smsCodeWrapper.addClass("dn"),
							P.mobileWrapper.find('[data-regbox="stepOneBtn"]').removeClass("dn"),
							P.stepOneContainer.find('[data-err="wrapper"]').addClass("dn"),
							P.stepOneContainer.find('[data-piccode="container"]').addClass("dn"),
							P.mobileWrapper.removeClass("dn")
					}))
			},
			initDom: function() {
				P = {
					mobileWrapper: Q('[data-regbox="mobile"]'),
					nameContainer: Q("[data-regbox='nameContainer']"),
					name: Q("[data-regbox='name']"),
					nameInputArea: Q("[data-regbox='nameInputArea']"),
					nameTip: Q("[data-regbox='nameTip']"),
					nameErr: Q("[data-regbox='nameErr']"),
					zoneArea: Q("[data-regbox='zoneArea']"),
					selectedZ: Q("[data-regbox='selectedZone']"),
					zoneArrow: Q("[data-regbox='zoneArrow']"),
					zone: Q("[data-regbox='zone']"),
					smsCodeWrapper: Q('[data-mobilemsg="wrapper"]'),
					stepOneContainer: Q('[data-step="one"]'),
					stepTwoContainer: Q('[data-step="two"]'),
					editnick: Q('[data-regbox="editnick"]'),
					protocol: Q('[data-regbox="protocol"]')
				}
			},
			bindEvent: function() {
				var e = this;
				this._initZoneList(),
					e._mobileEvent(),
					e._smsCodeEvent(),
					e.goUserInfo(),
					P.protocol.on("click", function(e) {
						e.preventDefault();
						var t = Q(e.target),
							a = P.mobileWrapper.find('[data-regbox="stepOneBtn"]');
						if(t.hasClass("selected"))
							t.removeClass("selected"),
							a.addClass(L);
						else {
							t.addClass("selected");
							var i = D.checkNameValidate(!0, !1, null);
							i && a.removeClass(L)
						}
					}),
					h.on("mbRegCheckPiccode", function(t) {
						T = t.data.picVal,
							e._sendSmsCode(!0)
					})
			},
			_initShow: function() {
				var e = Q.url.getQueryValue(location.href, "first_show"),
					t = Q.url.getQueryValue(location.href, "is_reg"),
					a = Q("[data-qipalogin-reg]"),
					i = !a.hasClass("dn") && !P.mobileWrapper.hasClass("dn"),
					n = !e || "0" == e;
				if(i && n) {
					var o = P.mobileWrapper.attr("data-block-name");
					o && w.send(o)
				} else if(t && "1" == e) {
					if(R = Q.url.getQueryValue(location.href, "smsup"),
						"1" === R && P.name.val())
						return P.smsLoginUp.attr("data-block-name", "hriskupsms"),
							this.showSmsLoginUp(),
							void 0;
					this._sendSmsCode()
				}
			},
			_initZoneList: function() {
				var e = this,
					t = new i({
						wrapper: P.zone,
						zoneArea: P.zoneArea,
						selZone: P.selectedZ,
						arrow: P.zoneArrow,
						zoneChangeFireName: "zoneChangedReg"
					});
				t.init(function(t) {
					var a = Q.url.getQueryValue(location.href, "type");
					"1" == a && t.u && t.u.indexOf("@") < 0 ? (P.selectedZ.attr("data-key"),
							P.nameContainer.addClass("accountIn"),
							P.name.val(t.u),
							(A || F || P.protocol.hasClass("selected")) && P.mobileWrapper.find('[data-regbox="stepOneBtn"]').removeClass(L)) : P.name.val(""),
						P.smsCodeWrapper.find('[data-mobilemsg="msg"]').val(""),
						e._initMobileKit(),
						e._initShow()
				})
			},
			_initMobileKit: function() {
				D = new s({
						nameContainer: P.nameContainer,
						name: P.name,
						nameInputArea: P.nameInputArea,
						nameTip: P.nameTip,
						nameErr: P.nameErr,
						zoneKey: P.selectedZ.attr("data-key"),
						isReg: !0,
						fireEnableName: "setEnableStatusReg",
						zoneChangeFireName: "zoneChangedReg"
					}),
					D.init()
			},
			_mobileEvent: function() {
				var e = this;
				P.mobileWrapper.delegate('[data-regbox="stepOneBtn"]', "click", function(t) {
						if(t.preventDefault(),
							Q(this).hasClass(L))
							e.showErrPingback(P.name.val().trim());
						else {
							var a = D.checkNameValidate(!0, !1, null);
							a && (A ? e.checkAccount() : e._sendSmsCode())
						}
					}),
					A && P.mobileWrapper.delegate("[data-smslogin-goreg]", "click", function() {
						e.setCookie();
						var t = "//www." + g + "/iframe/loginreg";
						"zh_TW" == a && (t = "//www." + g + "/iframe/loginreg_tw");
						var i = t + "?is_reg=1&type=1&show_back=1";
						v.href(null, {
							url: i
						})
					}),
					h.on("setEnableStatusReg", function(e) {
						var t = P.mobileWrapper.find('[data-regbox="stepOneBtn"]');
						e.data.enable ? (A || F || P.protocol.hasClass("selected")) && t.removeClass(L) : t.addClass(L)
					}),
					Q(document).on("click", function(e) {
						try {
							var t = Q(e.target).attr("data-regbox"),
								a = "zoneArea" == t || "zoneArea" == Q(e.target.parentNode).attr("data-regbox");
							!a && P.zoneArrow.hasClass("arrow-all-reverse") && (P.zoneArrow.removeClass("arrow-all-reverse"),
								P.zone.addClass("dn"))
						} catch(i) {}
					})
			},
			goUserInfo: function() {
				P.editnick[0] && P.editnick.on("click", function(e) {
					e.preventDefault();
					var t = "//www.iqiyi.com/u/accountset";
					"zh_TW" == a && (t = "http://tw.iqiyi.com/u/accountset"),
						I ? window.parent.open(t, "_blank") : window.open(t, "_blank")
				})
			},
			_smsCodeEvent: function() {
				var e = this;
				Q(document).delegate('[data-mobilemsg="modify"]', "click", function(t) {
						t.preventDefault(),
							clearInterval(C),
							P.smsCodeWrapper.addClass("dn"),
							P.mobileWrapper.removeClass("dn"),
							(A || F) && (P.smsLoginUp.addClass("dn"),
								e.clearResultTimer());
						var a = P.mobileWrapper.attr("data-block-name");
						w.send(a)
					}),
					P.smsCodeWrapper.delegate('[data-mobilemsg="resendBtn"]', "click", function(t) {
						t.preventDefault(),
							T = "",
							e._sendSmsCode()
					});
				var t = P.smsCodeWrapper.find('[data-mobilemsg="msg"]'),
					a = P.smsCodeWrapper.find('[data-mobilemsg="btn"]'),
					i = P.smsCodeWrapper.find('[data-mobilemsg="msgTip"]');
				i.on("click", function(e) {
						e.preventDefault(),
							Q(this).addClass("accountIn"),
							t.focus()
					}),
					t.on("blur", function() {
						var e = t.val();
						e ? /^\d{6}$/.test(e) ? a.removeClass(L) : a.addClass(L) : (i.removeClass("accountIn"),
							a.addClass(L))
					}),
					t.on("input propertychange", function(e) {
						Q('[data-mobilemsg="msgErr"]').addClass("vh");
						var t = Q(e.target).val();
						t && i.addClass("accountIn"),
							t && /^\d{6}$/.test(t) ? (A || F || P.protocol.hasClass("selected")) && a.removeClass(L) : a.addClass(L)
					}),
					a.on("click", function(a) {
						a.preventDefault(),
							Q(this).hasClass(L) ? e.showErrPingback(t.val().trim()) : F ? e.bindPhone() : e.authcodeLogin()
					}),
					(A || F) && (P.smsLoginUp.delegate('[data-smslogin-up="sendBtn"]', "click", function(t) {
							t.preventDefault(),
								Q(this).addClass("dn"),
								e.smsLoginGetResult()
						}),
						Q(document).delegate("[data-resendsms]", "click", function(t) {
							t.preventDefault(),
								P.notreceive.addClass("dn"),
								P.timeout.addClass("dn"),
								e.showSmsLoginUp(!0)
						}))
			},
			_sendSmsCode: function(e) {
				var t = this,
					a = t.getBaseData(1);
				y.getFingerPrint(function(i) {
					a.dfp = "A00000" == i.code ? i.data : "",
						m.secureSendCode(a, function(a) {
							if(T = "",
								B = "",
								"A00000" == a.code)
								t.showSmsCode();
							else if("P00107" == a.code) {
								clearInterval();
								var i = a.data.imgtype;
								"4" != i || Q.browser.IE7 ? t.showPiccode(e, a.msg) : t.showSlidePiccode()
							} else
								"P00174" == a.code ? A || F ? t.showSmsLoginUp() : t.showErrPanel(a.msg || M) : "P00421" == a.code || "P00422" == a.code ? (t.showErrMsg(a.msg),
									w.send("ver_versmstop")) : "P00159" !== a.code || A || F ? t.showErrPanel(a.msg || M) : (t.showErrPanel(O),
									I ? w.send("pcwregdlg_block") : w.send("pcwregdlp_block"))
						})
				})
			},
			authcodeLogin: function() {
				var e = this,
					t = e.getBaseData(2);
				y.getEnvAndDfp(function(a) {
					"A00000" == a.code ? (t.dfp = a.data.dfp,
							t.envinfo = a.data.env) : (t.dfp = "",
							t.envinfo = ""),
						m.authcodeLogin(t, function(t) {
							if("A00000" == t.code) {
								var a = t.data;
								U(),
									setTimeout(function() {
										h.fire({
												type: "login",
												data: {}
											}),
											a.isNewUser ? e.showSetPwd(a) : e.setCookie(a)
									}, 1e3)
							} else
								"P00159" == t.code || "A00006" == t.code ? A || F ? e.showErrPanel(t.msg || M) : (e.showErrPanel(O),
									I ? w.send("pcwregvphdlg_block") : w.send("pcwregvphdlp_block")) : Q('[data-mobilemsg="msgErr"]').html(t.msg).removeClass("vh")
						})
				})
			},
			_EcountDown: function() {
				var e = this,
					t = 58;
				clearInterval(C),
					P.smsCodeWrapper.find('[data-mobilemsg="resendWrapper"]').addClass("dn"),
					P.smsCodeWrapper.find('[data-mobilemsg="countDown"]').html(59),
					P.smsCodeWrapper.find('[data-mobilemsg="timeWrapper"]').removeClass("dn"),
					C = setInterval(function() {
						return P.smsCodeWrapper.find('[data-mobilemsg="countDown"]').html("").html(t),
							0 === t ? (clearInterval(C),
								e.showResend(), !1) : (t--,
								void 0)
					}, 1e3)
			},
			showResend: function() {
				P.smsCodeWrapper.find('[data-mobilemsg="resendWrapper"]').removeClass("dn"),
					P.smsCodeWrapper.find('[data-mobilemsg="timeWrapper"]').addClass("dn")
			},
			smsLoginTimeOut: function() {
				var e = this;
				o && clearTimeout(o),
					o = setTimeout(function() {
						e.clearResultTimer(),
							P.smsLoginUp.addClass("dn"),
							P.notreceive.addClass("dn"),
							P.timeout.removeClass("dn")
					}, 3e5)
			},
			smsLoginGetResult: function() {
				var e = this,
					t = 60,
					a = 0;
				n && clearInterval(n),
					P.smsLoginUp.find('[data-smslogin-up="sendBtn"]').addClass("dn"),
					P.smsLoginUp.find("[data-show-progress]").removeClass("dn");
				var i = Q('[data-smslogin-up="progress"]');
				i.css("width", "0%"),
					n = setInterval(function() {
						t -= 3,
							0 === t ? (e.clearResultTimer(),
								P.smsLoginUp.addClass("dn"),
								P.timeout.addClass("dn"),
								P.notreceive.removeClass("dn")) : (a += 5,
								i.css("width", a + "%"),
								e.autoCheckResult())
					}, 3e3)
			},
			smsLoginUpBaseData: function() {
				var e = P.selectedZ.attr("data-key"),
					t = r.trimALLToE(P.name.val()),
					a = {
						__NEW: 1,
						agenttype: k,
						area_code: e,
						cellphoneNumber: t,
						device_id: Q.cookie.get("QC005"),
						dfp: "",
						lang: x,
						ptid: _,
						requestType: F ? 26 : 22,
						serviceId: 2
					};
				return a
			},
			autoCheckResult: function() {
				var e = this,
					t = e.smsLoginUpBaseData();
				y.getFingerPrint(function(a) {
					t.dfp = "A00000" == a.code ? a.data : "",
						t.token = X,
						m.upBizStatus(t, function(t) {
							"A00000" == t.code && (e.clearResultTimer(),
								N = t.data.authCode,
								A ? (P.stepTwoContainer.attr("data-block-name", "pcwupsmslgnstpwddlp"),
									e.authcodeLogin()) : F && e.bindPhone())
						})
				})
			},
			clearResultTimer: function() {
				n && clearInterval(n),
					o && clearTimeout(o),
					N = "",
					X = ""
			},
			getBaseData: function(e) {
				var t = P.selectedZ.attr("data-key"),
					a = r.trimALLToE(P.name.val()),
					i = {
						__NEW: 1,
						agenttype: k,
						area_code: t
					};
				if(2 == e) {
					var n = P.smsCodeWrapper.find('[data-mobilemsg="msg"]').val().trim();
					i.authCode = A ? N || n : n
				}
				return i.cellphoneNumber = a,
					i.dfp = "",
					2 == e && (i.envinfo = ""),
					i.lang = x,
					i.ptid = _,
					i.requestType = F ? 26 : 22,
					i.serviceId = 2,
					1 == e && (B ? (i.slide = 1,
						i.slidetoken = B) : T && (i.vcode = T)),
					i
			},
			setCookie: function(e) {
				var t = P.selectedZ.attr("data-key"),
					a = P.selectedZ.html(),
					i = r.trimALLToE(P.name.val());
				if(e) {
					var n = "";
					if(A) {
						var o = Q("[data-smslogin-up-sus]");
						P.smsLoginUp.hasClass("dn") && (o = Q("[data-smslogin-down-sus]")),
							o.html(b.getSusTpl(e.icon, e.nickname)),
							o.removeClass("dn"),
							n = o.attr("data-block-name"),
							"1" === R && (n = "hriskupsms_lgnok")
					} else {
						var s = Q('[data-mobilemsg="loginsus"]');
						s.removeClass("dn"),
							n = s.attr("data-block-name")
					}
					w.send(n)
				}
				u.setLoginCookie(t, a, i, "p1", e, !0)
			},
			showSmsCode: function() {
				P.mobileWrapper.addClass("dn"),
					P.smsCodeWrapper.removeClass("dn");
				var e = P.smsCodeWrapper.attr("data-block-name");
				w.send(e),
					Q('[data-mobilemsg="msgErr"]').addClass("vh");
				var t = P.smsCodeWrapper.find('[data-mobilemsg="country"]');
				t.html(P.selectedZ.html()),
					t.attr("data-key", P.selectedZ.attr("data-key")),
					P.smsCodeWrapper.find('[data-mobilemsg="phonenum"]').html(P.name.val()),
					P.smsCodeWrapper.find('[data-mobilemsg="msg"]').val(""),
					P.smsCodeWrapper.find('[data-mobilemsg="msgTip"]').removeClass("accountIn"),
					this._EcountDown()
			},
			showPiccode: function(e, t) {
				var a = P.stepOneContainer.find('[data-piccode="wrapper"]'),
					i = this.getPiccodeBkName(),
					n = a.attr(i);
				e && S ? S.showPiccodeErr(t) : S ? S.reloadPiccode() : (S = new l({
							container: P.stepOneContainer.find("[data-piccode='container']"),
							wrapper: a,
							fireName: "mbRegCheckPiccode"
						}),
						S.init()),
					w.send(n)
			},
			showSlidePiccode: function() {
				var e = this,
					t = Q('[data-slidepiccode="container"]');
				if(K)
					K.render(),
					e.dealSpiccode();
				else {
					var i = !1,
						n = null;
					d.requireSlide(function() {
						function o() {
							clearTimeout(n),
								n = setTimeout(function() {
									i || (clearTimeout(n),
										window.console && window.console.warn && window.console.warn("滑动验证码加载失败"),
										e.showErrPanel(M))
								}, 3e3)
						}
						o(),
							window._vcs.run("slide", {
								id: "regSlidePiccode",
								width: 360,
								height: 214,
								type: !1,
								agenttype: k,
								ptid: _,
								language: "zh_TW" == a ? "t_cn" : "s_cn",
								callback: function(a) {
									"A00000" == a.code && (B = a.token,
										e._sendSmsCode(),
										t.addClass("dn"))
								},
								DomLoadCallback: function() {
									i = !0,
										clearTimeout(n),
										e.dealSpiccode()
								}
							}, function(e) {
								K = e
							})
					})
				}
			},
			dealSpiccode: function() {
				var e = this,
					t = Q('[data-slidepiccode="container"]'),
					a = e.getPiccodeBkName(),
					i = t.attr(a);
				t.find(".refresh").attr("rseat", "vp_refresh"),
					t.find(".help").attr("rseat", "psprt_sliphelp"),
					t.removeClass("dn"),
					w.send(i)
			},
			getPiccodeBkName: function() {
				return P.mobileWrapper.hasClass("dn") ? (P.smsCodeWrapper.addClass("dn"),
					"data-block-name-rs") : (P.mobileWrapper.addClass("dn"),
					"data-block-name-sd")
			},
			showSmsLoginUp: function(e) {
				var t = this;
				t.clearResultTimer(),
					P.mobileWrapper.addClass("dn"),
					P.smsCodeWrapper.addClass("dn"),
					e || (P.smsLoginUp.find('[data-smslogin-up="country"]').html(P.selectedZ.html()).attr("data-key", P.selectedZ.attr("data-key")),
						P.smsLoginUp.find('[data-smslogin-up="phonenum"]').html(P.name.val()));
				var a = t.smsLoginUpBaseData();
				y.getFingerPrint(function(e) {
					a.dfp = "A00000" == e.code ? e.data : "",
						m.upBizInfo(a, function(e) {
							if("A00000" == e.code && e.data) {
								P.smsLoginUp.find('[data-smslogin-up="serviceNum"]').html(e.data.serviceNum),
									P.smsLoginUp.find('[data-smslogin-up="content"]').html(e.data.content),
									X = e.data.upToken,
									P.smsLoginUp.find("[data-show-progress]").addClass("dn"),
									P.smsLoginUp.find('[data-smslogin-up="sendBtn"]').removeClass("dn"),
									P.smsLoginUp.removeClass("dn"),
									t.smsLoginTimeOut();
								var a = P.smsLoginUp.attr("data-block-name");
								w.send(a)
							} else
								t.showErrPanel(e.msg || M)
						})
				})
			},
			checkAccount: function() {
				var e = this,
					t = P.selectedZ.attr("data-key"),
					a = r.trimALLToE(P.name.val()),
					i = {
						__NEW: 1,
						account: a,
						agenttype: k,
						area_code: t,
						dfp: "",
						lang: x,
						ptid: _
					};
				y.getFingerPrint(function(t) {
					i.dfp = "A00000" == t.code ? t.data : "",
						m.checkAccount(i, function(t) {
							"A00000" == t.code ? t.data ? e._sendSmsCode() : (P.mobileWrapper.find("[data-smslogin-goreg]").removeClass("dn"),
								P.mobileWrapper.find('[data-regbox="stepOneBtn"]').addClass(L)) : "P00404" == t.code || "P00105" == t.code ? e._sendSmsCode() : e.showErrPanel(t.msg || M)
						})
				})
			},
			showSetPwd: function(e) {
				this.setCookie(),
					clearInterval(C),
					Q("[data-newreg-usericon]").val(e.icon),
					Q("[data-newreg-usernick]").val(e.nickname),
					Q("[data-newreg-pwdtoken]").val(e.token),
					P.stepOneContainer.addClass("dn"),
					P.stepTwoContainer.removeClass("dn");
				var t = P.stepTwoContainer.attr("data-block-name");
				w.send(t),
					I && h.fire({
						type: "saveLoginSusData",
						data: {
							data: e,
							isReg: !0
						}
					})
			},
			showErrMsg: function(e) {
				Q('[data-regbox="nameTip"]').hide();
				var t = "<span>" + e + "</span>";
				Q('[data-regbox="nameErr"]').html(t).removeClass("vh"),
					P.mobileWrapper.removeClass("dn")
			},
			showErrPanel: function(e) {
				P.mobileWrapper.addClass("dn"),
					P.smsCodeWrapper.addClass("dn"),
					P.smsLoginUp && P.smsLoginUp.addClass("dn");
				var t = P.stepOneContainer.find('[data-err="wrapper"]');
				h.fire({
					type: "showErrReg",
					data: {
						wrapper: t,
						msg: e
					}
				})
			},
			bindPhone: function() {
				var e = this,
					t = P.smsCodeWrapper.find('[data-mobilemsg="msg"]').val(),
					a = r.trimALLToE(P.name.val()),
					i = N || t,
					n = {
						agenttype: k,
						authCode: i,
						cellphoneNumber: a,
						lang: x,
						ptid: _,
						requestType: 26,
						serviceId: 2
					};
				m.validate(n, function(t) {
					if("A00000" == t.code) {
						clearInterval(C);
						var n = P.selectedZ.attr("data-key");
						P.stepOneContainer.addClass("dn"),
							P.stepTwoContainer.removeClass("dn");
						var o = {
							data: t.data.verifyPhoneResult,
							authCode: i,
							phonenum: a,
							areaCode: n
						};
						h.fire({
							type: "judgeBndType",
							data: o
						})
					} else
						"P00159" == t.code || "A00006" == t.code ? e.showErrPanel(t.msg || M) : Q('[data-mobilemsg="msgErr"]').html(t.msg).removeClass("vh")
				})
			},
			showErrPingback: function(e) {
				e ? w.send("psprt_formerr") : w.send("psprt_nonull")
			}
		}),
		t.add(W)
});
define("qipaLogin/interfaces/mobileInterface.js", ["./postInterface", "../../config/siteDomain", "./md5"], function(e, t, a) {
	var i = e("./postInterface"),
		n = e("../../config/siteDomain"),
		o = e("./md5"),
		r = n.getDomain(),
		s = i.protocol;
	a.exports = Q.Class("RIMobileInter", {
		construct: function() {
			this._remoteInterface = new i({
				secureSendCode: {
					url: s + "//passport." + r + "/apis/phone/secure_send_cellphone_authcode.action"
				},
				authcodeLogin: {
					url: s + "//passport." + r + "/apis/reglogin/authcode_login.action"
				},
				upBizInfo: {
					url: s + "//passport." + r + "/apis/phone/up_biz_info.action"
				},
				upBizStatus: {
					url: s + "//passport." + r + "/apis/phone/up_biz_status.action"
				},
				validate: {
					url: s + "//passport." + r + "/apis/phone/verify_cellphone_authcode.action"
				},
				checkAccount: {
					url: s + "//passport." + r + "/apis/user/check_account.action"
				}
			})
		},
		methods: {
			secureSendCode: function(e, t) {
				this.cmd5x(e, "secureSendCode", t, !0)
			},
			upBizInfo: function(e, t) {
				this.cmd5x(e, "upBizInfo", t, !0)
			},
			upBizStatus: function(e, t) {
				this.cmd5x(e, "upBizStatus", t, !0)
			},
			authcodeLogin: function(e, t) {
				this.cmd5x(e, "authcodeLogin", t, !1)
			},
			validate: function(e, t) {
				e = e || {},
					this._remoteInterface.send({
						ifname: "validate",
						param: e
					}, function(e) {
						t && t(e)
					})
			},
			checkAccount: function(e, t) {
				this.cmd5x(e, "checkAccount", t, !1)
			},
			cmd5x: function(e, t, a, i) {
				e = o.md5(e, i),
					this._remoteInterface.send({
						ifname: t,
						param: e,
						needMd5: !0
					}, function(e) {
						a && a(e)
					})
			}
		}
	})
});
define("qipaLogin/interfaces/md5.js", ["../../kit/rsa"], function(e, t, i) {
	var n = e("../../kit/rsa");
	i.exports = {
		md5: function(e, t) {
			return e && t && (e.cellphoneNumber = n.rsaFun(e.cellphoneNumber)),
				Q.support.cors && (e.qd_sc = Q.crypto.md5(decodeURIComponent(Q.url.jsonToQuery(e)) + "tS7BdPLU2w0JD89dh")),
				e
		}
	}
});
define("qipaLogin/kit/smsLoginSusTpl.js", ["./getI18nLang"], function(e, t, a) {
	new Q.ic.InfoCenter({
		moduleName: "smsLoginSusTpl"
	});
	var i = e("./getI18nLang").get(),
		n = '<div class="login-frame-ti"><h2 class="login-title-ab"><i class="correct-green"></i>{{lang}}</h2><div class="register-sus-container"> <div class="register-name-con"><img src="{{icon}}" class="register-name"></div><p class="register-name-ed"><span>{{nick}}</span></p></div></div>';
	a.exports = {
		getSusTpl: function(e, t) {
			var a = n;
			return a = "zh_TW" == i ? a.replace("{{lang}}", "登入成功") : a.replace("{{lang}}", "登录成功"),
				a = a.replace("{{icon}}", e),
				a = a.replace("{{nick}}", t)
		}
	}
});
define("qipaLogin/units/setPwd.js", ["../../components/units/pageJob", "../../kit/validate", "../config/pwdMsg", "../kit/getI18nLang", "../kit/pwdEye", "../interfaces/setPwdInterface", "../../kit/printFinger", "../kit/redirect", "../kit/bindPhone", "../kit/setCookie", "../kit/blockPingback", "../kit/getPassedParams"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = Q.event.customEvent,
		i = e("../../kit/validate"),
		n = e("../config/pwdMsg"),
		o = e("../kit/getI18nLang").get(),
		r = e("../kit/pwdEye"),
		s = e("../interfaces/setPwdInterface"),
		l = new s,
		d = e("../../kit/printFinger"),
		c = e("../kit/redirect");
	e("../kit/bindPhone"),
		e("../kit/setCookie");
	var u = e("../kit/blockPingback"),
		p = e("../kit/getPassedParams"),
		m = p.getAgenttype(),
		h = p.getPtid(),
		f = o ? o : "",
		g = "",
		v = "btn-gray",
		y = "setPwd",
		b = {},
		w = "请稍后重试";
	t.create(y, {
			getDependentDoms: function() {
				return b = {
					container: Q('[data-step="two"]'),
					wrapper: Q('[data-setpwd="wrapper"]'),
					pwd: Q('[data-setpwd="pwd"]'),
					pwdTip: Q('[data-setpwd="pwdTip"]'),
					pwdErr: Q('[data-setpwd="pwdErr"]'),
					pwdInfoContainer: Q('[data-setpwd="infoContainer"]'),
					repwd: Q('[data-setpwd="repwd"]'),
					repwdTip: Q('[data-setpwd="repwdTip"]'),
					repwdErr: Q('[data-setpwd="repwdErr"]'),
					repwdInfoContainer: Q('[data-setpwd="reInfoContainer"]'),
					btn: Q('[data-setpwd="btn"]')
				}, !0
			},
			check: function() {
				return !0
			},
			init: function() {
				if(b.container[0]) {
					if(!b.container.hasClass("dn")) {
						var e = b.container.attr("data-block-name");
						u.send(e)
					}
					"zh_TW" == o ? (g = n.twMsg,
							w = "請稍後嘗試") : g = n.msg,
						b.pwd.val(""),
						b.repwd.val(""),
						this.bindEvent()
				}
			},
			bindEvent: function() {
				var e = this;
				e._initPwdEye(),
					e.bindPwdEvent(),
					e.bindRepwdEvent(),
					b.btn.on("click", function() {
						var t = b.pwd.val(),
							a = b.repwd.val();
						Q(this).hasClass(v) ? t && a ? t === a ? u.send("setpwd_diff") : u.send("psprt_formerr") : u.send("psprt_nonull") : t == a ? e.setPwd() : (Q(this).addClass(v),
							b.repwdTip.addClass("dn"),
							b.repwdErr.removeClass("vh"),
							u.send("setpwd_diff"))
					})
			},
			bindPwdEvent: function() {
				this.bindPwdEventCommon(b.pwdTip, b.pwd, b.pwdInfoContainer, b.pwdErr, this.pwdValidate, g.inputTip, g.pwdTip, g.pwdErr),
					b.pwd.on("keydown", function(e) {
						"9" == e.keyCode && (e.preventDefault(),
							b.repwdTip.addClass("accountIn"),
							b.repwd.focus())
					})
			},
			bindRepwdEvent: function() {
				this.bindPwdEventCommon(b.repwdTip, b.repwd, b.repwdInfoContainer, b.repwdErr, this.repwdValidate)
			},
			bindPwdEventCommon: function(e, t, a, i, n, o, r, s) {
				var l = this;
				e.on("click", function() {
						t.focus()
					}),
					t.on("focus", function() {
						a.addClass("accountIn"),
							l.updateDomHtml(e, o),
							e.removeClass("tip-info-active")
					}),
					t.on("blur", function() {
						a.removeClass("accountIn"),
							t.val() ? n() ? (i.addClass("vh"),
								l.updateDomHtml(e, o),
								e.addClass("tip-info-active").removeClass("dn"),
								l.setBtnEnable()) : (l.updateDomHtml(i.find("span"), s),
								i.removeClass("vh"),
								e.addClass("dn").removeClass("tip-info-active"),
								l.setBtnDisable()) : (i.addClass("vh"),
								l.updateDomHtml(e, r),
								e.removeClass("dn tip-info-active"),
								l.setBtnDisable())
					}),
					t.on("keyup", function() {
						t.val() && n() ? (i.addClass("vh"),
							l.updateDomHtml(e, o),
							e.addClass("tip-info-active").removeClass("dn"),
							l.setBtnEnable()) : l.setBtnDisable()
					})
			},
			updateDomHtml: function(e, t) {
				t && e.html(t)
			},
			pwdValidate: function() {
				var e = b.pwd.val();
				return e && i.pwd(e)
			},
			repwdValidate: function() {
				var e = b.pwd.val(),
					t = b.repwd.val();
				return e && e === t
			},
			_initPwdEye: function() {
				var e = new r({
					wrapper: Q('[data-pwdeye="btn"]'),
					pwdArea: Q('[data-setpwd-pwd="input"]')
				});
				e.init()
			},
			setBtnEnable: function() {
				var e = b.pwd.val(),
					t = b.repwd.val();
				return e && i.pwd(e) && e === t ? (b.btn.removeClass(v), !0) : (b.btn.addClass(v), !1)
			},
			setBtnDisable: function() {
				b.btn.addClass(v)
			},
			getData: function() {
				var e = {
					__NEW: 1,
					agenttype: m,
					dfp: "",
					envinfo: ""
				};
				if(Q("[data-is-bindphone]")[0]) {
					var t = Q.url.getQueryValue(location.href, "from_agenttype"),
						a = Q.url.getQueryValue(location.href, "from_device_id"),
						i = Q.url.getQueryValue(location.href, "from_device_name"),
						n = Q.url.getQueryValue(location.href, "from_ptid");
					t && (e.from_agenttype = t),
						a && (e.from_device_id = a),
						i && (e.from_device_name = i),
						n && (e.from_ptid = n)
				}
				e.lang = f,
					e.password = b.pwd.val(),
					e.ptid = h;
				var o = Q("[data-newreg-pwdtoken]").val();
				return o && (e.token = o),
					e
			},
			setPwd: function() {
				var e = this,
					t = e.getData();
				d.getEnvAndDfp(function(a) {
					"A00000" == a.code ? (t.dfp = a.data.dfp,
							t.envinfo = a.data.env) : (t.dfp = "",
							t.envinfo = ""),
						l.setPwd(t, function(t) {
							var a = "";
							if("A00000" == t.code) {
								Q('[data-regbox="usericon"]').attr("src", Q("[data-newreg-usericon]").val()),
									Q('[data-regbox="nick"]').html(Q("[data-newreg-usernick]").val());
								var i = Q("[data-smslogin-down-pwdsus]"),
									n = Q.url.getQueryValue(location.href, "from_url");
								if(i[0])
									i.removeClass("dn"),
									a = i.attr("data-block-name"),
									setTimeout(function() {
										c.href("", {
											url: n,
											checkUrl: !0
										})
									}, 1e3);
								else if(Q("[data-is-bindphone]")[0])
									u.send("setpwd_ok"),
									c.href("", {
										url: n,
										checkUrl: !0
									});
								else {
									u.send("setpwd_ok"),
										b.container.addClass("dn");
									var o = Q('[data-step="three"]');
									o.removeClass("dn"),
										a = o.attr("data-block-name")
								}
								u.send(a)
							} else
								"P00104" == t.code || "P00148" == t.code ? (b.pwdTip.addClass("dn"),
									b.pwdErr.removeClass("vh").find("span").html(t.msg || w),
									"P00148" == t.code && (a = Q('[data-vfypherr="wrapper"]').attr("data-block-name"),
										u.send(a))) : e.showErrPanel(t.msg || w)
						})
				})
			},
			showErrPanel: function(e) {
				b.wrapper.addClass("dn");
				var t = b.container.find('[data-err="wrapper"]');
				a.fire({
					type: "showErrReg",
					data: {
						wrapper: t,
						msg: e
					}
				})
			}
		}),
		t.add(y)
});
define("qipaLogin/config/pwdMsg.js", [], function(e, t, a) {
	a.exports = {
		msg: {
			pwdErr: "8-20位字母、数字或字符,至少包含两种",
			inputTip: "请设置一个密码",
			pwdTip: "8-20位密码，字母/数字/字符至少两种"
		},
		twMsg: {
			pwdErr: "8-20位字母、數字或字符,至少包含兩種",
			inputTip: "請設置一個密碼",
			pwdTip: "8-20位密碼，字母/數字/字符至少兩種"
		}
	}
});
define("qipaLogin/interfaces/setPwdInterface.js", ["./postInterface", "../../config/siteDomain", "../../kit/rsa", "./md5"], function(e, t, a) {
	var i = e("./postInterface"),
		n = i.protocol,
		o = e("../../config/siteDomain"),
		r = o.getDomain(),
		s = e("../../kit/rsa"),
		l = e("./md5");
	a.exports = Q.Class("setPwdInterface", {
		construct: function() {
			this._remoteInterface = new i({
				setPwd: {
					url: n + "//passport." + r + "/pages/secure/password/set_pwd.action"
				}
			})
		},
		methods: {
			setPwd: function(e, t) {
				e.password = s.rsaFun(e.password),
					e = l.md5(e),
					this._remoteInterface.send({
						ifname: "setPwd",
						param: e,
						needMd5: !0
					}, function(e) {
						t && t(e)
					})
			}
		}
	})
});
define("qipaLogin/units/setUserInfo.js", ["../../components/units/pageJob", "../kit/jeDate", "../interfaces/setRegInfoInterface", "../../kit/userInfo", "../config/setUserInfoMsg", "../kit/getI18nLang", "../kit/blockPingback", "../kit/getPassedParams"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = e("../kit/jeDate"),
		i = e("../interfaces/setRegInfoInterface"),
		n = e("../../kit/userInfo"),
		o = e("../config/setUserInfoMsg").get(),
		r = Q.event.customEvent,
		s = e("../kit/getI18nLang").get(),
		l = e("../kit/blockPingback"),
		d = e("../kit/getPassedParams"),
		c = d.getAgenttype(),
		u = d.getPtid(),
		p = s ? s : "",
		m = "setUserInfo",
		h = {},
		f = "请稍后重试";
	t.create(m, {
			getDependentDoms: function() {
				return h.uploadForm = Q("[data-avatarform-elem=uploadForm]"),
					h.uploader = Q("[data-avatarform-elem=uploader]"),
					h.uploadBtn = Q("[data-avatarform-elem=uploadBtn]"), !0
			},
			check: function() {
				return !0
			},
			init: function() {
				var e = this;
				if(h.uploader[0]) {
					var t = Q('[data-step="three"]');
					t.hasClass("dn") || l.send(t.attr("data-block-name")),
						"zh_TW" == s && (f = "請稍後嘗試"),
						e.bindEvent()
				}
			},
			bindEvent: function() {
				var e = this;
				e.dealDate(),
					e.dealIcon(),
					e.initUploader(),
					e.dealTitle(),
					e.dealGender(),
					e.dealSelfInfo(),
					e.dealUserName(),
					e.dealSubmit()
			},
			dealDate: function() {
				var e = this;
				Q('[data-regele="jeDateBtn"]').on("click", function(t) {
					t.preventDefault();
					var i = Q("#jedatebox");
					"none" == i.css("display") ? a({
						dateCell: "#dateinfo",
						isTime: !1,
						format: "YYYY-MM-DD",
						minDate: "1920-01-01 00:00:00",
						maxDate: "2037-12-31 23:59:59",
						isOrien: !1,
						choosefun: function(t) {
							e.setDate(t)
						},
						clearfun: function() {
							e.setDate("")
						},
						okfun: function(t) {
							e.setDate(t)
						}
					}) : i.css("display", "none")
				})
			},
			dealUserName: function() {
				var e = this,
					t = Q('[data-regele="username"]');
				t.val("");
				var a = Q("[data-tip-info]");
				Q('[data-username="area"]').on("click", function() {
						a.addClass("dn"),
							t.focus()
					}),
					t.on("blur", function() {
						var i = t.val();
						i ? e.checkUsername(i) || e.setUserErr("length") : a.removeClass("dn")
					}),
					t.on("input propertychange", function() {
						a.addClass("dn");
						var i = t.val();
						e.checkUsername(i) && (e.repeat != i ? e.setUserErr() : e.repeat && e.setUserErr("tip", e.recTips))
					}),
					Q(document).delegate("[data-tip-suggest]", "click", function(i) {
						i.preventDefault();
						var n = Q(i.target).text();
						t.val(n),
							a.addClass("dn"),
							e.setUserErr()
					})
			},
			checkUsername: function(e) {
				return e = e.replace(/[\u4e00-\u9fa5]/g, "aa"),
					/^[a-zA-Z0-9]{4,30}$/.test(e) || "" === e
			},
			setUserErr: function(e, t) {
				Q("[data-err-uname]").addClass("dn");
				var a = Q('[data-err-ele="username"]');
				if(a.removeClass("dn"),
					"length" == e)
					a.addClass("red-tip").html(o.nameErr1);
				else if("tip" == e && t.length > 0) {
					for(var i = o.nameErr2, n = 0; n < t.length; n++)
						i += '<span class="sub-info sub-info-tip" data-tip-suggest style="cursor: pointer">' + t[n] + "</span>";
					a.addClass("red-tip").html(i)
				} else
					a.removeClass("red-tip").html(o.nameErr3)
			},
			dealIcon: function() {
				var e = this;
				Q('[data-icon-item="select"]').on("click", function(t) {
					t.preventDefault();
					var a = Q(t.target);
					a.siblings('[data-icon-item="select"]').removeClass("selected"),
						a.addClass("selected"),
						e.icon = a.attr("src")
				})
			},
			dealTitle: function() {
				var e = this;
				Q('[data-title-elem="select"]').on("click mousedown mouseup", function(t) {
					var a = t.type;
					if("mousedown" == a)
						Q(this).addClass("selected");
					else if("mouseup" == a)
						Q(this).removeClass("selected");
					else if("click" == a) {
						var i = Q('[data-regele="selfinfo"]'),
							n = Q(this).html(),
							o = i.val();
						if(o) {
							var r = i.val() + " " + n;
							i.val(r),
								r.length > 512 && e.setInfoErr("length")
						} else
							i.val(n)
					}
				})
			},
			dealGender: function() {
				var e = this;
				Q("[data-gender-elem]").on("click", function(t) {
					t.preventDefault();
					var a = Q(this);
					a.find("[data-gender-icon]").removeClass("dn"),
						a.siblings("[data-gender-elem]").find("[data-gender-icon]").addClass("dn"),
						e.gender = a.attr("data-gender-elem")
				})
			},
			dealSelfInfo: function() {
				var e = this,
					t = Q('[data-regele="selfinfo"]');
				t.val(""),
					t.on("input propertychange", function() {
						var t = Q(this).val();
						t.length > 512 ? e.setInfoErr("length") : e.isEmojiCharacter(t) ? e.setInfoErr("emoji") : e.setInfoErr()
					})
			},
			dealSubmit: function() {
				var e = this;
				Q('[data-regele="submit"]').on("click", function(t) {
					if(t.preventDefault(), !n.isLogin())
						return !1;
					var a = Q("[data-err-ele]"),
						o = !0;
					if(a.each(function() {
							Q(this).hasClass("red-tip") && (o = !1)
						}), !o)
						return l.send("psprt_formerr"), !1;
					var r = e.getUpdateInfo();
					(new i).updateInfo(r, function(t) {
						if("A00000" == t.code) {
							Q('[data-step="three"]').addClass("dn");
							var a = Q('[data-step="four"]'),
								i = e.icon || Q("[data-newreg-usericon]").val(),
								n = Q('[data-regele="username"]').val() || Q("[data-newreg-usernick]").val();
							a.find('[data-regbox="usericon"]').attr("src", i),
								a.find('[data-regbox="nick"]').html(n),
								a.removeClass("dn");
							var o = a.attr("data-block-name");
							l.send(o)
						} else if("P00601" == t.code || "P00602" == t.code)
							Q("[data-err-uname]").removeClass("dn").html(t.msg),
							Q('[data-err-ele="username"]').addClass("dn");
						else if("P00600" == t.code)
							e.repeat = r.nickname,
							e.suggestNickname();
						else if("P00909" == t.code) {
							var s = Q('[data-icon-item="tip"]');
							s.text(t.msg).addClass("red-tip")
						} else
							e.showErrPanel(t.msg || f)
					})
				})
			},
			suggestNickname: function() {
				var e = this,
					t = {
						__NEW: 1,
						agenttype: c,
						authcookie: n.getAuthCookies(),
						lang: p,
						nickname: e.repeat,
						ptid: u
					};
				(new i).recNickname(t, function(t) {
					if("A00000" == t.code && t.data)
						e.recTips = t.data,
						e.setUserErr("tip", e.recTips);
					else {
						Q('[data-setuserinfo="wrapper"]').addClass("dn");
						var a = Q('[data-step="three"]').find('[data-err="wrapper"]'),
							i = t.msg || f;
						r.fire({
							type: "showErrReg",
							data: {
								wrapper: a,
								msg: i
							}
						})
					}
				})
			},
			getUpdateInfo: function() {
				var e = {
						__NEW: 1,
						agenttype: c,
						authcookie: n.getAuthCookies(),
						lang: p,
						ptid: u
					},
					t = Q('[data-regele="username"]').val(),
					a = Q('[data-regele="selfinfo"]').val();
				return this.birthday && (e.birthday = this.birthday),
					this.gender && (e.gender = this.gender),
					this.icon && (-1 == this.icon.indexOf("http") && (this.icon = window.location.protocol + this.icon),
						e.icon = this.icon),
					t && (e.nickname = t),
					a && (e.self_intro = a),
					e
			},
			setInfoErr: function(e) {
				var t = Q('[data-err-ele="info"]');
				"length" == e ? t.addClass("red-tip").text(o.infoErr1) : "emoji" == e ? t.addClass("red-tip").text(o.infoErr2) : t.removeClass("red-tip").text(o.infoErr3)
			},
			isEmojiCharacter: function(e) {
				for(var t = 0; t < e.length; t++) {
					var a = e.charCodeAt(t);
					if(a >= 55296 && 56319 >= a) {
						if(e.length > 1) {
							var i = e.charCodeAt(t + 1),
								n = 1024 * (a - 55296) + (i - 56320) + 65536;
							if(n >= 118784 && 128895 >= n)
								return !0
						}
					} else if(e.length > 1) {
						var o = e.charCodeAt(t + 1);
						if(8419 == o)
							return !0
					} else {
						if(a >= 8448 && 10239 >= a)
							return !0;
						if(a >= 11013 && 11015 >= a)
							return !0;
						if(a >= 10548 && 10549 >= a)
							return !0;
						if(a >= 12951 && 12953 >= a)
							return !0;
						if(169 == a || 174 == a || 12349 == a || 12336 == a || 11093 == a || 11036 == a || 11035 == a || 11088 == a)
							return !0
					}
				}
			},
			initUploader: function() {
				var e = this,
					t = h.uploader;
				t.on("change", function() {
					e.dealImg(Q(this).val())
				})
			},
			checkFileType: function(e) {
				return /\.(jpg|gif|jpeg|png)$/gi.test(e.toLowerCase())
			},
			resetUploader: function() {
				h.uploadForm[0].reset()
			},
			dealImg: function(e) {
				var t = this,
					a = Q('[data-icon-item="tip"]');
				return a.removeClass("red-tip").text(""),
					t.checkFileType(e) ? ((new i).uploadImg(h.uploadForm, function(e) {
							if(t.resetUploader(),
								e.code && "A00000" === e.code) {
								a.removeClass("red-tip").text("");
								var i = Q.url.ddeleteProtocol(e.data.picurl),
									n = Q('[data-icon-item="select"]');
								i = i.replace("d.pan.iqiyi.com", "pan.iqiyi.com"),
									n.removeClass("selected"),
									n.last().removeClass("dn").addClass("selected").attr("src", i + "?r=" + Math.random()),
									t.icon = i
							} else
								"T00115" === e.code ? a.text(o.imgErr1).addClass("red-tip") : a.text(o.imgErr2).addClass("red-tip")
						}),
						void 0) : (t.resetUploader(),
						a.text(o.imgErr1).addClass("red-tip"),
						void 0)
			},
			setDate: function(e) {
				var t = "----",
					a = "--",
					i = "--",
					n = o.constellation1;
				this.birthday = new Date(0),
					e && (e = e.split("-"),
						t = e[0],
						a = e[1],
						i = e[2],
						n = this.getAstro(a, i),
						this.birthday.setFullYear(t),
						this.birthday.setMonth(a - 1),
						this.birthday.setDate(i)),
					this.birthday = Math.floor(this.birthday / 1e3),
					Q('[data-regele="jeDateYear"]').text(t),
					Q('[data-regele="jeDateMonth"]').text(a),
					Q('[data-regele="jeDateDay"]').text(i),
					Q('[data-regele="Constellation"]').text(n)
			},
			getAstro: function(e, t) {
				var a = o.constellation2,
					i = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
				return a.substr(2 * e - (t < i[e - 1] ? 2 : 0), 2) + o.constellation3
			},
			showErrPanel: function(e) {
				Q('[data-setuserinfo="wrapper"]').addClass("dn");
				var t = Q('[data-step="three"]').find('[data-err="wrapper"]');
				r.fire({
					type: "showErrReg",
					data: {
						wrapper: t,
						msg: e
					}
				})
			}
		}),
		t.add(m)
});
define("qipaLogin/kit/jeDate.js", [], function(e, t, a) {
	var i = {},
		n = document,
		o = "#jedatebox",
		r = Q;
	i.each = function(e, t) {
			for(var a = 0, i = e.length; i > a && t(a, e[a]) !== !1; a++)
			;
		},
		i.extend = function() {
			var e = function n(e, t) {
					for(var a in e)
						if(e.hasOwnProperty(a)) {
							if(e[a] instanceof Object && t[a] instanceof Object && n(e[a], t[a]),
								t.hasOwnProperty(a))
								continue;
							t[a] = e[a]
						}
				},
				t = {},
				a = arguments;
			if(!a.length)
				return {};
			for(var i = a.length - 1; i >= 0; i--)
				e(a[i], t);
			return a[0] = t,
				t
		},
		i.trim = function(e) {
			return e = e || "",
				e.replace(/^\s|\s$/g, "").replace(/\s+/g, " ")
		},
		i.attr = function(e, t, a) {
			return "string" == typeof t && "undefined" == typeof a ? e.getAttribute(t) : (e.setAttribute(t, a),
				this)
		},
		i.stopmp = function(e) {
			return e = e || win.event,
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0,
				this
		},
		i.getCss = function(e, t) {
			return e.currentStyle ? e.currentStyle[t] : window.getComputedStyle ? document.defaultView.getComputedStyle(e)[t] : null
		},
		i.hasClass = function(e, t) {
			return e = e || {},
				new RegExp("\\b" + t + "\\b").test(e.className)
		},
		i.addClass = function(e, t) {
			return e = e || {},
				i.hasClass(e, t) || (e.className += " " + t),
				e.className = i.trim(e.className),
				this
		},
		i.removeClass = function(e, t) {
			return e = e || {},
				i.hasClass(e, t) && (e.className = e.className.replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), "")),
				this
		},
		i.on = function(e, t, a) {
			e.addEventListener ? e.addEventListener(t, a, !1) : e.attachEvent ? e.attachEvent("on" + t, a) : e["on" + t] = a
		},
		i.stopMosup = function(e, t) {
			"mouseup" !== e && i.on(t, "mouseup", function(e) {
				i.stopmp(e)
			})
		},
		i.html = function(e, t) {
			return "undefined" != typeof t || void 0 !== t && 1 === e.nodeType ? (e.innerHTML = t,
				this) : e.innerHTML
		},
		i.text = function(e, t) {
			if(void 0 === t || 1 !== e.nodeType) {
				var a = document.all ? e.innerText : e.textContent;
				return a
			}
			return document.all ? e.innerText = t : e.textContent = t,
				this
		},
		i.val = function(e, t) {
			return void 0 === t || 1 !== e.nodeType ? e.value : (e.value = t,
				this)
		},
		i.scroll = function(e) {
			return e = e ? "scrollLeft" : "scrollTop",
				n.body[e] | n.documentElement[e]
		},
		i.winarea = function(e) {
			return n.documentElement[e ? "clientWidth" : "clientHeight"]
		},
		i.parse = function(e, t, a) {
			e = e.concat(t);
			var a = a;
			return a.replace(/YYYY|MM|DD|hh|mm|ss/g, function() {
				return e.index = 0 | ++e.index,
					i.digit(e[e.index])
			})
		},
		i.nowDate = function(e, t) {
			var a = new Date(0 | e ? function(e) {
				return 864e5 > e ? +new Date + 864e5 * e : e
			}(parseInt(e)) : +new Date);
			return i.parse([a.getFullYear(), a.getMonth() + 1, a.getDate()], [a.getHours(), a.getMinutes(), a.getSeconds()], t)
		},
		i.montharr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		i.isValHtml = function(e) {
			return /textarea|input/.test(e.tagName.toLocaleLowerCase())
		},
		i.weeks = ["日", "一", "二", "三", "四", "五", "六"],
		i.festival = function(e, t) {
			var a = "";
			switch(e) {
				case "01.01":
					a = "元旦";
					break;
				case "02.14":
					a = "情人";
					break;
				case "03.08":
					a = "妇女";
					break;
				case "04.05":
					a = "清明";
					break;
				case "05.01":
					a = "劳动";
					break;
				case "06.01":
					a = "儿童";
					break;
				case "08.01":
					a = "建军";
					break;
				case "09.10":
					a = "教师";
					break;
				case "10.01":
					a = "国庆";
					break;
				case "12.24":
					a = "平安";
					break;
				case "12.25":
					a = "圣诞";
					break;
				default:
					a = t
			}
			return a
		},
		i.digit = function(e) {
			return 10 > e ? "0" + (0 | e) : e
		},
		i.shdeCell = function(e) {
			r(o)[0].style.display = e ? "none" : "block"
		};
	var s = {
			dateCell: "#dateval",
			format: "YYYY-MM-DD hh:mm:ss",
			isinitVal: !1,
			isTime: !1,
			isClear: !0,
			festival: !1,
			zIndex: 999,
			isOrien: !0,
			choosefun: function() {},
			clearfun: function() {},
			okfun: function() {}
		},
		l = function(e) {
			var t = this,
				a = JSON.parse(JSON.stringify(s));
			t.config = i.extend(a, e),
				t.init()
		},
		d = function(e) {
			return new l(e || {})
		};
	l.prototype = {
			init: function() {
				var e, t, a, s = this,
					l = s.config,
					d = r(l.dateCell)[0],
					c = window.event,
					u = n.createElement("div");
				r(o)[0] || (u.className = u.id = o.replace("#", ""),
					u.style.zIndex = l.zIndex,
					n.body.appendChild(u));
				try {
					a = c.target || c.srcElement || {}
				} catch(p) {
					a = {}
				}
				e = l.dateCell ? r(l.dateCell)[0] : a;
				var m = i.nowDate(null, l.format);
				if(l.isinitVal && ("" == (i.val(d) || i.text(d)) ? i.isValHtml(d) ? i.val(d, m) : i.text(d, m) : i.isValHtml(d) ? i.val(d) : i.text(d)),
					c && a.tagName) {
					if(!e || e === i.elem)
						return;
					i.stopMosup(c.type, e),
						i.stopmp(c),
						s.setHtml(l, d)
				} else
					t = l.event || "click",
					i.each((0 | e.length) > 0 ? e : [e], function(e, a) {
						i.stopMosup(t, s),
							i.on(a, t, function(e) {
								i.stopmp(e),
									a !== i.elem && s.setHtml(l, d)
							})
					})
			},
			setHtml: function(e, t) {
				var a = this,
					n = "",
					s = new Date,
					l = i.nowDate(null, e.format),
					d = "YYYY-MM" == e.format.match(/\w+|d+/g).join("-") ? !0 : !1,
					c = e.isinitVal ? i.isValHtml(t) ? i.val(t) : i.text(t) : "" == (i.val(t) || i.text(t)) ? l : i.isValHtml(t) ? i.val(t) : i.text(t);
				if("" != i.val(t) || "" != i.text(t))
					var u = c.match(/\d+/g);
				else
					var u = [s.getFullYear(), s.getMonth() + 1, s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds()];
				var p = d ? '<div class="jedateym" style="width:100%;"><i class="prev triangle ymprev"></i><span class="jedateyy"><em class="jedateyearmonth"></em></span><i class="next triangle ymnext"></i></div>' : '<div class="jedateym" style="width:50%;"><i class="prev triangle yearprev"></i><span class="jedateyy" data-ym="24"><em class="jedateyear"></em><em class="pndrop"></em></span><i class="next triangle yearnext"></i></div><div class="jedateym" style="width:50%;"><i class="prev triangle monthprev"></i><span class="jedatemm" data-ym="12"><em class="jedatemonth"></em><em class="pndrop"></em></span><i class="next triangle monthnext"></i></div>',
					m = '<div class="jedatetop">' + p + "</div>",
					h = d ? '<ul class="jedaym"></ul>' : '<div class="jedatetopym" style="display: none;"><ul class="ymdropul"></ul><p><span class="jedateymchle">&#8592;</span><span class="jedateymchri">&#8594;</span><span class="jedateymchok">关闭</span></p></div>',
					f = '<ol class="jedaol"></ol><ul class="jedaul"></ul>',
					g = d ? '<div class="botflex jedatebtn"><span class="jedateclear" style="width:31%;">清空</span><span class="jedatetodaymonth" style="width:31%;">本月</span><span class="jedateok" style="width:31%;">确认</span></div>' : '<ul class="botflex jedatehms"><li><em data-hms="24"></em><i>:</i></li><li><em data-hms="60"></em><i>:</i></li><li><em data-hms="60"></em></li></ul><div class="botflex jedatebtn"><span class="jedateclear" style="width:84px;">清空</span><span class="jedatetodaymonth" style="width:84px;">今天</span><span class="jedateok" style="width:84px;">确认</span></div>',
					v = '<div class="jedatebot">' + g + "</div>",
					y = d ? m + h + v : m + h + f + v + '<div class="jedateprophms"></div>';
				if(i.html(r(o)[0], y),
					e.isClear ? "" : r(o + " .jedatebot .jedateclear")[0].style.display = "none",
					e.isTime) {
					var b = "" != i.val(t) || "" != i.text(t) ? [u[3], u[4], u[5]] : [s.getHours(), s.getMinutes() + 1, s.getSeconds()];
					i.each(r(o + " .jedatebot .jedatehms em"), function(e, t) {
						i.html(t, i.digit(b[e]))
					})
				} else
					d || (r(o + " .jedatebot .jedatehms")[0].style.display = "none"),
					r(o + " .jedatebot .jedatebtn")[0].style.width = "100%";
				if(d)
					i.html(r(o + " .jedaym")[0], a.onlyYMStr(u[0], u[1])),
					i.text(r(o + " .jedateym .jedateyearmonth")[0], u[0] + "年" + i.digit(u[1]) + "月"),
					a.onlyYMevents(a, e, t, u);
				else {
					for(var w = 0; w < i.weeks.length; w++)
						n += '<li class="weeks" data-week="' + i.weeks[w] + '">' + i.weeks[w] + "</li>";
					i.html(r(o + " .jedaol")[0], n),
						a.getDateStr(u[0], u[1], u[2]),
						a.YearAndMonth(a, e, t, u)
				}
				i.shdeCell(!1),
					e.isOrien && a.orien(r(o)[0], t),
					a.events(a, e, t, u)
			},
			onlyYMStr: function(e, t) {
				var a = "";
				return i.each(i.montharr, function(i, n) {
						var o = jet.parseMatch(jet.minDate),
							r = jet.parseMatch(jet.maxDate),
							s = new Date(e, jet.digit(n), "01"),
							l = new Date(o[0], o[1], o[2]),
							d = new Date(r[0], r[1], r[2]);
						a += l > s || s > d ? "<li class='disabled' data-onym='" + e + "-" + jet.digit(n) + "'>" + e + "年" + jet.digit(n) + "月</li>" : "<li " + (t == n ? 'class="action"' : "") + ' data-onym="' + e + "-" + jet.digit(n) + '">' + e + "年" + jet.digit(n) + "月</li>"
					}),
					a
			},
			onlyYMevents: function(e, t, a, n) {
				var s = r(o + " .jedateym .ymprev")[0],
					l = r(o + " .jedateym .ymnext")[0],
					d = parseInt(n[0]),
					c = parseInt(n[1]);
				i.each([s, l], function(l, u) {
					i.on(u, "click", function(l) {
						i.stopmp(l);
						var p = u == s ? d -= 1 : d += 1;
						i.html(r(o + " .jedaym")[0], e.onlyYMStr(p, c)),
							e.events(e, t, a, n)
					})
				})
			},
			orien: function(e, t, a) {
				var n, o = t.getBoundingClientRect();
				e.style.left = o.left + (a ? 0 : i.scroll(1)) + "px",
					n = o.bottom + e.offsetHeight / 1.5 <= i.winarea() ? o.bottom - 1 : o.top > e.offsetHeight / 1.5 ? o.top - e.offsetHeight + 1 : i.winarea() - e.offsetHeight,
					e.style.top = Math.max(n + (a ? 0 : i.scroll()) + 1, 1) + "px"
			},
			getDateStr: function(e, t, a) {
				function n(e, t) {
					var a = 0 == e % 4 && 0 != e % 100 || 0 == e % 400 ? 29 : 28;
					return [31, a, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t - 1]
				}

				function s(e, t) {
					return parseInt(new Date(e, t - 1, 0).getDate())
				}
				var l = this,
					d = l.config,
					c = "",
					t = i.digit(t);
				i.text(r(o + " .jedateyear")[0], e + "年").attr(r(o + " .jedateyear")[0], "data-year", e),
					i.text(r(o + " .jedatemonth")[0], t + "月").attr(r(o + " .jedatemonth")[0], "data-month", t);
				var u = function(e, t) {
						return d.festival ? i.festival(e, t) : t
					},
					p = function(e) {
						var t = e.split(" ");
						return t[0].split("-")
					},
					m = (n(e, t),
						new Date(e, parseInt(t) - 1, 1).getDay()),
					h = 0 != m ? m : m + 7,
					f = s(e, t),
					g = s(e, parseInt(t) + 1),
					v = 1,
					y = p(d.minDate),
					b = p(d.maxDate),
					w = g,
					V = (new Date(e, t, a),
						new Date(e, t, 1)),
					U = new Date(e, t, g),
					k = new Date(y[0], y[1], y[2]),
					_ = new Date(b[0], b[1], b[2]),
					x = k.getDate();
				if(k > U ? v = parseInt(g) + 1 : k >= V && U >= k && (v = x),
					_) {
					var I = _.getDate();
					V > _ ? w = v : _ >= V && U >= _ && (w = I)
				}
				for(var C = h - 1; C >= 0; C--) {
					var L, P, T, S = i.digit(f - C);
					1 == t ? (L = parseInt(e) - 1,
						P = 13) : (L = e,
						P = t);
					var E = parseInt(L.toString() + i.digit(parseInt(P) - 1).toString() + S.toString()),
						Q = parseInt(y[0].toString() + i.digit(y[1]).toString() + i.digit(y[2]).toString()),
						W = parseInt(b[0].toString() + i.digit(b[1]).toString() + i.digit(b[2]).toString());
					T = E >= Q && W >= E ? "prevdate" : T = "disabled",
						c += "<li class='" + T + "' data-y='" + L + "' data-m='" + (parseInt(P) - 1) + "' data-d='" + S + "'>" + u(parseInt(P) - 1 + "." + S, S) + "</li>"
				}
				for(var D = 1; v > D; D++)
					D = i.digit(D),
					c += '<li class="disabled" data-y="' + e + '" data-m="' + t + '" data-d="' + D + '">' + u(t + "." + D, D) + "</li>";
				for(var A = v; w >= A; A++) {
					var X = "";
					A = i.digit(A),
						a == A && (X = "action"),
						c += '<li class="' + X + '" data-y="' + e + '" data-m="' + t + '" data-d="' + A + '">' + u(t + "." + A, A) + "</li>"
				}
				for(var N = w + 1; g >= N; N++)
					N = i.digit(N),
					c += '<li class="disabled" data-y="' + e + '" data-m="' + t + '" data-d="' + N + '">' + u(t + "." + N, N) + "</li>";
				for(var F = 42 - h - n(e, t), K = 1; F >= K; K++) {
					var B, M, J;
					K = i.digit(K),
						t >= 12 ? (B = parseInt(e) + 1,
							M = 0) : (B = e,
							M = t);
					var O = parseInt(B.toString() + i.digit(parseInt(M) + 1).toString() + i.digit(K).toString()),
						R = parseInt(y[0].toString() + i.digit(y[1]).toString() + i.digit(y[2]).toString()),
						W = parseInt(b[0].toString() + i.digit(b[1]).toString() + i.digit(b[2]).toString());
					J = W >= O && O >= R ? "nextdate" : J = "disabled",
						c += "<li class='" + J + "' data-y='" + B + "' data-m='" + (parseInt(M) + 1) + "' data-d='" + K + "'>" + u(parseInt(M) + 1 + "." + K, K) + "</li>"
				}
				i.html(r(o + " .jedaul")[0], c),
					i.attr(r(o + " .monthprev")[0], "data-y", i.digit(parseInt(t) - 1)),
					i.attr(r(o + " .monthnext")[0], "data-y", i.digit(parseInt(t) + 1))
			},
			events: function(e, t, a, n) {
				var s = r(o + " .yearprev")[0],
					l = r(o + " .yearnext")[0],
					d = r(o + " .monthprev")[0],
					c = r(o + " .monthnext")[0],
					u = new Date,
					p = r(o + " .jedateyear")[0],
					m = r(o + " .jedatemonth")[0],
					h = "YYYY-MM" == t.format.match(/\w+|d+/g).join("-") ? !0 : !1;
				h ? (i.each(r(o + " .jedaym li"), function(e, n) {
							i.on(n, "click", function(e) {
								i.stopmp(e);
								var s = i.attr(n, "data-onym").match(/\w+|d+/g),
									l = i.parse([s[0], s[1], 1], [0, 0, 0], t.format);
								i.isValHtml(a) ? i.val(a, l) : i.text(a, l),
									i.html(r(o)[0], ""),
									i.shdeCell(!0)
							})
						}),
						i.on(r(o + " .jedatebot .jedatetodaymonth")[0], "click", function() {
							var e = [u.getFullYear(), u.getMonth() + 1, u.getDate()],
								n = i.parse([e[0], e[1], 0], [0, 0, 0], t.format);
							i.isValHtml(a) ? i.val(a, n) : i.text(a, n),
								i.html(r(o)[0], ""),
								i.shdeCell(!0),
								("function" === t.choosefun || null != t.choosefun) && t.choosefun(n)
						})) : (i.each([s, l], function(o, r) {
							i.on(r, "click", function(o) {
								i.stopmp(o);
								var l = parseInt(i.attr(p, "data-year")),
									d = parseInt(i.attr(m, "data-month"));
								r == s ? l -= 1 : l += 1;
								var c = u.toLocaleDateString() == l + "/" + d + "/" + u.getDate() ? n[2] : 1;
								e.getDateStr(l, d, c),
									e.clickLiDays(e, t, a)
							})
						}),
						i.each([d, c], function(o, r) {
							i.on(r, "click", function(o) {
								i.stopmp(o);
								var s = parseInt(i.attr(p, "data-year")),
									l = parseInt(i.attr(m, "data-month"));
								r == d ? 1 == l ? (s -= 1,
									l = 12) : l -= 1 : 12 == l ? (s += 1,
									l = 1) : l += 1;
								var c = u.toLocaleDateString() == s + "/" + l + "/" + u.getDate() ? n[2] : 1;
								e.getDateStr(s, l, c),
									e.clickLiDays(e, t, a)
							})
						}),
						i.each(r(o + " .jedatebot .jedatehms em"), function(e, t) {
							i.on(t, "click", function() {
								var a, n = "",
									s = r(o + " .jedateprophms")[0],
									l = i.attr(t, "data-hms"),
									d = ["小时", "分钟", "秒数"],
									c = function() {
										i.removeClass(s, 24 == l ? "jedateh" : "jedatems"),
											i.html(s, "")
									};
								n += '<div class="jedatehmstitle">' + d[e] + '<div class="jedatehmsclose">&times;</div></div>';
								for(var u = 0; l > u; u++)
									u = i.digit(u),
									a = i.text(t) == u ? "action" : "",
									n += '<p class="' + a + '">' + u + "</p>";
								i.removeClass(s, 24 == l ? "jedatems" : "jedateh").addClass(s, 24 == l ? "jedateh" : "jedatems"),
									i.html(s, n),
									i.each(r(o + " .jedateprophms p"), function(e, a) {
										i.on(a, "click", function() {
											i.html(t, i.digit(i.text(a))),
												c()
										})
									}),
									i.each(r(o + " .jedateprophms .jedatehmstitle"), function(e, t) {
										i.on(t, "click", function() {
											c()
										})
									})
							})
						}),
						i.on(r(o + " .jedatebot .jedatetodaymonth")[0], "click", function() {
							var n = [u.getFullYear(), u.getMonth() + 1, u.getDate(), u.getHours(), u.getMinutes(), u.getSeconds()],
								s = i.parse([n[0], n[1], n[2]], [n[3], n[4], n[5]], t.format);
							e.getDateStr(n[0], n[1], n[2]),
								i.isValHtml(a) ? i.val(a, s) : i.text(a, s),
								i.html(r(o)[0], ""),
								i.shdeCell(!0),
								("function" === t.choosefun || null != t.choosefun) && t.choosefun(s)
						})),
					i.on(r(o + " .jedatebot .jedateclear")[0], "click", function() {
						var e = i.isValHtml(a) ? i.val(a) : i.text(a);
						i.isValHtml(a) ? i.val(a, "") : i.text(a, ""),
							i.html(r(o)[0], ""),
							i.shdeCell(!0),
							("function" === t.clearfun || null != t.clearfun) && t.clearfun(e)
					}),
					i.on(r(o + " .jedatebot .jedateok")[0], "click", function(s) {
						i.stopmp(s);
						var l = h ? r(o + " .jedaym li") : r(o + " .jedaul li");
						if(h)
							var d = "" != i.val(a) || "" != i.text(a) ? i.attr(r(o + " .jedaym .action")[0], "data-onym").match(/\w+|d+/g) : "",
								c = "" != i.val(a) || "" != i.text(a) ? i.parse([d[0], d[1], 1], [0, 0, 0], t.format) : "";
						else {
							var u = [],
								f = [parseInt(i.attr(p, "data-year")), parseInt(i.attr(m, "data-month")), n[2]];
							i.each(r(o + " .jedatehms em"), function(e, t) {
								u.push(i.text(t))
							});
							var c = "" != i.val(a) || "" != i.text(a) ? i.parse([f[0], f[1], f[2]], [u[0], u[1], u[2]], t.format) : "";
							e.getDateStr(f[0], f[1], f[2])
						}
						i.each(l, function(e, t) {
								"action" == i.attr(t, "class") && (i.isValHtml(a) ? i.val(a, c) : i.text(a, c))
							}),
							i.html(r(o)[0], ""),
							i.shdeCell(!0),
							"" != c && ("function" === t.okfun || null != t.okfun) && t.okfun(c)
					}),
					i.on(document, "click", function() {
						i.shdeCell(!0),
							i.html(r(o)[0], "")
					}),
					i.on(r(o)[0], "click", function(e) {
						i.stopmp(e)
					}),
					e.clickLiDays(e, t, a)
			},
			YearAndMonth: function(e, t, a, n) {
				function s(e) {
					var a = "";
					return i.each(new Array(15), function(n) {
							var o = c(t.minDate),
								r = c(t.maxDate),
								s = o[0],
								l = r[0],
								d = e - 7 + n,
								u = i.attr(h, "data-year");
							a += s > d || d > l ? "<li class='disabled' data-y='" + d + "'>" + d + "年</li>" : "<li " + (u == d ? 'class="action"' : "") + " data-y='" + d + "'>" + d + "年</li>"
						}),
						a
				}

				function l(e, t) {
					var a = "";
					12 == t ? (i.each(i.montharr, function(e, t) {
								var n = i.attr(f, "data-month"),
									t = i.digit(t);
								a += "<li " + (n == t ? 'class="action"' : "") + ' data-m="' + t + '">' + t + "月</li>"
							}),
							i.each([g, v], function(e, t) {
								t.style.display = "none"
							})) : (a = s(e),
							i.each([g, v], function(e, t) {
								t.style.display = "block"
							})),
						i.removeClass(u, 12 == t ? "jedatesety" : "jedatesetm").addClass(u, 12 == t ? "jedatesetm" : "jedatesety"),
						i.html(r(o + " .jedatetopym .ymdropul")[0], a),
						u.style.display = "block"
				}

				function d(s) {
					i.each(r(o + " .ymdropul li"), function(o, l) {
						i.on(l, "click", function() {
							if(!r(l).hasClass("disabled")) {
								var o = i.attr(l, "data-y"),
									d = i.attr(f, "data-month");
								i.attr(s, "data-year", o),
									i.html(s, o),
									u.style.display = "none",
									e.getDateStr(o, d, n[2]),
									e.clickLiDays(e, t, a)
							}
						})
					})
				}
				var c = function(e) {
						var t = e.split(" ");
						return t[0].split("-")
					},
					u = r(o + " .jedatetopym")[0],
					p = r(o + " .jedateyy")[0],
					m = r(o + " .jedatemm")[0],
					h = r(o + " .jedateyy .jedateyear")[0],
					f = r(o + " .jedatemm .jedatemonth")[0],
					g = r(o + " .jedateymchri")[0],
					v = r(o + " .jedateymchle")[0];
				i.on(p, "click", function() {
						var e = parseInt(i.attr(p, "data-ym")),
							t = parseInt(i.attr(h, "data-year"));
						l(t, e),
							d(h)
					}),
					i.on(m, "click", function() {
						var s = parseInt(i.attr(m, "data-ym")),
							d = parseInt(i.attr(h, "data-year"));
						l(d, s),
							i.each(r(o + " .ymdropul li"), function(o, r) {
								i.on(r, "click", function() {
									var o = i.attr(h, "data-year"),
										s = i.attr(r, "data-m");
									i.attr(f, "data-month", s),
										i.html(f, s),
										u.style.display = "none",
										e.getDateStr(o, s, n[2]),
										e.clickLiDays(e, t, a)
								})
							})
					}),
					i.on(r(o + " .jedateymchok")[0], "click", function(e) {
						i.stopmp(e),
							u.style.display = "none"
					});
				var y = parseInt(i.attr(h, "data-year"));
				i.each([v, g], function(e, t) {
					i.on(t, "click", function(t) {
						i.stopmp(t),
							0 == e ? y -= 15 : y += 15;
						var a = s(y);
						i.html(r(o + " .jedatetopym .ymdropul")[0], a),
							d(h)
					})
				})
			},
			clickLiDays: function(e, t, a) {
				i.each(r(o + " .jedaul li"), function(n, s) {
					i.on(s, "click", function(n) {
						if(!i.hasClass(s, "disabled")) {
							i.stopmp(n);
							var l = [];
							i.each(r(o + " .jedatehms em"), function(e, t) {
								l.push(i.text(t))
							});
							var d = 0 | parseInt(i.attr(s, "data-y")),
								c = 0 | parseInt(i.attr(s, "data-m")),
								u = 0 | parseInt(i.attr(s, "data-d")),
								p = i.parse([d, c, u], [l[0], l[1], l[2]], t.format);
							e.getDateStr(d, c, u),
								i.isValHtml(a) ? i.val(a, p) : i.text(a, p),
								i.html(r(o)[0], ""),
								i.shdeCell(!0),
								("function" === t.choosefun || null != t.choosefun) && t.choosefun(p)
						}
					})
				})
			}
		},
		i.getPath = function() {
			var e = document.scripts,
				t = e[e.length - 1].src;
			return t.substring(0, t.lastIndexOf("/") + 1)
		}(),
		d.now = function(e) {
			var t = new Date;
			t.setDate(t.getDate() + e);
			var a = t.getFullYear(),
				i = t.getMonth() + 1,
				n = t.getDate();
			return a + "-" + i + "-" + n
		},
		a.exports = d
});
define("qipaLogin/interfaces/setRegInfoInterface.js", ["./postInterface", "../../config/siteDomain", "./md5", "../../kit/interceptors"], function(e, t, a) {
	var i = e("./postInterface"),
		n = e("../../config/siteDomain"),
		o = n.getDomain(),
		r = e("./md5"),
		s = i.protocol,
		l = e("../../kit/interceptors");
	a.exports = Q.Class("setRegInfoInter", {
		construct: function() {
			this._remoteInterface = new i({
					updateInfo: {
						url: s + "//passport." + o + "/apis/user/update_info.action"
					},
					recNickname: {
						url: s + "//passport." + o + "/apis/secure/rec_nicknames.action"
					}
				}),
				this._uploadInterface = {
					url: "//paopaoupload.iqiyi.com/passport_headpic_upload",
					iframeId: "uploadIframe",
					iframe: null,
					callback: null,
					getData: function(e) {
						var t = /\{.*\}/,
							a = JSON.parse(t.exec(e.head.innerHTML)[0]);
						return a
					}
				}
		},
		methods: {
			updateInfo: function(e, t) {
				this._remoteInterface.send({
					ifname: "updateInfo",
					param: e
				}, function(e) {
					t && t(e)
				})
			},
			recNickname: function(e, t) {
				e = r.md5(e),
					this._remoteInterface.send({
						ifname: "recNickname",
						param: e,
						needMd5: !0
					}, function(e) {
						t && t(e)
					})
			},
			uploadImg: function(e, t, a) {
				a = a || {};
				var i = this._uploadInterface;
				if(!i.iframe) {
					var n = Q(document.createElement("iframe"));
					Q("body").append(n),
						n[0].outerHTML = '<iframe id="' + i.iframeId + '" name="' + i.iframeId + '" ' + 'allowtransparency="true" frameborder="0" ' + 'src="about:blank" style="display: none;">' + "</iframe>",
						i.iframe = n = Q("#" + i.iframeId),
						window.iconUploadSucc = function(e) {
							l.deepMap(e, [l.removeHttp, l.replaceQiyipic]),
								i.callback && (i.callback(e),
									i.callback = null)
						}
				}
				i.callback = t;
				try {
					e.attr("action", a.url || i.url),
						e.attr("target", i.iframeId),
						e[0].submit()
				} catch(o) {
					t && t({
						msg: "请允许浏览器跨域浏览子框架！"
					})
				}
			}
		}
	})
});
define("qipaLogin/config/setUserInfoMsg.js", ["../kit/getI18nLang"], function(e, t, a) {
	var i = e("../kit/getI18nLang"),
		n = {
			zh: {
				nameErr1: "4-30位 汉字/英文/数字",
				nameErr2: '昵称已经有人用了,<span class="sub-info">试试</span>',
				nameErr3: '请设置昵称<span class="sub-info">（不填将自动分配一个）</span>',
				infoErr1: "长度不能超过512字符",
				infoErr2: "不能有emoji",
				infoErr3: "简单描述自己",
				imgErr1: "仅支持JPG, GIF, PNG, 且文件小于1M",
				imgErr2: "图片上传失败",
				constellation1: "未知星座",
				constellation2: "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯",
				constellation3: "座"
			},
			zh_TW: {
				nameErr1: "4-30位 漢字/英文/數字",
				nameErr2: '昵稱已經有人用了,<span class="sub-info">試試</span>',
				nameErr3: '請設置昵稱<span class="sub-info">（不填將自動分配一個）</span>',
				infoErr1: "長度不能超過512字符",
				infoErr2: "不能有emoji",
				infoErr3: "簡單描述自己",
				imgErr1: "僅支持JPG, GIF, PNG, 且文件小於1M",
				imgErr2: "圖片上傳失敗",
				constellation1: "未知星座",
				constellation2: "魔羯水瓶雙魚白羊金牛雙子巨蟹獅子處女天秤天蠍射手魔羯",
				constellation3: "座"
			}
		};
	a.exports = {
		get: function() {
			var e = i.get();
			return e ? n[e] : n.zh
		}
	}
});
define("qipaLogin/units/loading.js", ["../../components/units/pageJob"], function(e) {
	var t = e("../../components/units/pageJob"),
		a = "loading";
	t.create(a, {
			getDependentDoms: function() {
				return !0
			},
			check: function() {
				return !0
			},
			init: function() {
				var e = Q("[data-init-loading]");
				e[0] && (e.addClass("dn"),
					Q("[data-realcont]").removeClass("dn"))
			}
		}),
		t.add(a)
});
//# buildBy serverV2-UglifyJS2-FullCache at Thu Oct 18 2018 10:44:03 GMT+0800 (CST) take time: 724 ms