'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  return Object.keys(attrs).reduce(function (e, key) {
    var EVENT = /^on([A-Z]\w+)$/;
    if (EVENT.test(key)) e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key]);else e.setAttribute(key, attrs[key]);
    return e;
  }, el);
};

var append = exports.append = function append(el, children) {
  return children.reduce(function (e, child, i) {
    var id = function id(x) {
      return x.getAttribute('data-blocks-id');
    };
    var withId = function withId(x) {
      return id(x) ? x : setAttrs(x, { 'data-blocks-id': (id(el) || '_1') + '.' + i });
    };

    if (child instanceof HTMLElement) e.appendChild(withId(child));else e.appendChild(document.createTextNode('' + child));
    return e;
  }, el);
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

var dom = exports.dom = function dom(tag, attrs) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var e = typeof tag === 'function' ? new (Function.prototype.bind.apply(tag, [null].concat([className(tag), attrs || {}], _toConsumableArray(children))))().render() : document.createElement(tag);

  if (children.length === 1 && Array.isArray(children[0])) {
    children = children[0];
  }

  return setAttrs(append(e, children), attrs);
};

var mount = exports.mount = function mount(componentClass, target, state) {
  return new componentClass('' + (target.id + className(componentClass)), state).mount(target);
};

var Component = exports.Component = (function () {
  function Component(id, state) {
    _classCallCheck(this, Component);

    this.id = id;
    this.state = _extends({}, state);

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
      return $('[data-blocks-id=' + this.id + ']');
    }
  }, {
    key: 'renderedElement',
    get: function get() {
      return setAttrs(this.render(this.state), {
        'data-blocks-id': this.id
      });
    }
  }]);

  return Component;
})();
