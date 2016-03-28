'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _blocks = blocks;
var Component = _blocks.Component;
var $ = _blocks.$;
var mount = _blocks.mount;
var dom = _blocks.dom;
var setAttrs = _blocks.setAttrs;
var append = _blocks.append;

// enable jsx resolution

var React = {
  createElement: dom
};

var headsOrTails = function headsOrTails() {
  return Math.random() < .5;
};

var range = function range(n) {
  return [].concat(_toConsumableArray(Array(Math.max(0, n))));
};

var grid = function grid(n) {
  return range(n).map(function (y) {
    return range(Math.ceil(n / 2)).map(function (x) {
      return +headsOrTails();
    });
  });
};

var mirror = function mirror(xss) {
  return xss.map(function (xs) {
    return xs.concat(xs.slice().reverse().slice(1));
  });
};

var randomInt = function randomInt() {
  var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var max = arguments.length <= 1 || arguments[1] === undefined ? 255 : arguments[1];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomColor = function randomColor() {
  return 'rgb(' + randomInt() + ', ' + randomInt() + ', ' + randomInt() + ')';
};

var GithubAvatar = function (_Component) {
  _inherits(GithubAvatar, _Component);

  function GithubAvatar() {
    _classCallCheck(this, GithubAvatar);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GithubAvatar).apply(this, arguments));
  }

  _createClass(GithubAvatar, [{
    key: 'render',
    value: function render() {
      return dom(
        'div',
        { 'class': 'grid' },
        this.renderRows(this.state.grid)
      );
    }
  }, {
    key: 'renderRows',
    value: function renderRows(rows) {
      var _this2 = this;

      return rows.map(function (cells) {
        return dom(
          'div',
          { 'class': 'row' },
          _this2.renderCells(cells)
        );
      });
    }
  }, {
    key: 'renderCells',
    value: function renderCells(cells) {
      return cells.map(this.renderCell.bind(this));
    }
  }, {
    key: 'renderCell',
    value: function renderCell(cell) {
      var style = '\n      background-color: ' + (cell ? this.state.color : '#F0F0F0') + '\n    ';
      return dom('div', {
        'class': 'cell',
        style: style });
    }
  }]);

  return GithubAvatar;
}(Component);

var makeAvatar = function makeAvatar() {
  return dom(GithubAvatar, {
    color: randomColor(),
    grid: mirror(grid(5))
  });
};

var App = function (_Component2) {
  _inherits(App, _Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var users = this.state.users;

      return dom(
        'div',
        { 'class': 'app' },
        dom(
          'div',
          { 'class': 'header' },
          dom(
            'div',
            { 'class': 'title' },
            'Users'
          ),
          dom(
            'div',
            { 'class': 'number' },
            users,
            '‣'
          )
        ),
        dom(
          'div',
          { 'class': 'container' },
          range(users).map(makeAvatar)
        )
      );
    }
  }]);

  return App;
}(Component);

mount(App, $('#appContainer'), { users: 30 });