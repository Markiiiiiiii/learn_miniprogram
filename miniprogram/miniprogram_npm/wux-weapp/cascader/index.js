"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames = _interopRequireDefault(require("../helpers/classNames")),
    _arrayTreeFilter = _interopRequireDefault(require("../helpers/arrayTreeFilter"));

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    }
}

function _defineProperty(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e
}

function _toConsumableArray(e) {
    return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance")
}

function _iterableToArray(e) {
    if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
}

function _arrayWithoutHoles(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = new Array(e.length); t < e.length; t++) a[t] = e[t];
        return a
    }
}
var WUX_CASCADER = "wux-cascader",
    defaultFieldNames = {
        label: "label",
        value: "value",
        children: "children"
    };
(0, _baseComponent.default)({
    externalClasses: ["wux-scroll-view-class"],
    properties: {
        prefixCls: {
            type: String,
            value: "wux-cascader"
        },
        defaultValue: {
            type: Array,
            value: []
        },
        value: {
            type: Array,
            value: [],
            observer: function (e) {
                var t = this;
                this.data.controlled && this.setData({
                    activeValue: e
                }, function () {
                    return t.getCurrentOptions(e)
                })
            }
        },
        controlled: {
            type: Boolean,
            value: !1
        },
        title: {
            type: String,
            value: ""
        },
        options: {
            type: Array,
            value: [],
            observer: "getCurrentOptions"
        },
        chooseTitle: {
            type: String,
            value: "请选择"
        },
        visible: {
            type: Boolean,
            value: !1
        },
        defaultFieldNames: {
            type: Object,
            value: defaultFieldNames
        }
    },
    data: {
        activeOptions: [],
        activeIndex: 0,
        bodyStyle: "",
        activeValue: [],
        showOptions: [],
        fieldNames: {}
    },
    computed: {
        classes: ["prefixCls", function (e) {
            return {
                wrap: (0, _classNames.default)(e),
                hd: "".concat(e, "__hd"),
                title: "".concat(e, "__title"),
                menus: "".concat(e, "__menus"),
                menu: "".concat(e, "__menu"),
                bd: "".concat(e, "__bd"),
                inner: "".concat(e, "__inner"),
                scrollView: "".concat(e, "__scroll-view"),
                option: "".concat(e, "__option"),
                item: "".concat(e, "__item"),
                icon: "".concat(e, "__icon"),
                ft: "".concat(e, "__ft")
            }
        }]
    },
    methods: {
        getActiveOptions: function (a) {
            var e = this.data.options,
                n = this.getFieldName("value"),
                t = this.getFieldName("children");
            return (0, _arrayTreeFilter.default)(e, function (e, t) {
                return e[n] === a[t]
            }, {
                childrenKeyName: t
            })
        },
        getShowOptions: function (e) {
            var t = this.data.options,
                a = this.getFieldName("children"),
                n = this.getActiveOptions(e).map(function (e) {
                    return e[a]
                }).filter(function (e) {
                    return !!e
                });
            return [t].concat(_toConsumableArray(n))
        },
        getMenus: function (e, t) {
            var a = 0 < arguments.length && void 0 !== e ? e : [],
                n = 1 < arguments.length ? t : void 0,
                i = this.data,
                r = (i.options, i.chooseTitle),
                o = this.getActiveOptions(a);
            if (n) {
                var l, s = this.getFieldName("value"),
                    u = this.getFieldName("label");
                o.push((_defineProperty(l = {}, s, WUX_CASCADER), _defineProperty(l, u, r), l))
            }
            return o
        },
        getNextActiveValue: function (e, t) {
            var a = this.data.activeValue;
            return (a = a.slice(0, t + 1))[t] = e, a
        },
        updated: function (e, t, a, n) {
            var i = this.getFieldName("value"),
                r = this.getFieldName("children"),
                o = e[r] && 0 < e[r].length,
                l = this.getNextActiveValue(e[i], t),
                s = this.getMenus(l, o),
                u = s.length - 1,
                c = this.getShowOptions(l),
                d = {
                    activeValue: l,
                    activeOptions: s,
                    activeIndex: u,
                    showOptions: c
                };
            (o || l.length === c.length && (t = Math.max(0, t - 1))) && (d.bodyStyle = "transform: translate(".concat(-50 * t, "%)"), d.showOptions = c), a && this.setData(d), "function" == typeof n && n.call(this, e, s, !o)
        },
        getCurrentOptions: function (e) {
            var t = 0 < arguments.length && void 0 !== e ? e : this.data.activeValue,
                a = Math.max(0, t.length - 1),
                n = this.getActiveOptions(t),
                i = n[a];
            if (i) this.updated(i, a, !0);
            else {
                var r, o = this.getFieldName("value"),
                    l = this.getFieldName("label");
                n.push((_defineProperty(r = {}, o, WUX_CASCADER), _defineProperty(r, l, this.data.chooseTitle), r));
                var s = {
                    showOptions: this.getShowOptions(t),
                    activeOptions: n,
                    activeIndex: n.length - 1,
                    bodyStyle: ""
                };
                this.setData(s)
            }
        },
        onMenuClick: function (e) {
            var t = e.currentTarget.dataset.menuIndex,
                a = "transform: translate(".concat(-50 * (1 < t ? t - 1 : 0), "%)");
            this.setData({
                bodyStyle: a,
                activeIndex: t
            })
        },
        onItemSelect: function (e) {
            var t = e.currentTarget.dataset,
                a = t.item,
                n = t.optionIndex;
            a && !a.disabled && this.updated(a, n, !this.data.controlled, this.onChange)
        },
        onPopupClose: function () {
            this.triggerEvent("close")
        },
        onChange: function (e, t, a) {
            var n = this,
                i = 0 < arguments.length && void 0 !== e ? e : {},
                r = 2 < arguments.length && void 0 !== a && a,
                o = (1 < arguments.length && void 0 !== t ? t : []).filter(function (e) {
                    return e[n.getFieldName("value")] !== WUX_CASCADER
                }),
                l = o.map(function (e) {
                    return e[n.getFieldName("value")]
                });
            if (!1 === i.isLeaf && !i.children) return this.emitEvent({
                value: l,
                options: o,
                done: !1
            }), void this.triggerEvent("load", {
                value: l,
                options: o
            });
            this.emitEvent({
                value: l,
                options: o,
                done: r
            })
        },
        emitEvent: function (e) {
            var t = 0 < arguments.length && void 0 !== e ? e : {};
            this.triggerEvent("change", t), t.done && this.onPopupClose()
        },
        getFieldName: function (e) {
            return this.data.fieldNames[e]
        }
    },
    attached: function () {
        var e = this,
            t = this.data,
            a = t.defaultValue,
            n = t.value,
            i = t.controlled ? n : a,
            r = Object.assign({}, defaultFieldNames, this.data.defaultFieldNames);
        this.setData({
            activeValue: i,
            fieldNames: r
        }, function () {
            return e.getCurrentOptions(i)
        })
    }
});