'use strict';

(function (global, factory) {
  console.log(global);
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.blocks = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var $ = exports.$ = function $(q) {
    var els = document.querySelectorAll(q);
    return els.length > 1 ? els : els[0];
  };

  var append = exports.append = function append(e, children) {
    children.forEach(function (child) {
      return e.appendChild(child);
    });
    return e;
  };

  var replace = exports.replace = function replace(prev, next) {
    return prev.parentNode.replaceChild(next, prev, next);
  };

  var remove = exports.remove = function remove(e) {
    return e.parentNode.removeChild(e);
  };

  var setAttrs = exports.setAttrs = function setAttrs(el, attrs) {
    var reducer = function reducer(e, key) {
      var EVENT = /^on([A-Z]\w+)$/;
      if (EVENT.test(key)) e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key]);else e.setAttribute(key, attrs[key]);
      return e;
    };

    return Object.keys(attrs).reduce(reducer, el);
  };

  var h = exports.h = function h(tag) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var children = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    return setAttrs(append(document.createElement(tag), children), attrs);
  };

  var t = exports.t = function t(text) {
    return document.createTextNode(text);
  };

  var mount = exports.mount = function mount(componentClass, target, state) {
    var className = ('' + componentClass).match(/function ([A-Z]\w+)/)[1];
    return new componentClass('#' + target.id + '_' + className).mount(target, state);
  };

  var isFunction = function isFunction(x) {
    return typeof x === 'function';
  };

  var callIfExist = function callIfExist(f, context) {
    return isFunction(f) && f.bind(context)();
  };

  var Component = exports.Component = (function () {
    function Component(selector) {
      _classCallCheck(this, Component);

      this.selector = selector;
      this.state = {};
    }

    _createClass(Component, [{
      key: 'setState',
      value: function setState() {
        var partial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.state = _extends({}, this.state, partial);
        this.update();
      }
    }, {
      key: 'mount',
      value: function mount(target) {
        var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.unmount();
        this.state = _extends({}, props);
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
        return $(this.selector);
      }
    }, {
      key: 'renderedElement',
      get: function get() {
        return setAttrs(this.render(this.state), {
          id: this.selector.substr(1)
        });
      }
    }]);

    return Component;
  })();
});
