export const $ = (q) => {
  export const els = document.querySelectorAll(q)
  return els.length > 1 ? els : els[0]
}

export const append = (e, children) => {
  children.forEach((child) => e.appendChild(child))
  return e
}

export const replace = (prev, next) =>
  prev.parentNode.replaceChild(next, prev, next)

export const remove = (e) => e.parentNode.removeChild(e)

export const setAttrs = (el, attrs) => {
  const reducer = (e, key) => {
    const EVENT = /^on([A-Z]\w+)$/
    if (EVENT.test(key))
      e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key])
    else
      e.setAttribute(key, attrs[key])
    return e
  }

  return Object.keys(attrs).reduce(reducer, el)
}

export const h = (tag, attrs = {}, children = []) =>
  setAttrs(append(document.createElement(tag), children), attrs)

export const t = (text) => document.createTextNode(text)

export const mount = (componentClass, target, state) => {
  const className = `${componentClass}`.match(/function ([A-Z]\w+)/)[1]
  return new componentClass(`#${target.id}_${className}`).mount(target, state)
}

const isFunction = (x) =>
  typeof x === 'function'

const callIfExist = (f, context) =>
  isFunction(f) && f.bind(context)()

export class Component {
  constructor(selector) {
    this.selector = selector
    this.state = {}
  }

  get self() {
    return $(this.selector)
  }

  get renderedElement() {
    return setAttrs(this.render(this.state), {
      id: this.selector.substr(1)
    })
  }

  setState(partial = {}) {
    this.state = { ...this.state, ...partial }
    this.update()
  }

  mount(target, props = {}) {
    this.unmount()
    this.state = { ...props }
    callIfExist(this.onMount, this)
    append(target, [this.renderedElement])
  }

  unmount() {
    callIfExist(this.onUnmount, this)
    if (this.self) { remove(this.self) }
  }

  update() {
    callIfExist(this.onUpdate, this)
    if (this.self) {
      replace(this.self, this.renderedElement);
    }
  }
}
