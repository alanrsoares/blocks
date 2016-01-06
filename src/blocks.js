export const $ = (query) => {
  const els = document.querySelectorAll(query)
  return els.length > 1 ? els : els[0]
}

export const replace = (prev, next) =>
  prev.parentNode.replaceChild(next, prev, next)

export const remove = (e) => e.parentNode.removeChild(e)

export const append = (el, children) =>
  children.reduce((e, child) => {
    if (child instanceof HTMLElement) {
      e.appendChild(child)
    else
      e.appendChild(document.createTextNode(`${child}`))
    return e
  }, el)

export const setAttrs = (el, attrs) =>
  Object.keys(attrs).reduce((e, key) => {
    const EVENT = /^on([A-Z]\w+)$/
    if (EVENT.test(key))
      e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key])
    else
      e.setAttribute(key, attrs[key])
    return e
  }, el)

export const dom = (tag, attrs = {}, ...children) =>
  setAttrs(append(document.createElement(tag), children), attrs)

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
