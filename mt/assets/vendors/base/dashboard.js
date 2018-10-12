var Dashboard = function () {
	var e = function (t) {},
		t = function () {
			var e = function () {
				if (0 != $("#m_chart_personal_income_quater_1").length) {
					var e = new Chartist.Pie("#m_chart_personal_income_quater_1", {
						series: [{
							value: 37,
							className: "custom",
							meta: {
								color: ("#00c5dc")
							}
						}, {
							value: 42,
							className: "custom",
							meta: {
								color: ("#ffb822")
							}
						}, {
							value: 19,
							className: "custom",
							meta: {
								color: ("#716aca")
							}
						}],
						labels: [1, 2, 3]
					}, {
						donut: !0,
						donutWidth: 17,
						showLabel: !1
					});
					e.on("draw", function (e) {
						if ("slice" === e.type) {
							var t = e.element._node.getTotalLength();
							e.element.attr({
								"stroke-dasharray": t + "px " + t + "px"
							});
							var a = {
								"stroke-dashoffset": {
									id: "anim" + e.index,
									dur: 1e3,
									from: -t + "px",
									to: "0px",
									easing: Chartist.Svg.Easing.easeOutQuint,
									fill: "freeze",
									stroke: e.meta.color
								}
							};
							0 !== e.index && (a["stroke-dashoffset"].begin = "anim" + (e.index - 1) + ".end"), e.element.attr({
								"stroke-dashoffset": -t + "px",
								stroke: e.meta.color
							}), e.element.animate(a, !1)
						}
					}), e.on("created", function () {
						window.__anim21278907124 && (clearTimeout(window.__anim21278907124), window.__anim21278907124 = null), window.__anim21278907124 = setTimeout(e.update.bind(e), 15e3)
					})
				}
			};
			e(), $(document).find('a[data-toggle="pill"]').on("shown.bs.tab", function (t) {
				switch ($(t.target).attr("href")) {
					case "#m_personal_income_quater_1":
						e();
						break;
					case "#m_personal_income_quater_2":
						! function () {
							if (0 != $("#m_chart_personal_income_quater_2").length) {
								var e = new Chartist.Pie("#m_chart_personal_income_quater_2", {
									series: [{
										value: 57,
										className: "custom",
										meta: {
											color: ("#9816f4")
										}
									}, {
										value: 20,
										className: "custom",
										meta: {
											color: ("#34bfa3")
										}
									}, {
										value: 19,
										className: "custom",
										meta: {
											color: ("#f4516c")
										}
									}],
									labels: [1, 2, 3]
								}, {
									donut: !0,
									donutWidth: 17,
									showLabel: !1
								});
								e.on("draw", function (e) {
									if ("slice" === e.type) {
										var t = e.element._node.getTotalLength();
										e.element.attr({
											"stroke-dasharray": t + "px " + t + "px"
										});
										var a = {
											"stroke-dashoffset": {
												id: "anim" + e.index,
												dur: 1e3,
												from: -t + "px",
												to: "0px",
												easing: Chartist.Svg.Easing.easeOutQuint,
												fill: "freeze",
												stroke: e.meta.color
											}
										};
										0 !== e.index && (a["stroke-dashoffset"].begin = "anim" + (e.index - 1) + ".end"), e.element.attr({
											"stroke-dashoffset": -t + "px",
											stroke: e.meta.color
										}), e.element.animate(a, !1)
									}
								}), e.on("created", function () {
									window.__anim212789071241111 && (clearTimeout(window.__anim212789071241111), window.__anim212789071241111 = null), window.__anim212789071241111 = setTimeout(e.update.bind(e), 15e3)
								})
							}
						}();
						break;
					case "#m_personal_income_quater_3":
						! function () {
							if (0 != $("#m_chart_personal_income_quater_3").length) {
								var e = new Chartist.Pie("#m_chart_personal_income_quater_3", {
									series: [{
										value: 47,
										className: "custom",
										meta: {
											color: ("#36a3f7")
										}
									}, {
										value: 55,
										className: "custom",
										meta: {
											color: ("#f4516c")
										}
									}, {
										value: 27,
										className: "custom",
										meta: {
											color: ("#716aca")
										}
									}],
									labels: [1, 2, 3]
								}, {
									donut: !0,
									donutWidth: 17,
									showLabel: !1
								});
								e.on("draw", function (e) {
									if ("slice" === e.type) {
										var t = e.element._node.getTotalLength();
										e.element.attr({
											"stroke-dasharray": t + "px " + t + "px"
										});
										var a = {
											"stroke-dashoffset": {
												id: "anim" + e.index,
												dur: 1e3,
												from: -t + "px",
												to: "0px",
												easing: Chartist.Svg.Easing.easeOutQuint,
												fill: "freeze",
												stroke: e.meta.color
											}
										};
										0 !== e.index && (a["stroke-dashoffset"].begin = "anim" + (e.index - 1) + ".end"), e.element.attr({
											"stroke-dashoffset": -t + "px",
											stroke: e.meta.color
										}), e.element.animate(a, !1)
									}
								}), e.on("created", function () {
									window.__anim212789071241111 && (clearTimeout(window.__anim212789071241111), window.__anim212789071241111 = null), window.__anim212789071241111 = setTimeout(e.update.bind(e), 15e3)
								})
							}
						}();
						break;
					case "#m_personal_income_quater_4":
						! function () {
							if (0 != $("#m_chart_personal_income_quater_4").length) {
								var e = new Chartist.Pie("#m_chart_personal_income_quater_4", {
									series: [{
										value: 37,
										className: "custom",
										meta: {
											color: ("#ffb822")
										}
									}, {
										value: 65,
										className: "custom",
										meta: {
											color: ("#5867dd")
										}
									}, {
										value: 33,
										className: "custom",
										meta: {
											color: ("#f4516c")
										}
									}],
									labels: [1, 2, 3]
								}, {
									donut: !0,
									donutWidth: 17,
									showLabel: !1
								});
								e.on("draw", function (e) {
									if ("slice" === e.type) {
										var t = e.element._node.getTotalLength();
										e.element.attr({
											"stroke-dasharray": t + "px " + t + "px"
										});
										var a = {
											"stroke-dashoffset": {
												id: "anim" + e.index,
												dur: 1e3,
												from: -t + "px",
												to: "0px",
												easing: Chartist.Svg.Easing.easeOutQuint,
												fill: "freeze",
												stroke: e.meta.color
											}
										};
										0 !== e.index && (a["stroke-dashoffset"].begin = "anim" + (e.index - 1) + ".end"), e.element.attr({
											"stroke-dashoffset": -t + "px",
											stroke: e.meta.color
										}), e.element.animate(a, !1)
									}
								}), e.on("created", function () {
									window.__anim212789071241111 && (clearTimeout(window.__anim212789071241111), window.__anim212789071241111 = null), window.__anim212789071241111 = setTimeout(e.update.bind(e), 15e3)
								})
							}
						}()
				}
			})
		};
	return {
		init: function () {
			var a;
			! function () {}(),
			function () {
				if (0 != $("#m_chart_activities").length) {
					var e = document.getElementById("m_chart_activities").getContext("2d"),
						t = e.createLinearGradient(0, 0, 0, 240);
					t.addColorStop(0, Chart.helpers.color("#e14c86").alpha(1).rgbString()), t.addColorStop(1, Chart.helpers.color("#e14c86").alpha(.3).rgbString());
					var a = {
						type: "line",
						data: {
							labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
							datasets: [{
								label: "Sales Stats",
								backgroundColor: t,
								borderColor: "#e13a58",
								pointBackgroundColor: Chart.helpers.color("#000000").alpha(0).rgbString(),
								pointBorderColor: Chart.helpers.color("#000000").alpha(0).rgbString(),
								pointHoverBackgroundColor: ("#ffffff"),
								pointHoverBorderColor: Chart.helpers.color("#ffffff").alpha(.1).rgbString(),
								data: [10, 14, 12, 16, 9, 11, 13, 9, 13, 15]
							}]
						},
						options: {
							title: {
								display: !1
							},
							tooltips: {
								mode: "nearest",
								intersect: !1,
								position: "nearest",
								xPadding: 10,
								yPadding: 10,
								caretPadding: 10
							},
							legend: {
								display: !1
							},
							responsive: !0,
							maintainAspectRatio: !1,
							scales: {
								xAxes: [{
									display: !1,
									gridLines: !1,
									scaleLabel: {
										display: !0,
										labelString: "Month"
									}
								}],
								yAxes: [{
									display: !1,
									gridLines: !1,
									scaleLabel: {
										display: !0,
										labelString: "Value"
									},
									ticks: {
										beginAtZero: !0
									}
								}]
							},
							elements: {
								line: {
									tension: 1e-7
								},
								point: {
									radius: 4,
									borderWidth: 12
								}
							},
							layout: {
								padding: {
									left: 0,
									right: 0,
									top: 10,
									bottom: 0
								}
							}
						}
					};
					new Chart(e, a)
				}
			}(),
			t(),
				$(document)
		}
	}
}();
jQuery(document).ready(function () {
	Dashboard.init()
});