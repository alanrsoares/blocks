import merge from 'prelude-es6/Obj/merge';

export const $ = (q) => {
  const els = document.querySelectorAll(q);
  return els.length > 1 ? els : els[0];
};

export const append = (e, children) => {
  children.forEach((child) => e.appendChild(child));
  return e;
};

export const replace = (prev, next) =>
  prev.parentNode.replaceChild(next, prev, next);

export const remove = (e) => e.parentNode.removeChild(e);

export const setAttrs = (el, attrs) => {
  const set = (key) => {
    const EVENT = /^on([A-Z]\w+)$/;
    if (EVENT.test(key))
      el.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key]);
    else
      el.setAttribute(key, attrs[key]);
  };

  Object.keys(attrs).forEach(set);

  return el;
};

export const h = (tag, attrs = {}, children = []) =>
  setAttrs(append(document.createElement(tag), children), attrs);

export const t = (text) => document.createTextNode(text);

const isFunction = (x) => typeof x === 'function';

export class Component {
  constructor(selector) {
    this.target = null;
    this.selector = selector;
    this.state = {};
  }

  get self() {
    return $(this.selector);
  }

  get renderedElement() {
    return setAttrs(this.render(), { id: this.selector.substr(1) });
  }

  mount(target, props = {}) {
    this.unmount();
    this.target = target;
    this.state = merge({}, props);
    if (isFunction(this.onMount)) { this.onMount(); }
    append(this.target, [this.renderedElement]);
  }

  unmount() {
    if (isFunction(this.onUnmount)) { this.onUnmount(); }
    if (this.self) { remove(this.self); }
  }

  setState(partial = {}) {
    this.state = merge({}, this.state, partial);
    this.update();
  }

  update() {
    if (isFunction(this.onUpdate)) { this.onUpdate(this.state); }

    if (this.self) {
      this.mount(this.target, this.state);
    }
  }
}
