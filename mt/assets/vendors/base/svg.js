//svg
 !(function(t, e) {
    "function" == typeof define && define.amd
      ? define("Chartist", [], function() {
          return (t.Chartist = e());
        })
      : "object" == typeof module && module.exports
        ? (module.exports = e())
        : (t.Chartist = e());
  })(this, function() {
    var t = { version: "0.11.0" };
    return (
      (function(t, e, i) {
        "use strict";
        (i.namespaces = {
          svg: "http://www.w3.org/2000/svg",
          xmlns: "http://www.w3.org/2000/xmlns/",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          ct: "http://gionkunz.github.com/chartist-js/ct"
        }),
          (i.noop = function(t) {
            return t;
          }),
          (i.alphaNumerate = function(t) {
            return String.fromCharCode(97 + (t % 26));
          }),
          (i.extend = function(t) {
            var e, n, r;
            for (t = t || {}, e = 1; e < arguments.length; e++)
              for (var o in (n = arguments[e]))
                "object" != typeof (r = n[o]) ||
                null === r ||
                r instanceof Array
                  ? (t[o] = r)
                  : (t[o] = i.extend(t[o], r));
            return t;
          }),
          (i.replaceAll = function(t, e, i) {
            return t.replace(new RegExp(e, "g"), i);
          }),
          (i.ensureUnit = function(t, e) {
            return "number" == typeof t && (t += e), t;
          }),
          (i.quantity = function(t) {
            if ("string" == typeof t) {
              var e = /^(\d+)\s*(.*)$/g.exec(t);
              return { value: +e[1], unit: e[2] || void 0 };
            }
            return { value: t };
          }),
          (i.querySelector = function(t) {
            return t instanceof Node ? t : e.querySelector(t);
          }),
          (i.times = function(t) {
            return Array.apply(null, new Array(t));
          }),
          (i.sum = function(t, e) {
            return t + (e || 0);
          }),
          (i.mapMultiply = function(t) {
            return function(e) {
              return e * t;
            };
          }),
          (i.mapAdd = function(t) {
            return function(e) {
              return e + t;
            };
          }),
          (i.serialMap = function(t, e) {
            var n = [],
              r = Math.max.apply(
                null,
                t.map(function(t) {
                  return t.length;
                })
              );
            return (
              i.times(r).forEach(function(i, r) {
                var o = t.map(function(t) {
                  return t[r];
                });
                n[r] = e.apply(null, o);
              }),
              n
            );
          }),
          (i.roundWithPrecision = function(t, e) {
            var n = Math.pow(10, e || i.precision);
            return Math.round(t * n) / n;
          }),
          (i.precision = 8),
          (i.escapingMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          }),
          (i.serialize = function(t) {
            return null == t
              ? t
              : ("number" == typeof t
                  ? (t = "" + t)
                  : "object" == typeof t && (t = JSON.stringify({ data: t })),
                Object.keys(i.escapingMap).reduce(function(t, e) {
                  return i.replaceAll(t, e, i.escapingMap[e]);
                }, t));
          }),
          (i.deserialize = function(t) {
            if ("string" != typeof t) return t;
            t = Object.keys(i.escapingMap).reduce(function(t, e) {
              return i.replaceAll(t, i.escapingMap[e], e);
            }, t);
            try {
              t = void 0 !== (t = JSON.parse(t)).data ? t.data : t;
            } catch (t) {}
            return t;
          }),
          (i.createSvg = function(t, e, n, r) {
            var o;
            return (
              (e = e || "100%"),
              (n = n || "100%"),
              Array.prototype.slice
                .call(t.querySelectorAll("svg"))
                .filter(function(t) {
                  return t.getAttributeNS(i.namespaces.xmlns, "ct");
                })
                .forEach(function(e) {
                  t.removeChild(e);
                }),
              ((o = new i.Svg("svg")
                .attr({ width: e, height: n })
                .addClass(r))._node.style.width = e),
              (o._node.style.height = n),
              t.appendChild(o._node),
              o
            );
          }),
          (i.normalizeData = function(t, e, n) {
            var r,
              o = { raw: t, normalized: {} };
            return (
              (o.normalized.series = i.getDataArray(
                { series: t.series || [] },
                e,
                n
              )),
              (r = o.normalized.series.every(function(t) {
                return t instanceof Array;
              })
                ? Math.max.apply(
                    null,
                    o.normalized.series.map(function(t) {
                      return t.length;
                    })
                  )
                : o.normalized.series.length),
              (o.normalized.labels = (t.labels || []).slice()),
              Array.prototype.push.apply(
                o.normalized.labels,
                i
                  .times(Math.max(0, r - o.normalized.labels.length))
                  .map(function() {
                    return "";
                  })
              ),
              e && i.reverseData(o.normalized),
              o
            );
          }),
          (i.safeHasProperty = function(t, e) {
            return null !== t && "object" == typeof t && t.hasOwnProperty(e);
          }),
          (i.isDataHoleValue = function(t) {
            return null == t || ("number" == typeof t && isNaN(t));
          }),
          (i.reverseData = function(t) {
            t.labels.reverse(), t.series.reverse();
            for (var e = 0; e < t.series.length; e++)
              "object" == typeof t.series[e] && void 0 !== t.series[e].data
                ? t.series[e].data.reverse()
                : t.series[e] instanceof Array && t.series[e].reverse();
          }),
          (i.getDataArray = function(t, e, n) {
            return t.series.map(function t(e) {
              if (i.safeHasProperty(e, "value")) return t(e.value);
              if (i.safeHasProperty(e, "data")) return t(e.data);
              if (e instanceof Array) return e.map(t);
              if (!i.isDataHoleValue(e)) {
                if (n) {
                  var r = {};
                  return (
                    "string" == typeof n
                      ? (r[n] = i.getNumberOrUndefined(e))
                      : (r.y = i.getNumberOrUndefined(e)),
                    (r.x = e.hasOwnProperty("x")
                      ? i.getNumberOrUndefined(e.x)
                      : r.x),
                    (r.y = e.hasOwnProperty("y")
                      ? i.getNumberOrUndefined(e.y)
                      : r.y),
                    r
                  );
                }
                return i.getNumberOrUndefined(e);
              }
            });
          }),
          (i.normalizePadding = function(t, e) {
            return (
              (e = e || 0),
              "number" == typeof t
                ? { top: t, right: t, bottom: t, left: t }
                : {
                    top: "number" == typeof t.top ? t.top : e,
                    right: "number" == typeof t.right ? t.right : e,
                    bottom: "number" == typeof t.bottom ? t.bottom : e,
                    left: "number" == typeof t.left ? t.left : e
                  }
            );
          }),
          (i.getMetaData = function(t, e) {
            var i = t.data ? t.data[e] : t[e];
            return i ? i.meta : void 0;
          }),
          (i.orderOfMagnitude = function(t) {
            return Math.floor(Math.log(Math.abs(t)) / Math.LN10);
          }),
          (i.projectLength = function(t, e, i) {
            return (e / i.range) * t;
          }),
          (i.getAvailableHeight = function(t, e) {
            return Math.max(
              (i.quantity(e.height).value || t.height()) -
                (e.chartPadding.top + e.chartPadding.bottom) -
                e.axisX.offset,
              0
            );
          }),
          (i.getHighLow = function(t, e, n) {
            var r = {
                high:
                  void 0 ===
                  (e = i.extend({}, e, n ? e["axis" + n.toUpperCase()] : {}))
                    .high
                    ? -Number.MAX_VALUE
                    : +e.high,
                low: void 0 === e.low ? Number.MAX_VALUE : +e.low
              },
              o = void 0 === e.high,
              s = void 0 === e.low;
            return (
              (o || s) &&
                (function t(e) {
                  if (void 0 !== e)
                    if (e instanceof Array)
                      for (var i = 0; i < e.length; i++) t(e[i]);
                    else {
                      var a = n ? +e[n] : +e;
                      o && a > r.high && (r.high = a),
                        s && a < r.low && (r.low = a);
                    }
                })(t),
              (e.referenceValue || 0 === e.referenceValue) &&
                ((r.high = Math.max(e.referenceValue, r.high)),
                (r.low = Math.min(e.referenceValue, r.low))),
              r.high <= r.low &&
                (0 === r.low
                  ? (r.high = 1)
                  : r.low < 0
                    ? (r.high = 0)
                    : r.high > 0
                      ? (r.low = 0)
                      : ((r.high = 1), (r.low = 0))),
              r
            );
          }),
          (i.isNumeric = function(t) {
            return null !== t && isFinite(t);
          }),
          (i.isFalseyButZero = function(t) {
            return !t && 0 !== t;
          }),
          (i.getNumberOrUndefined = function(t) {
            return i.isNumeric(t) ? +t : void 0;
          }),
          (i.isMultiValue = function(t) {
            return "object" == typeof t && ("x" in t || "y" in t);
          }),
          (i.getMultiValue = function(t, e) {
            return i.isMultiValue(t)
              ? i.getNumberOrUndefined(t[e || "y"])
              : i.getNumberOrUndefined(t);
          }),
          (i.rho = function(t) {
            if (1 === t) return t;
            function e(t, i) {
              return t % i == 0 ? i : e(i, t % i);
            }
            function i(t) {
              return t * t + 1;
            }
            var n,
              r = 2,
              o = 2;
            if (t % 2 == 0) return 2;
            do {
              (r = i(r) % t), (o = i(i(o)) % t), (n = e(Math.abs(r - o), t));
            } while (1 === n);
            return n;
          }),
          (i.getBounds = function(t, e, n, r) {
            var o,
              s,
              a,
              l = 0,
              c = { high: e.high, low: e.low };
            (c.valueRange = c.high - c.low),
              (c.oom = i.orderOfMagnitude(c.valueRange)),
              (c.step = Math.pow(10, c.oom)),
              (c.min = Math.floor(c.low / c.step) * c.step),
              (c.max = Math.ceil(c.high / c.step) * c.step),
              (c.range = c.max - c.min),
              (c.numberOfSteps = Math.round(c.range / c.step));
            var h = i.projectLength(t, c.step, c) < n,
              u = r ? i.rho(c.range) : 0;
            if (r && i.projectLength(t, 1, c) >= n) c.step = 1;
            else if (r && u < c.step && i.projectLength(t, u, c) >= n)
              c.step = u;
            else
              for (;;) {
                if (h && i.projectLength(t, c.step, c) <= n) c.step *= 2;
                else {
                  if (h || !(i.projectLength(t, c.step / 2, c) >= n)) break;
                  if (((c.step /= 2), r && c.step % 1 != 0)) {
                    c.step *= 2;
                    break;
                  }
                }
                if (l++ > 1e3)
                  throw new Error(
                    "Exceeded maximum number of iterations while optimizing scale step!"
                  );
              }
            var d = 2.221e-16;
            function p(t, e) {
              return t === (t += e) && (t *= 1 + (e > 0 ? d : -d)), t;
            }
            for (
              c.step = Math.max(c.step, d), s = c.min, a = c.max;
              s + c.step <= c.low;

            )
              s = p(s, c.step);
            for (; a - c.step >= c.high; ) a = p(a, -c.step);
            (c.min = s), (c.max = a), (c.range = c.max - c.min);
            var f = [];
            for (o = c.min; o <= c.max; o = p(o, c.step)) {
              var m = i.roundWithPrecision(o);
              m !== f[f.length - 1] && f.push(m);
            }
            return (c.values = f), c;
          }),
          (i.polarToCartesian = function(t, e, i, n) {
            var r = ((n - 90) * Math.PI) / 180;
            return { x: t + i * Math.cos(r), y: e + i * Math.sin(r) };
          }),
          (i.createChartRect = function(t, e, n) {
            var r = !(!e.axisX && !e.axisY),
              o = r ? e.axisY.offset : 0,
              s = r ? e.axisX.offset : 0,
              a = t.width() || i.quantity(e.width).value || 0,
              l = t.height() || i.quantity(e.height).value || 0,
              c = i.normalizePadding(e.chartPadding, n);
            (a = Math.max(a, o + c.left + c.right)),
              (l = Math.max(l, s + c.top + c.bottom));
            var h = {
              padding: c,
              width: function() {
                return this.x2 - this.x1;
              },
              height: function() {
                return this.y1 - this.y2;
              }
            };
            return (
              r
                ? ("start" === e.axisX.position
                    ? ((h.y2 = c.top + s),
                      (h.y1 = Math.max(l - c.bottom, h.y2 + 1)))
                    : ((h.y2 = c.top),
                      (h.y1 = Math.max(l - c.bottom - s, h.y2 + 1))),
                  "start" === e.axisY.position
                    ? ((h.x1 = c.left + o),
                      (h.x2 = Math.max(a - c.right, h.x1 + 1)))
                    : ((h.x1 = c.left),
                      (h.x2 = Math.max(a - c.right - o, h.x1 + 1))))
                : ((h.x1 = c.left),
                  (h.x2 = Math.max(a - c.right, h.x1 + 1)),
                  (h.y2 = c.top),
                  (h.y1 = Math.max(l - c.bottom, h.y2 + 1))),
              h
            );
          }),
          (i.createGrid = function(t, e, n, r, o, s, a, l) {
            var c = {};
            (c[n.units.pos + "1"] = t),
              (c[n.units.pos + "2"] = t),
              (c[n.counterUnits.pos + "1"] = r),
              (c[n.counterUnits.pos + "2"] = r + o);
            var h = s.elem("line", c, a.join(" "));
            l.emit(
              "draw",
              i.extend(
                { type: "grid", axis: n, index: e, group: s, element: h },
                c
              )
            );
          }),
          (i.createGridBackground = function(t, e, i, n) {
            var r = t.elem(
              "rect",
              { x: e.x1, y: e.y2, width: e.width(), height: e.height() },
              i,
              !0
            );
            n.emit("draw", { type: "gridBackground", group: t, element: r });
          }),
          (i.createLabel = function(t, n, r, o, s, a, l, c, h, u, d) {
            var p,
              f = {};
            if (
              ((f[s.units.pos] = t + l[s.units.pos]),
              (f[s.counterUnits.pos] = l[s.counterUnits.pos]),
              (f[s.units.len] = n),
              (f[s.counterUnits.len] = Math.max(0, a - 10)),
              u)
            ) {
              var m = e.createElement("span");
              (m.className = h.join(" ")),
                m.setAttribute("xmlns", i.namespaces.xhtml),
                (m.innerText = o[r]),
                (m.style[s.units.len] = Math.round(f[s.units.len]) + "px"),
                (m.style[s.counterUnits.len] =
                  Math.round(f[s.counterUnits.len]) + "px"),
                (p = c.foreignObject(
                  m,
                  i.extend({ style: "overflow: visible;" }, f)
                ));
            } else p = c.elem("text", f, h.join(" ")).text(o[r]);
            d.emit(
              "draw",
              i.extend(
                {
                  type: "label",
                  axis: s,
                  index: r,
                  group: c,
                  element: p,
                  text: o[r]
                },
                f
              )
            );
          }),
          (i.getSeriesOption = function(t, e, i) {
            if (t.name && e.series && e.series[t.name]) {
              var n = e.series[t.name];
              return n.hasOwnProperty(i) ? n[i] : e[i];
            }
            return e[i];
          }),
          (i.optionsProvider = function(e, n, r) {
            var o,
              s,
              a = i.extend({}, e),
              l = [];
            function c(e) {
              var l = o;
              if (((o = i.extend({}, a)), n))
                for (s = 0; s < n.length; s++) {
                  t.matchMedia(n[s][0]).matches && (o = i.extend(o, n[s][1]));
                }
              r &&
                e &&
                r.emit("optionsChanged", {
                  previousOptions: l,
                  currentOptions: o
                });
            }
            if (!t.matchMedia)
              throw "window.matchMedia not found! Make sure you're using a polyfill.";
            if (n)
              for (s = 0; s < n.length; s++) {
                var h = t.matchMedia(n[s][0]);
                h.addListener(c), l.push(h);
              }
            return (
              c(),
              {
                removeMediaQueryListeners: function() {
                  l.forEach(function(t) {
                    t.removeListener(c);
                  });
                },
                getCurrentOptions: function() {
                  return i.extend({}, o);
                }
              }
            );
          }),
          (i.splitIntoSegments = function(t, e, n) {
            n = i.extend({}, { increasingX: !1, fillHoles: !1 }, n);
            for (var r = [], o = !0, s = 0; s < t.length; s += 2)
              void 0 === i.getMultiValue(e[s / 2].value)
                ? n.fillHoles || (o = !0)
                : (n.increasingX && s >= 2 && t[s] <= t[s - 2] && (o = !0),
                  o &&
                    (r.push({ pathCoordinates: [], valueData: [] }), (o = !1)),
                  r[r.length - 1].pathCoordinates.push(t[s], t[s + 1]),
                  r[r.length - 1].valueData.push(e[s / 2]));
            return r;
          });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        (i.Interpolation = {}),
          (i.Interpolation.none = function(t) {
            return (
              (t = i.extend({}, { fillHoles: !1 }, t)),
              function(e, n) {
                for (
                  var r = new i.Svg.Path(), o = !0, s = 0;
                  s < e.length;
                  s += 2
                ) {
                  var a = e[s],
                    l = e[s + 1],
                    c = n[s / 2];
                  void 0 !== i.getMultiValue(c.value)
                    ? (o ? r.move(a, l, !1, c) : r.line(a, l, !1, c), (o = !1))
                    : t.fillHoles || (o = !0);
                }
                return r;
              }
            );
          }),
          (i.Interpolation.simple = function(t) {
            t = i.extend({}, { divisor: 2, fillHoles: !1 }, t);
            var e = 1 / Math.max(1, t.divisor);
            return function(n, r) {
              for (
                var o, s, a, l = new i.Svg.Path(), c = 0;
                c < n.length;
                c += 2
              ) {
                var h = n[c],
                  u = n[c + 1],
                  d = (h - o) * e,
                  p = r[c / 2];
                void 0 !== p.value
                  ? (void 0 === a
                      ? l.move(h, u, !1, p)
                      : l.curve(o + d, s, h - d, u, h, u, !1, p),
                    (o = h),
                    (s = u),
                    (a = p))
                  : t.fillHoles || (o = h = a = void 0);
              }
              return l;
            };
          }),
          (i.Interpolation.cardinal = function(t) {
            t = i.extend({}, { tension: 1, fillHoles: !1 }, t);
            var e = Math.min(1, Math.max(0, t.tension)),
              n = 1 - e;
            return function r(o, s) {
              var a = i.splitIntoSegments(o, s, { fillHoles: t.fillHoles });
              if (a.length) {
                if (a.length > 1) {
                  var l = [];
                  return (
                    a.forEach(function(t) {
                      l.push(r(t.pathCoordinates, t.valueData));
                    }),
                    i.Svg.Path.join(l)
                  );
                }
                if (
                  ((o = a[0].pathCoordinates),
                  (s = a[0].valueData),
                  o.length <= 4)
                )
                  return i.Interpolation.none()(o, s);
                for (
                  var c = new i.Svg.Path().move(o[0], o[1], !1, s[0]),
                    h = 0,
                    u = o.length;
                  u - 2 > h;
                  h += 2
                ) {
                  var d = [
                    { x: +o[h - 2], y: +o[h - 1] },
                    { x: +o[h], y: +o[h + 1] },
                    { x: +o[h + 2], y: +o[h + 3] },
                    { x: +o[h + 4], y: +o[h + 5] }
                  ];
                  u - 4 === h
                    ? (d[3] = d[2])
                    : h || (d[0] = { x: +o[h], y: +o[h + 1] }),
                    c.curve(
                      (e * (-d[0].x + 6 * d[1].x + d[2].x)) / 6 + n * d[2].x,
                      (e * (-d[0].y + 6 * d[1].y + d[2].y)) / 6 + n * d[2].y,
                      (e * (d[1].x + 6 * d[2].x - d[3].x)) / 6 + n * d[2].x,
                      (e * (d[1].y + 6 * d[2].y - d[3].y)) / 6 + n * d[2].y,
                      d[2].x,
                      d[2].y,
                      !1,
                      s[(h + 2) / 2]
                    );
                }
                return c;
              }
              return i.Interpolation.none()([]);
            };
          }),
          (i.Interpolation.monotoneCubic = function(t) {
            return (
              (t = i.extend({}, { fillHoles: !1 }, t)),
              function e(n, r) {
                var o = i.splitIntoSegments(n, r, {
                  fillHoles: t.fillHoles,
                  increasingX: !0
                });
                if (o.length) {
                  if (o.length > 1) {
                    var s = [];
                    return (
                      o.forEach(function(t) {
                        s.push(e(t.pathCoordinates, t.valueData));
                      }),
                      i.Svg.Path.join(s)
                    );
                  }
                  if (
                    ((n = o[0].pathCoordinates),
                    (r = o[0].valueData),
                    n.length <= 4)
                  )
                    return i.Interpolation.none()(n, r);
                  var a,
                    l,
                    c = [],
                    h = [],
                    u = n.length / 2,
                    d = [],
                    p = [],
                    f = [],
                    m = [];
                  for (a = 0; a < u; a++)
                    (c[a] = n[2 * a]), (h[a] = n[2 * a + 1]);
                  for (a = 0; a < u - 1; a++)
                    (f[a] = h[a + 1] - h[a]),
                      (m[a] = c[a + 1] - c[a]),
                      (p[a] = f[a] / m[a]);
                  for (d[0] = p[0], d[u - 1] = p[u - 2], a = 1; a < u - 1; a++)
                    0 === p[a] || 0 === p[a - 1] || p[a - 1] > 0 != p[a] > 0
                      ? (d[a] = 0)
                      : ((d[a] =
                          (3 * (m[a - 1] + m[a])) /
                          ((2 * m[a] + m[a - 1]) / p[a - 1] +
                            (m[a] + 2 * m[a - 1]) / p[a])),
                        isFinite(d[a]) || (d[a] = 0));
                  for (
                    l = new i.Svg.Path().move(c[0], h[0], !1, r[0]), a = 0;
                    a < u - 1;
                    a++
                  )
                    l.curve(
                      c[a] + m[a] / 3,
                      h[a] + (d[a] * m[a]) / 3,
                      c[a + 1] - m[a] / 3,
                      h[a + 1] - (d[a + 1] * m[a]) / 3,
                      c[a + 1],
                      h[a + 1],
                      !1,
                      r[a + 1]
                    );
                  return l;
                }
                return i.Interpolation.none()([]);
              }
            );
          }),
          (i.Interpolation.step = function(t) {
            return (
              (t = i.extend({}, { postpone: !0, fillHoles: !1 }, t)),
              function(e, n) {
                for (
                  var r, o, s, a = new i.Svg.Path(), l = 0;
                  l < e.length;
                  l += 2
                ) {
                  var c = e[l],
                    h = e[l + 1],
                    u = n[l / 2];
                  void 0 !== u.value
                    ? (void 0 === s
                        ? a.move(c, h, !1, u)
                        : (t.postpone
                            ? a.line(c, o, !1, s)
                            : a.line(r, h, !1, u),
                          a.line(c, h, !1, u)),
                      (r = c),
                      (o = h),
                      (s = u))
                    : t.fillHoles || (r = o = s = void 0);
                }
                return a;
              }
            );
          });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.EventEmitter = function() {
          var t = [];
          return {
            addEventHandler: function(e, i) {
              (t[e] = t[e] || []), t[e].push(i);
            },
            removeEventHandler: function(e, i) {
              t[e] &&
                (i
                  ? (t[e].splice(t[e].indexOf(i), 1),
                    0 === t[e].length && delete t[e])
                  : delete t[e]);
            },
            emit: function(e, i) {
              t[e] &&
                t[e].forEach(function(t) {
                  t(i);
                }),
                t["*"] &&
                  t["*"].forEach(function(t) {
                    t(e, i);
                  });
            }
          };
        };
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.Class = {
          extend: function(t, e) {
            var n = e || this.prototype || i.Class,
              r = Object.create(n);
            i.Class.cloneDefinitions(r, t);
            var o = function() {
              var t,
                e = r.constructor || function() {};
              return (
                (t = this === i ? Object.create(r) : this),
                e.apply(t, Array.prototype.slice.call(arguments, 0)),
                t
              );
            };
            return (
              (o.prototype = r), (o.super = n), (o.extend = this.extend), o
            );
          },
          cloneDefinitions: function() {
            var t = (function(t) {
                var e = [];
                if (t.length) for (var i = 0; i < t.length; i++) e.push(t[i]);
                return e;
              })(arguments),
              e = t[0];
            return (
              t.splice(1, t.length - 1).forEach(function(t) {
                Object.getOwnPropertyNames(t).forEach(function(i) {
                  delete e[i],
                    Object.defineProperty(
                      e,
                      i,
                      Object.getOwnPropertyDescriptor(t, i)
                    );
                });
              }),
              e
            );
          }
        };
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.Base = i.Class.extend({
          constructor: function(e, n, r, o, s) {
            (this.container = i.querySelector(e)),
              (this.data = n || {}),
              (this.data.labels = this.data.labels || []),
              (this.data.series = this.data.series || []),
              (this.defaultOptions = r),
              (this.options = o),
              (this.responsiveOptions = s),
              (this.eventEmitter = i.EventEmitter()),
              (this.supportsForeignObject = i.Svg.isSupported("Extensibility")),
              (this.supportsAnimations = i.Svg.isSupported(
                "AnimationEventsAttribute"
              )),
              (this.resizeListener = function() {
                this.update();
              }.bind(this)),
              this.container &&
                (this.container.__chartist__ &&
                  this.container.__chartist__.detach(),
                (this.container.__chartist__ = this)),
              (this.initializeTimeoutId = setTimeout(
                function() {
                  t.addEventListener("resize", this.resizeListener),
                    (this.optionsProvider = i.optionsProvider(
                      this.options,
                      this.responsiveOptions,
                      this.eventEmitter
                    )),
                    this.eventEmitter.addEventHandler(
                      "optionsChanged",
                      function() {
                        this.update();
                      }.bind(this)
                    ),
                    this.options.plugins &&
                      this.options.plugins.forEach(
                        function(t) {
                          t instanceof Array ? t[0](this, t[1]) : t(this);
                        }.bind(this)
                      ),
                    this.eventEmitter.emit("data", {
                      type: "initial",
                      data: this.data
                    }),
                    this.createChart(this.optionsProvider.getCurrentOptions()),
                    (this.initializeTimeoutId = void 0);
                }.bind(this),
                0
              ));
          },
          optionsProvider: void 0,
          container: void 0,
          svg: void 0,
          eventEmitter: void 0,
          createChart: function() {
            throw new Error("Base chart type can't be instantiated!");
          },
          update: function(t, e, n) {
            return (
              t &&
                ((this.data = t || {}),
                (this.data.labels = this.data.labels || []),
                (this.data.series = this.data.series || []),
                this.eventEmitter.emit("data", {
                  type: "update",
                  data: this.data
                })),
              e &&
                ((this.options = i.extend(
                  {},
                  n ? this.options : this.defaultOptions,
                  e
                )),
                this.initializeTimeoutId ||
                  (this.optionsProvider.removeMediaQueryListeners(),
                  (this.optionsProvider = i.optionsProvider(
                    this.options,
                    this.responsiveOptions,
                    this.eventEmitter
                  )))),
              this.initializeTimeoutId ||
                this.createChart(this.optionsProvider.getCurrentOptions()),
              this
            );
          },
          detach: function() {
            return (
              this.initializeTimeoutId
                ? t.clearTimeout(this.initializeTimeoutId)
                : (t.removeEventListener("resize", this.resizeListener),
                  this.optionsProvider.removeMediaQueryListeners()),
              this
            );
          },
          on: function(t, e) {
            return this.eventEmitter.addEventHandler(t, e), this;
          },
          off: function(t, e) {
            return this.eventEmitter.removeEventHandler(t, e), this;
          },
          version: i.version,
          supportsForeignObject: !1
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        (i.Svg = i.Class.extend({
          constructor: function(t, n, r, o, s) {
            t instanceof Element
              ? (this._node = t)
              : ((this._node = e.createElementNS(i.namespaces.svg, t)),
                "svg" === t && this.attr({ "xmlns:ct": i.namespaces.ct })),
              n && this.attr(n),
              r && this.addClass(r),
              o &&
                (s && o._node.firstChild
                  ? o._node.insertBefore(this._node, o._node.firstChild)
                  : o._node.appendChild(this._node));
          },
          attr: function(t, e) {
            return "string" == typeof t
              ? e
                ? this._node.getAttributeNS(e, t)
                : this._node.getAttribute(t)
              : (Object.keys(t).forEach(
                  function(e) {
                    if (void 0 !== t[e])
                      if (-1 !== e.indexOf(":")) {
                        var n = e.split(":");
                        this._node.setAttributeNS(i.namespaces[n[0]], e, t[e]);
                      } else this._node.setAttribute(e, t[e]);
                  }.bind(this)
                ),
                this);
          },
          elem: function(t, e, n, r) {
            return new i.Svg(t, e, n, this, r);
          },
          parent: function() {
            return this._node.parentNode instanceof SVGElement
              ? new i.Svg(this._node.parentNode)
              : null;
          },
          root: function() {
            for (var t = this._node; "svg" !== t.nodeName; ) t = t.parentNode;
            return new i.Svg(t);
          },
          querySelector: function(t) {
            var e = this._node.querySelector(t);
            return e ? new i.Svg(e) : null;
          },
          querySelectorAll: function(t) {
            var e = this._node.querySelectorAll(t);
            return e.length ? new i.Svg.List(e) : null;
          },
          getNode: function() {
            return this._node;
          },
          foreignObject: function(t, n, r, o) {
            if ("string" == typeof t) {
              var s = e.createElement("div");
              (s.innerHTML = t), (t = s.firstChild);
            }
            t.setAttribute("xmlns", i.namespaces.xmlns);
            var a = this.elem("foreignObject", n, r, o);
            return a._node.appendChild(t), a;
          },
          text: function(t) {
            return this._node.appendChild(e.createTextNode(t)), this;
          },
          empty: function() {
            for (; this._node.firstChild; )
              this._node.removeChild(this._node.firstChild);
            return this;
          },
          remove: function() {
            return this._node.parentNode.removeChild(this._node), this.parent();
          },
          replace: function(t) {
            return this._node.parentNode.replaceChild(t._node, this._node), t;
          },
          append: function(t, e) {
            return (
              e && this._node.firstChild
                ? this._node.insertBefore(t._node, this._node.firstChild)
                : this._node.appendChild(t._node),
              this
            );
          },
          classes: function() {
            return this._node.getAttribute("class")
              ? this._node
                  .getAttribute("class")
                  .trim()
                  .split(/\s+/)
              : [];
          },
          addClass: function(t) {
            return (
              this._node.setAttribute(
                "class",
                this.classes(this._node)
                  .concat(t.trim().split(/\s+/))
                  .filter(function(t, e, i) {
                    return i.indexOf(t) === e;
                  })
                  .join(" ")
              ),
              this
            );
          },
          removeClass: function(t) {
            var e = t.trim().split(/\s+/);
            return (
              this._node.setAttribute(
                "class",
                this.classes(this._node)
                  .filter(function(t) {
                    return -1 === e.indexOf(t);
                  })
                  .join(" ")
              ),
              this
            );
          },
          removeAllClasses: function() {
            return this._node.setAttribute("class", ""), this;
          },
          height: function() {
            return this._node.getBoundingClientRect().height;
          },
          width: function() {
            return this._node.getBoundingClientRect().width;
          },
          animate: function(t, e, n) {
            return (
              void 0 === e && (e = !0),
              Object.keys(t).forEach(
                function(r) {
                  function o(t, e) {
                    var o,
                      s,
                      a,
                      l = {};
                    t.easing &&
                      ((a =
                        t.easing instanceof Array
                          ? t.easing
                          : i.Svg.Easing[t.easing]),
                      delete t.easing),
                      (t.begin = i.ensureUnit(t.begin, "ms")),
                      (t.dur = i.ensureUnit(t.dur, "ms")),
                      a &&
                        ((t.calcMode = "spline"),
                        (t.keySplines = a.join(" ")),
                        (t.keyTimes = "0;1")),
                      e &&
                        ((t.fill = "freeze"),
                        (l[r] = t.from),
                        this.attr(l),
                        (s = i.quantity(t.begin || 0).value),
                        (t.begin = "indefinite")),
                      (o = this.elem(
                        "animate",
                        i.extend({ attributeName: r }, t)
                      )),
                      e &&
                        setTimeout(
                          function() {
                            try {
                              o._node.beginElement();
                            } catch (e) {
                              (l[r] = t.to), this.attr(l), o.remove();
                            }
                          }.bind(this),
                          s
                        ),
                      n &&
                        o._node.addEventListener(
                          "beginEvent",
                          function() {
                            n.emit("animationBegin", {
                              element: this,
                              animate: o._node,
                              params: t
                            });
                          }.bind(this)
                        ),
                      o._node.addEventListener(
                        "endEvent",
                        function() {
                          n &&
                            n.emit("animationEnd", {
                              element: this,
                              animate: o._node,
                              params: t
                            }),
                            e && ((l[r] = t.to), this.attr(l), o.remove());
                        }.bind(this)
                      );
                  }
                  t[r] instanceof Array
                    ? t[r].forEach(
                        function(t) {
                          o.bind(this)(t, !1);
                        }.bind(this)
                      )
                    : o.bind(this)(t[r], e);
                }.bind(this)
              ),
              this
            );
          }
        })),
          (i.Svg.isSupported = function(t) {
            return e.implementation.hasFeature(
              "http://www.w3.org/TR/SVG11/feature#" + t,
              "1.1"
            );
          });
        (i.Svg.Easing = {
          easeInSine: [0.47, 0, 0.745, 0.715],
          easeOutSine: [0.39, 0.575, 0.565, 1],
          easeInOutSine: [0.445, 0.05, 0.55, 0.95],
          easeInQuad: [0.55, 0.085, 0.68, 0.53],
          easeOutQuad: [0.25, 0.46, 0.45, 0.94],
          easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
          easeInCubic: [0.55, 0.055, 0.675, 0.19],
          easeOutCubic: [0.215, 0.61, 0.355, 1],
          easeInOutCubic: [0.645, 0.045, 0.355, 1],
          easeInQuart: [0.895, 0.03, 0.685, 0.22],
          easeOutQuart: [0.165, 0.84, 0.44, 1],
          easeInOutQuart: [0.77, 0, 0.175, 1],
          easeInQuint: [0.755, 0.05, 0.855, 0.06],
          easeOutQuint: [0.23, 1, 0.32, 1],
          easeInOutQuint: [0.86, 0, 0.07, 1],
          easeInExpo: [0.95, 0.05, 0.795, 0.035],
          easeOutExpo: [0.19, 1, 0.22, 1],
          easeInOutExpo: [1, 0, 0, 1],
          easeInCirc: [0.6, 0.04, 0.98, 0.335],
          easeOutCirc: [0.075, 0.82, 0.165, 1],
          easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
          easeInBack: [0.6, -0.28, 0.735, 0.045],
          easeOutBack: [0.175, 0.885, 0.32, 1.275],
          easeInOutBack: [0.68, -0.55, 0.265, 1.55]
        }),
          (i.Svg.List = i.Class.extend({
            constructor: function(t) {
              var e = this;
              this.svgElements = [];
              for (var n = 0; n < t.length; n++)
                this.svgElements.push(new i.Svg(t[n]));
              Object.keys(i.Svg.prototype)
                .filter(function(t) {
                  return (
                    -1 ===
                    [
                      "constructor",
                      "parent",
                      "querySelector",
                      "querySelectorAll",
                      "replace",
                      "append",
                      "classes",
                      "height",
                      "width"
                    ].indexOf(t)
                  );
                })
                .forEach(function(t) {
                  e[t] = function() {
                    var n = Array.prototype.slice.call(arguments, 0);
                    return (
                      e.svgElements.forEach(function(e) {
                        i.Svg.prototype[t].apply(e, n);
                      }),
                      e
                    );
                  };
                });
            }
          }));
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        var n = {
            m: ["x", "y"],
            l: ["x", "y"],
            c: ["x1", "y1", "x2", "y2", "x", "y"],
            a: ["rx", "ry", "xAr", "lAf", "sf", "x", "y"]
          },
          r = { accuracy: 3 };
        function o(t, e, n, r, o, s) {
          var a = i.extend(
            { command: o ? t.toLowerCase() : t.toUpperCase() },
            e,
            s ? { data: s } : {}
          );
          n.splice(r, 0, a);
        }
        function s(t, e) {
          t.forEach(function(i, r) {
            n[i.command.toLowerCase()].forEach(function(n, o) {
              e(i, n, r, o, t);
            });
          });
        }
        (i.Svg.Path = i.Class.extend({
          constructor: function(t, e) {
            (this.pathElements = []),
              (this.pos = 0),
              (this.close = t),
              (this.options = i.extend({}, r, e));
          },
          position: function(t) {
            return void 0 !== t
              ? ((this.pos = Math.max(
                  0,
                  Math.min(this.pathElements.length, t)
                )),
                this)
              : this.pos;
          },
          remove: function(t) {
            return this.pathElements.splice(this.pos, t), this;
          },
          move: function(t, e, i, n) {
            return (
              o("M", { x: +t, y: +e }, this.pathElements, this.pos++, i, n),
              this
            );
          },
          line: function(t, e, i, n) {
            return (
              o("L", { x: +t, y: +e }, this.pathElements, this.pos++, i, n),
              this
            );
          },
          curve: function(t, e, i, n, r, s, a, l) {
            return (
              o(
                "C",
                { x1: +t, y1: +e, x2: +i, y2: +n, x: +r, y: +s },
                this.pathElements,
                this.pos++,
                a,
                l
              ),
              this
            );
          },
          arc: function(t, e, i, n, r, s, a, l, c) {
            return (
              o(
                "A",
                { rx: +t, ry: +e, xAr: +i, lAf: +n, sf: +r, x: +s, y: +a },
                this.pathElements,
                this.pos++,
                l,
                c
              ),
              this
            );
          },
          scale: function(t, e) {
            return (
              s(this.pathElements, function(i, n) {
                i[n] *= "x" === n[0] ? t : e;
              }),
              this
            );
          },
          translate: function(t, e) {
            return (
              s(this.pathElements, function(i, n) {
                i[n] += "x" === n[0] ? t : e;
              }),
              this
            );
          },
          transform: function(t) {
            return (
              s(this.pathElements, function(e, i, n, r, o) {
                var s = t(e, i, n, r, o);
                (s || 0 === s) && (e[i] = s);
              }),
              this
            );
          },
          parse: function(t) {
            var e = t
              .replace(/([A-Za-z])([0-9])/g, "$1 $2")
              .replace(/([0-9])([A-Za-z])/g, "$1 $2")
              .split(/[\s,]+/)
              .reduce(function(t, e) {
                return (
                  e.match(/[A-Za-z]/) && t.push([]), t[t.length - 1].push(e), t
                );
              }, []);
            "Z" === e[e.length - 1][0].toUpperCase() && e.pop();
            var r = e.map(function(t) {
                var e = t.shift(),
                  r = n[e.toLowerCase()];
                return i.extend(
                  { command: e },
                  r.reduce(function(e, i, n) {
                    return (e[i] = +t[n]), e;
                  }, {})
                );
              }),
              o = [this.pos, 0];
            return (
              Array.prototype.push.apply(o, r),
              Array.prototype.splice.apply(this.pathElements, o),
              (this.pos += r.length),
              this
            );
          },
          stringify: function() {
            var t = Math.pow(10, this.options.accuracy);
            return (
              this.pathElements.reduce(
                function(e, i) {
                  var r = n[i.command.toLowerCase()].map(
                    function(e) {
                      return this.options.accuracy
                        ? Math.round(i[e] * t) / t
                        : i[e];
                    }.bind(this)
                  );
                  return e + i.command + r.join(",");
                }.bind(this),
                ""
              ) + (this.close ? "Z" : "")
            );
          },
          clone: function(t) {
            var e = new i.Svg.Path(t || this.close);
            return (
              (e.pos = this.pos),
              (e.pathElements = this.pathElements.slice().map(function(t) {
                return i.extend({}, t);
              })),
              (e.options = i.extend({}, this.options)),
              e
            );
          },
          splitByCommand: function(t) {
            var e = [new i.Svg.Path()];
            return (
              this.pathElements.forEach(function(n) {
                n.command === t.toUpperCase() &&
                  0 !== e[e.length - 1].pathElements.length &&
                  e.push(new i.Svg.Path()),
                  e[e.length - 1].pathElements.push(n);
              }),
              e
            );
          }
        })),
          (i.Svg.Path.elementDescriptions = n),
          (i.Svg.Path.join = function(t, e, n) {
            for (var r = new i.Svg.Path(e, n), o = 0; o < t.length; o++)
              for (var s = t[o], a = 0; a < s.pathElements.length; a++)
                r.pathElements.push(s.pathElements[a]);
            return r;
          });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        var n = {
          x: {
            pos: "x",
            len: "width",
            dir: "horizontal",
            rectStart: "x1",
            rectEnd: "x2",
            rectOffset: "y2"
          },
          y: {
            pos: "y",
            len: "height",
            dir: "vertical",
            rectStart: "y2",
            rectEnd: "y1",
            rectOffset: "x1"
          }
        };
        (i.Axis = i.Class.extend({
          constructor: function(t, e, i, r) {
            (this.units = t),
              (this.counterUnits = t === n.x ? n.y : n.x),
              (this.chartRect = e),
              (this.axisLength = e[t.rectEnd] - e[t.rectStart]),
              (this.gridOffset = e[t.rectOffset]),
              (this.ticks = i),
              (this.options = r);
          },
          createGridAndLabels: function(t, e, n, r, o) {
            var s = r["axis" + this.units.pos.toUpperCase()],
              a = this.ticks.map(this.projectValue.bind(this)),
              l = this.ticks.map(s.labelInterpolationFnc);
            a.forEach(
              function(c, h) {
                var u,
                  d = { x: 0, y: 0 };
                (u = a[h + 1]
                  ? a[h + 1] - c
                  : Math.max(this.axisLength - c, 30)),
                  (i.isFalseyButZero(l[h]) && "" !== l[h]) ||
                    ("x" === this.units.pos
                      ? ((c = this.chartRect.x1 + c),
                        (d.x = r.axisX.labelOffset.x),
                        "start" === r.axisX.position
                          ? (d.y =
                              this.chartRect.padding.top +
                              r.axisX.labelOffset.y +
                              (n ? 5 : 20))
                          : (d.y =
                              this.chartRect.y1 +
                              r.axisX.labelOffset.y +
                              (n ? 5 : 20)))
                      : ((c = this.chartRect.y1 - c),
                        (d.y = r.axisY.labelOffset.y - (n ? u : 0)),
                        "start" === r.axisY.position
                          ? (d.x = n
                              ? this.chartRect.padding.left +
                                r.axisY.labelOffset.x
                              : this.chartRect.x1 - 10)
                          : (d.x =
                              this.chartRect.x2 + r.axisY.labelOffset.x + 10)),
                    s.showGrid &&
                      i.createGrid(
                        c,
                        h,
                        this,
                        this.gridOffset,
                        this.chartRect[this.counterUnits.len](),
                        t,
                        [r.classNames.grid, r.classNames[this.units.dir]],
                        o
                      ),
                    s.showLabel &&
                      i.createLabel(
                        c,
                        u,
                        h,
                        l,
                        this,
                        s.offset,
                        d,
                        e,
                        [
                          r.classNames.label,
                          r.classNames[this.units.dir],
                          "start" === s.position
                            ? r.classNames[s.position]
                            : r.classNames.end
                        ],
                        n,
                        o
                      ));
              }.bind(this)
            );
          },
          projectValue: function(t, e, i) {
            throw new Error("Base axis can't be instantiated!");
          }
        })),
          (i.Axis.units = n);
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.AutoScaleAxis = i.Axis.extend({
          constructor: function(t, e, n, r) {
            var o = r.highLow || i.getHighLow(e, r, t.pos);
            (this.bounds = i.getBounds(
              n[t.rectEnd] - n[t.rectStart],
              o,
              r.scaleMinSpace || 20,
              r.onlyInteger
            )),
              (this.range = { min: this.bounds.min, max: this.bounds.max }),
              i.AutoScaleAxis.super.constructor.call(
                this,
                t,
                n,
                this.bounds.values,
                r
              );
          },
          projectValue: function(t) {
            return (
              (this.axisLength *
                (+i.getMultiValue(t, this.units.pos) - this.bounds.min)) /
              this.bounds.range
            );
          }
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.FixedScaleAxis = i.Axis.extend({
          constructor: function(t, e, n, r) {
            var o = r.highLow || i.getHighLow(e, r, t.pos);
            (this.divisor = r.divisor || 1),
              (this.ticks =
                r.ticks ||
                i.times(this.divisor).map(
                  function(t, e) {
                    return o.low + ((o.high - o.low) / this.divisor) * e;
                  }.bind(this)
                )),
              this.ticks.sort(function(t, e) {
                return t - e;
              }),
              (this.range = { min: o.low, max: o.high }),
              i.FixedScaleAxis.super.constructor.call(
                this,
                t,
                n,
                this.ticks,
                r
              ),
              (this.stepLength = this.axisLength / this.divisor);
          },
          projectValue: function(t) {
            return (
              (this.axisLength *
                (+i.getMultiValue(t, this.units.pos) - this.range.min)) /
              (this.range.max - this.range.min)
            );
          }
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        i.StepAxis = i.Axis.extend({
          constructor: function(t, e, n, r) {
            i.StepAxis.super.constructor.call(this, t, n, r.ticks, r);
            var o = Math.max(1, r.ticks.length - (r.stretch ? 1 : 0));
            this.stepLength = this.axisLength / o;
          },
          projectValue: function(t, e) {
            return this.stepLength * e;
          }
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        var n = {
          axisX: {
            offset: 30,
            position: "end",
            labelOffset: { x: 0, y: 0 },
            showLabel: !0,
            showGrid: !0,
            labelInterpolationFnc: i.noop,
            type: void 0
          },
          axisY: {
            offset: 40,
            position: "start",
            labelOffset: { x: 0, y: 0 },
            showLabel: !0,
            showGrid: !0,
            labelInterpolationFnc: i.noop,
            type: void 0,
            scaleMinSpace: 20,
            onlyInteger: !1
          },
          width: void 0,
          height: void 0,
          showLine: !0,
          showPoint: !0,
          showArea: !1,
          areaBase: 0,
          lineSmooth: !0,
          showGridBackground: !1,
          low: void 0,
          high: void 0,
          chartPadding: { top: 15, right: 15, bottom: 5, left: 10 },
          fullWidth: !1,
          reverseData: !1,
          classNames: {
            chart: "ct-chart-line",
            label: "ct-label",
            labelGroup: "ct-labels",
            series: "ct-series",
            line: "ct-line",
            point: "ct-point",
            area: "ct-area",
            grid: "ct-grid",
            gridGroup: "ct-grids",
            gridBackground: "ct-grid-background",
            vertical: "ct-vertical",
            horizontal: "ct-horizontal",
            start: "ct-start",
            end: "ct-end"
          }
        };
        i.Line = i.Base.extend({
          constructor: function(t, e, r, o) {
            i.Line.super.constructor.call(this, t, e, n, i.extend({}, n, r), o);
          },
          createChart: function(t) {
            var e = i.normalizeData(this.data, t.reverseData, !0);
            this.svg = i.createSvg(
              this.container,
              t.width,
              t.height,
              t.classNames.chart
            );
            var r,
              o,
              s = this.svg.elem("g").addClass(t.classNames.gridGroup),
              a = this.svg.elem("g"),
              l = this.svg.elem("g").addClass(t.classNames.labelGroup),
              c = i.createChartRect(this.svg, t, n.padding);
            (r =
              void 0 === t.axisX.type
                ? new i.StepAxis(
                    i.Axis.units.x,
                    e.normalized.series,
                    c,
                    i.extend({}, t.axisX, {
                      ticks: e.normalized.labels,
                      stretch: t.fullWidth
                    })
                  )
                : t.axisX.type.call(
                    i,
                    i.Axis.units.x,
                    e.normalized.series,
                    c,
                    t.axisX
                  )),
              (o =
                void 0 === t.axisY.type
                  ? new i.AutoScaleAxis(
                      i.Axis.units.y,
                      e.normalized.series,
                      c,
                      i.extend({}, t.axisY, {
                        high: i.isNumeric(t.high) ? t.high : t.axisY.high,
                        low: i.isNumeric(t.low) ? t.low : t.axisY.low
                      })
                    )
                  : t.axisY.type.call(
                      i,
                      i.Axis.units.y,
                      e.normalized.series,
                      c,
                      t.axisY
                    )),
              r.createGridAndLabels(
                s,
                l,
                this.supportsForeignObject,
                t,
                this.eventEmitter
              ),
              o.createGridAndLabels(
                s,
                l,
                this.supportsForeignObject,
                t,
                this.eventEmitter
              ),
              t.showGridBackground &&
                i.createGridBackground(
                  s,
                  c,
                  t.classNames.gridBackground,
                  this.eventEmitter
                ),
              e.raw.series.forEach(
                function(n, s) {
                  var l = a.elem("g");
                  l.attr({
                    "ct:series-name": n.name,
                    "ct:meta": i.serialize(n.meta)
                  }),
                    l.addClass(
                      [
                        t.classNames.series,
                        n.className ||
                          t.classNames.series + "-" + i.alphaNumerate(s)
                      ].join(" ")
                    );
                  var h = [],
                    u = [];
                  e.normalized.series[s].forEach(
                    function(t, a) {
                      var l = {
                        x: c.x1 + r.projectValue(t, a, e.normalized.series[s]),
                        y: c.y1 - o.projectValue(t, a, e.normalized.series[s])
                      };
                      h.push(l.x, l.y),
                        u.push({
                          value: t,
                          valueIndex: a,
                          meta: i.getMetaData(n, a)
                        });
                    }.bind(this)
                  );
                  var d = {
                      lineSmooth: i.getSeriesOption(n, t, "lineSmooth"),
                      showPoint: i.getSeriesOption(n, t, "showPoint"),
                      showLine: i.getSeriesOption(n, t, "showLine"),
                      showArea: i.getSeriesOption(n, t, "showArea"),
                      areaBase: i.getSeriesOption(n, t, "areaBase")
                    },
                    p = ("function" == typeof d.lineSmooth
                      ? d.lineSmooth
                      : d.lineSmooth
                        ? i.Interpolation.monotoneCubic()
                        : i.Interpolation.none())(h, u);
                  if (
                    (d.showPoint &&
                      p.pathElements.forEach(
                        function(e) {
                          var a = l
                            .elem(
                              "line",
                              { x1: e.x, y1: e.y, x2: e.x + 0.01, y2: e.y },
                              t.classNames.point
                            )
                            .attr({
                              "ct:value": [e.data.value.x, e.data.value.y]
                                .filter(i.isNumeric)
                                .join(","),
                              "ct:meta": i.serialize(e.data.meta)
                            });
                          this.eventEmitter.emit("draw", {
                            type: "point",
                            value: e.data.value,
                            index: e.data.valueIndex,
                            meta: e.data.meta,
                            series: n,
                            seriesIndex: s,
                            axisX: r,
                            axisY: o,
                            group: l,
                            element: a,
                            x: e.x,
                            y: e.y
                          });
                        }.bind(this)
                      ),
                    d.showLine)
                  ) {
                    var f = l.elem(
                      "path",
                      { d: p.stringify() },
                      t.classNames.line,
                      !0
                    );
                    this.eventEmitter.emit("draw", {
                      type: "line",
                      values: e.normalized.series[s],
                      path: p.clone(),
                      chartRect: c,
                      index: s,
                      series: n,
                      seriesIndex: s,
                      seriesMeta: n.meta,
                      axisX: r,
                      axisY: o,
                      group: l,
                      element: f
                    });
                  }
                  if (d.showArea && o.range) {
                    var m = Math.max(
                        Math.min(d.areaBase, o.range.max),
                        o.range.min
                      ),
                      g = c.y1 - o.projectValue(m);
                    p.splitByCommand("M")
                      .filter(function(t) {
                        return t.pathElements.length > 1;
                      })
                      .map(function(t) {
                        var e = t.pathElements[0],
                          i = t.pathElements[t.pathElements.length - 1];
                        return t
                          .clone(!0)
                          .position(0)
                          .remove(1)
                          .move(e.x, g)
                          .line(e.x, e.y)
                          .position(t.pathElements.length + 1)
                          .line(i.x, g);
                      })
                      .forEach(
                        function(i) {
                          var a = l.elem(
                            "path",
                            { d: i.stringify() },
                            t.classNames.area,
                            !0
                          );
                          this.eventEmitter.emit("draw", {
                            type: "area",
                            values: e.normalized.series[s],
                            path: i.clone(),
                            series: n,
                            seriesIndex: s,
                            axisX: r,
                            axisY: o,
                            chartRect: c,
                            index: s,
                            group: l,
                            element: a
                          });
                        }.bind(this)
                      );
                  }
                }.bind(this)
              ),
              this.eventEmitter.emit("created", {
                bounds: o.bounds,
                chartRect: c,
                axisX: r,
                axisY: o,
                svg: this.svg,
                options: t
              });
          }
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        var n = {
          axisX: {
            offset: 30,
            position: "end",
            labelOffset: { x: 0, y: 0 },
            showLabel: !0,
            showGrid: !0,
            labelInterpolationFnc: i.noop,
            scaleMinSpace: 30,
            onlyInteger: !1
          },
          axisY: {
            offset: 40,
            position: "start",
            labelOffset: { x: 0, y: 0 },
            showLabel: !0,
            showGrid: !0,
            labelInterpolationFnc: i.noop,
            scaleMinSpace: 20,
            onlyInteger: !1
          },
          width: void 0,
          height: void 0,
          high: void 0,
          low: void 0,
          referenceValue: 0,
          chartPadding: { top: 15, right: 15, bottom: 5, left: 10 },
          seriesBarDistance: 15,
          stackBars: !1,
          stackMode: "accumulate",
          horizontalBars: !1,
          distributeSeries: !1,
          reverseData: !1,
          showGridBackground: !1,
          classNames: {
            chart: "ct-chart-bar",
            horizontalBars: "ct-horizontal-bars",
            label: "ct-label",
            labelGroup: "ct-labels",
            series: "ct-series",
            bar: "ct-bar",
            grid: "ct-grid",
            gridGroup: "ct-grids",
            gridBackground: "ct-grid-background",
            vertical: "ct-vertical",
            horizontal: "ct-horizontal",
            start: "ct-start",
            end: "ct-end"
          }
        };
        i.Bar = i.Base.extend({
          constructor: function(t, e, r, o) {
            i.Bar.super.constructor.call(this, t, e, n, i.extend({}, n, r), o);
          },
          createChart: function(t) {
            var e, r;
            t.distributeSeries
              ? ((e = i.normalizeData(
                  this.data,
                  t.reverseData,
                  t.horizontalBars ? "x" : "y"
                )).normalized.series = e.normalized.series.map(function(t) {
                  return [t];
                }))
              : (e = i.normalizeData(
                  this.data,
                  t.reverseData,
                  t.horizontalBars ? "x" : "y"
                )),
              (this.svg = i.createSvg(
                this.container,
                t.width,
                t.height,
                t.classNames.chart +
                  (t.horizontalBars ? " " + t.classNames.horizontalBars : "")
              ));
            var o = this.svg.elem("g").addClass(t.classNames.gridGroup),
              s = this.svg.elem("g"),
              a = this.svg.elem("g").addClass(t.classNames.labelGroup);
            if (t.stackBars && 0 !== e.normalized.series.length) {
              var l = i.serialMap(e.normalized.series, function() {
                return Array.prototype.slice
                  .call(arguments)
                  .map(function(t) {
                    return t;
                  })
                  .reduce(
                    function(t, e) {
                      return {
                        x: t.x + (e && e.x) || 0,
                        y: t.y + (e && e.y) || 0
                      };
                    },
                    { x: 0, y: 0 }
                  );
              });
              r = i.getHighLow([l], t, t.horizontalBars ? "x" : "y");
            } else
              r = i.getHighLow(
                e.normalized.series,
                t,
                t.horizontalBars ? "x" : "y"
              );
            (r.high = +t.high || (0 === t.high ? 0 : r.high)),
              (r.low = +t.low || (0 === t.low ? 0 : r.low));
            var c,
              h,
              u,
              d,
              p,
              f = i.createChartRect(this.svg, t, n.padding);
            (h =
              t.distributeSeries && t.stackBars
                ? e.normalized.labels.slice(0, 1)
                : e.normalized.labels),
              t.horizontalBars
                ? ((c = d =
                    void 0 === t.axisX.type
                      ? new i.AutoScaleAxis(
                          i.Axis.units.x,
                          e.normalized.series,
                          f,
                          i.extend({}, t.axisX, {
                            highLow: r,
                            referenceValue: 0
                          })
                        )
                      : t.axisX.type.call(
                          i,
                          i.Axis.units.x,
                          e.normalized.series,
                          f,
                          i.extend({}, t.axisX, {
                            highLow: r,
                            referenceValue: 0
                          })
                        )),
                  (u = p =
                    void 0 === t.axisY.type
                      ? new i.StepAxis(i.Axis.units.y, e.normalized.series, f, {
                          ticks: h
                        })
                      : t.axisY.type.call(
                          i,
                          i.Axis.units.y,
                          e.normalized.series,
                          f,
                          t.axisY
                        )))
                : ((u = d =
                    void 0 === t.axisX.type
                      ? new i.StepAxis(i.Axis.units.x, e.normalized.series, f, {
                          ticks: h
                        })
                      : t.axisX.type.call(
                          i,
                          i.Axis.units.x,
                          e.normalized.series,
                          f,
                          t.axisX
                        )),
                  (c = p =
                    void 0 === t.axisY.type
                      ? new i.AutoScaleAxis(
                          i.Axis.units.y,
                          e.normalized.series,
                          f,
                          i.extend({}, t.axisY, {
                            highLow: r,
                            referenceValue: 0
                          })
                        )
                      : t.axisY.type.call(
                          i,
                          i.Axis.units.y,
                          e.normalized.series,
                          f,
                          i.extend({}, t.axisY, {
                            highLow: r,
                            referenceValue: 0
                          })
                        )));
            var m = t.horizontalBars
                ? f.x1 + c.projectValue(0)
                : f.y1 - c.projectValue(0),
              g = [];
            u.createGridAndLabels(
              o,
              a,
              this.supportsForeignObject,
              t,
              this.eventEmitter
            ),
              c.createGridAndLabels(
                o,
                a,
                this.supportsForeignObject,
                t,
                this.eventEmitter
              ),
              t.showGridBackground &&
                i.createGridBackground(
                  o,
                  f,
                  t.classNames.gridBackground,
                  this.eventEmitter
                ),
              e.raw.series.forEach(
                function(n, r) {
                  var o,
                    a,
                    l = r - (e.raw.series.length - 1) / 2;
                  (o =
                    t.distributeSeries && !t.stackBars
                      ? u.axisLength / e.normalized.series.length / 2
                      : t.distributeSeries && t.stackBars
                        ? u.axisLength / 2
                        : u.axisLength / e.normalized.series[r].length / 2),
                    (a = s.elem("g")).attr({
                      "ct:series-name": n.name,
                      "ct:meta": i.serialize(n.meta)
                    }),
                    a.addClass(
                      [
                        t.classNames.series,
                        n.className ||
                          t.classNames.series + "-" + i.alphaNumerate(r)
                      ].join(" ")
                    ),
                    e.normalized.series[r].forEach(
                      function(s, h) {
                        var v, y, b, _;
                        if (
                          ((_ =
                            t.distributeSeries && !t.stackBars
                              ? r
                              : t.distributeSeries && t.stackBars
                                ? 0
                                : h),
                          (v = t.horizontalBars
                            ? {
                                x:
                                  f.x1 +
                                  c.projectValue(
                                    s && s.x ? s.x : 0,
                                    h,
                                    e.normalized.series[r]
                                  ),
                                y:
                                  f.y1 -
                                  u.projectValue(
                                    s && s.y ? s.y : 0,
                                    _,
                                    e.normalized.series[r]
                                  )
                              }
                            : {
                                x:
                                  f.x1 +
                                  u.projectValue(
                                    s && s.x ? s.x : 0,
                                    _,
                                    e.normalized.series[r]
                                  ),
                                y:
                                  f.y1 -
                                  c.projectValue(
                                    s && s.y ? s.y : 0,
                                    h,
                                    e.normalized.series[r]
                                  )
                              }),
                          u instanceof i.StepAxis &&
                            (u.options.stretch ||
                              (v[u.units.pos] +=
                                o * (t.horizontalBars ? -1 : 1)),
                            (v[u.units.pos] +=
                              t.stackBars || t.distributeSeries
                                ? 0
                                : l *
                                  t.seriesBarDistance *
                                  (t.horizontalBars ? -1 : 1))),
                          (b = g[h] || m),
                          (g[h] = b - (m - v[u.counterUnits.pos])),
                          void 0 !== s)
                        ) {
                          var x = {};
                          (x[u.units.pos + "1"] = v[u.units.pos]),
                            (x[u.units.pos + "2"] = v[u.units.pos]),
                            !t.stackBars ||
                            ("accumulate" !== t.stackMode && t.stackMode)
                              ? ((x[u.counterUnits.pos + "1"] = m),
                                (x[u.counterUnits.pos + "2"] =
                                  v[u.counterUnits.pos]))
                              : ((x[u.counterUnits.pos + "1"] = b),
                                (x[u.counterUnits.pos + "2"] = g[h])),
                            (x.x1 = Math.min(Math.max(x.x1, f.x1), f.x2)),
                            (x.x2 = Math.min(Math.max(x.x2, f.x1), f.x2)),
                            (x.y1 = Math.min(Math.max(x.y1, f.y2), f.y1)),
                            (x.y2 = Math.min(Math.max(x.y2, f.y2), f.y1));
                          var w = i.getMetaData(n, h);
                          (y = a
                            .elem("line", x, t.classNames.bar)
                            .attr({
                              "ct:value": [s.x, s.y]
                                .filter(i.isNumeric)
                                .join(","),
                              "ct:meta": i.serialize(w)
                            })),
                            this.eventEmitter.emit(
                              "draw",
                              i.extend(
                                {
                                  type: "bar",
                                  value: s,
                                  index: h,
                                  meta: w,
                                  series: n,
                                  seriesIndex: r,
                                  axisX: d,
                                  axisY: p,
                                  chartRect: f,
                                  group: a,
                                  element: y
                                },
                                x
                              )
                            );
                        }
                      }.bind(this)
                    );
                }.bind(this)
              ),
              this.eventEmitter.emit("created", {
                bounds: c.bounds,
                chartRect: f,
                axisX: d,
                axisY: p,
                svg: this.svg,
                options: t
              });
          }
        });
      })(window, document, t),
      (function(t, e, i) {
        "use strict";
        var n = {
          width: void 0,
          height: void 0,
          chartPadding: 5,
          classNames: {
            chartPie: "ct-chart-pie",
            chartDonut: "ct-chart-donut",
            series: "ct-series",
            slicePie: "ct-slice-pie",
            sliceDonut: "ct-slice-donut",
            sliceDonutSolid: "ct-slice-donut-solid",
            label: "ct-label"
          },
          startAngle: 0,
          total: void 0,
          donut: !1,
          donutSolid: !1,
          donutWidth: 60,
          showLabel: !0,
          labelOffset: 0,
          labelPosition: "inside",
          labelInterpolationFnc: i.noop,
          labelDirection: "neutral",
          reverseData: !1,
          ignoreEmptyValues: !1
        };
        function r(t, e, i) {
          var n = e.x > t.x;
          return (n && "explode" === i) || (!n && "implode" === i)
            ? "start"
            : (n && "implode" === i) || (!n && "explode" === i)
              ? "end"
              : "middle";
        }
        i.Pie = i.Base.extend({
          constructor: function(t, e, r, o) {
            i.Pie.super.constructor.call(this, t, e, n, i.extend({}, n, r), o);
          },
          createChart: function(t) {
            var e,
              o,
              s,
              a,
              l,
              c = i.normalizeData(this.data),
              h = [],
              u = t.startAngle;
            (this.svg = i.createSvg(
              this.container,
              t.width,
              t.height,
              t.donut ? t.classNames.chartDonut : t.classNames.chartPie
            )),
              (o = i.createChartRect(this.svg, t, n.padding)),
              (s = Math.min(o.width() / 2, o.height() / 2)),
              (l =
                t.total ||
                c.normalized.series.reduce(function(t, e) {
                  return t + e;
                }, 0));
            var d = i.quantity(t.donutWidth);
            "%" === d.unit && (d.value *= s / 100),
              (s -= t.donut && !t.donutSolid ? d.value / 2 : 0),
              (a =
                "outside" === t.labelPosition || (t.donut && !t.donutSolid)
                  ? s
                  : "center" === t.labelPosition
                    ? 0
                    : t.donutSolid
                      ? s - d.value / 2
                      : s / 2),
              (a += t.labelOffset);
            var p = { x: o.x1 + o.width() / 2, y: o.y2 + o.height() / 2 },
              f =
                1 ===
                c.raw.series.filter(function(t) {
                  return t.hasOwnProperty("value") ? 0 !== t.value : 0 !== t;
                }).length;
            c.raw.series.forEach(
              function(t, e) {
                h[e] = this.svg.elem("g", null, null);
              }.bind(this)
            ),
              t.showLabel && (e = this.svg.elem("g", null, null)),
              c.raw.series.forEach(
                function(n, o) {
                  if (0 !== c.normalized.series[o] || !t.ignoreEmptyValues) {
                    h[o].attr({ "ct:series-name": n.name }),
                      h[o].addClass(
                        [
                          t.classNames.series,
                          n.className ||
                            t.classNames.series + "-" + i.alphaNumerate(o)
                        ].join(" ")
                      );
                    var m = l > 0 ? u + (c.normalized.series[o] / l) * 360 : 0,
                      g = Math.max(0, u - (0 === o || f ? 0 : 0.2));
                    m - g >= 359.99 && (m = g + 359.99);
                    var v,
                      y,
                      b,
                      _ = i.polarToCartesian(p.x, p.y, s, g),
                      x = i.polarToCartesian(p.x, p.y, s, m),
                      w = new i.Svg.Path(!t.donut || t.donutSolid)
                        .move(x.x, x.y)
                        .arc(s, s, 0, m - u > 180, 0, _.x, _.y);
                    t.donut
                      ? t.donutSolid &&
                        ((b = s - d.value),
                        (v = i.polarToCartesian(
                          p.x,
                          p.y,
                          b,
                          u - (0 === o || f ? 0 : 0.2)
                        )),
                        (y = i.polarToCartesian(p.x, p.y, b, m)),
                        w.line(v.x, v.y),
                        w.arc(b, b, 0, m - u > 180, 1, y.x, y.y))
                      : w.line(p.x, p.y);
                    var k = t.classNames.slicePie;
                    t.donut &&
                      ((k = t.classNames.sliceDonut),
                      t.donutSolid && (k = t.classNames.sliceDonutSolid));
                    var C = h[o].elem("path", { d: w.stringify() }, k);
                    if (
                      (C.attr({
                        "ct:value": c.normalized.series[o],
                        "ct:meta": i.serialize(n.meta)
                      }),
                      t.donut &&
                        !t.donutSolid &&
                        (C._node.style.strokeWidth = d.value + "px"),
                      this.eventEmitter.emit("draw", {
                        type: "slice",
                        value: c.normalized.series[o],
                        totalDataSum: l,
                        index: o,
                        meta: n.meta,
                        series: n,
                        group: h[o],
                        element: C,
                        path: w.clone(),
                        center: p,
                        radius: s,
                        startAngle: u,
                        endAngle: m
                      }),
                      t.showLabel)
                    ) {
                      var S, D;
                      (S =
                        1 === c.raw.series.length
                          ? { x: p.x, y: p.y }
                          : i.polarToCartesian(p.x, p.y, a, u + (m - u) / 2)),
                        (D =
                          c.normalized.labels &&
                          !i.isFalseyButZero(c.normalized.labels[o])
                            ? c.normalized.labels[o]
                            : c.normalized.series[o]);
                      var T = t.labelInterpolationFnc(D, o);
                      if (T || 0 === T) {
                        var M = e
                          .elem(
                            "text",
                            {
                              dx: S.x,
                              dy: S.y,
                              "text-anchor": r(p, S, t.labelDirection)
                            },
                            t.classNames.label
                          )
                          .text("" + T);
                        this.eventEmitter.emit("draw", {
                          type: "label",
                          index: o,
                          group: e,
                          element: M,
                          text: "" + T,
                          x: S.x,
                          y: S.y
                        });
                      }
                    }
                    u = m;
                  }
                }.bind(this)
              ),
              this.eventEmitter.emit("created", {
                chartRect: o,
                svg: this.svg,
                options: t
              });
          },
          determineAnchorPosition: r
        });
      })(window, document, t),
      t
    );
  });
  