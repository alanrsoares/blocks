'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.render = render;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ID = 'blocks-id';

var $ = exports.$ = function $(query) {
  return (function (els) {
    return els.length > 1 ? els : els[0];
  })(document.querySelectorAll(query));
};

var replace = exports.replace = function replace(prev, next) {
  return prev.parentNode.replaceChild(next, prev, next);
};

var remove = exports.remove = function remove(e) {
  return e.parentNode.removeChild(e);
};

var setAttrs = exports.setAttrs = function setAttrs(el, attrs) {
  return Object.keys(attrs || {}).reduce(function (e, key) {
    var EVENT = /^on([A-Z]\w+)$/;
    if (EVENT.test(key)) e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key]);else e.setAttribute(key, attrs[key]);
    return e;
  }, el);
};

var append = exports.append = function append(el, children) {
  return children.reduce(function (e, child, i) {
    if (child instanceof HTMLElement) e.appendChild(child);else e.appendChild(document.createTextNode('' + child));
    return e;
  }, el);
};

var dumpHTML = exports.dumpHTML = function dumpHTML(e) {
  return append(document.createElement('div'), [e]).innerHTML;
};

var mount = exports.mount = function mount(componentClass, target, props) {
  return new componentClass('' + (target.id + className(componentClass)), props).mount(target);
};

var className = function className(componentClass) {
  return ('_' + componentClass).match(/function ([A-Z]\w+)/)[1];
};

var isFunction = function isFunction(x) {
  return typeof x === 'function';
};

var callIfExist = function callIfExist(f, context) {
  return isFunction(f) && f.bind(context)();
};

var isUnit = function isUnit(x) {
  return typeof x === 'string' || typeof x === 'number';
};

var toArray = function toArray(x) {
  return Object.keys(x).map(function (k) {
    return x[k];
  });
};

var child = function child(attrs) {
  return function (el, i) {
    if (isUnit(el)) return el;

    var _attrs = _extends({}, el.attrs, _defineProperty({}, _ID, attrs[_ID] + '.' + i));

    return _extends({}, el, {
      attrs: _attrs,
      children: (el.children || []).map(child(_attrs))
    });
  };
};

function h(tag, attrs) {
  var _attrs = _extends({}, attrs, _defineProperty({}, _ID, '1'));

  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: _attrs,
    children: children.map(child(_attrs))
  };
}

function render(el) {
  if (isUnit(el)) return el;

  var tag = el.tag;
  var attrs = el.attrs;
  var _el$children = el.children;
  var children = _el$children === undefined ? [] : _el$children;

  if (children.length === 1 && !isUnit(children[0])) {
    children = toArray(children[0]);
  }

  var e = typeof tag === 'function' ? new (Function.prototype.bind.apply(tag, [null].concat([className(tag), attrs || {}], _toConsumableArray(children))))().renderedElement : append(setAttrs(document.createElement(tag), attrs), children.map(render));

  return e;
}

var Component = exports.Component = (function () {
  function Component(id, props) {
    _classCallCheck(this, Component);

    this.id = id;
    this.props = _extends({}, props);
    this.state = {};

    for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      children[_key2 - 2] = arguments[_key2];
    }

    this.children = children;
  }

  _createClass(Component, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.renderedElement;
    }
  }, {
    key: 'setState',
    value: function setState() {
      var partial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.state = _extends({}, this.state, partial);
      this.update();
    }
  }, {
    key: 'mount',
    value: function mount(target) {
      this.unmount();
      callIfExist(this.onMount, this);
      append(target, [this.renderedElement]);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      callIfExist(this.onUnmount, this);
      if (this.self) {
        remove(this.self);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      callIfExist(this.onUpdate, this);
      if (this.self) {
        replace(this.self, this.renderedElement);
      }
    }
  }, {
    key: 'self',
    get: function get() {
      return $('[' + _ID + '=' + this.id + ']');
    }
  }, {
    key: 'renderedElement',
    get: function get() {
      return render(this.render(this.props));
    }
  }]);

  return Component;
})();
