const _ID = 'blocks-id'

export const $ = query =>
  (els => els.length > 1 ? els : els[0])(document.querySelectorAll(query))

export const replace = (prev, next) =>
  prev.parentNode.replaceChild(next, prev, next)

export const remove = e => e.parentNode.removeChild(e)

export const setAttrs = (el, attrs) =>
  Object.keys(attrs || {}).reduce((e, key) => {
    const EVENT = /^on([A-Z]\w+)$/
    if (EVENT.test(key))
      e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key])
    else
      e.setAttribute(key, attrs[key])
    return e
  }, el)

export const append = (el, children) =>
  children.reduce((e, child, i) => {
    if (child instanceof HTMLElement)
      e.appendChild(child)
    else
      e.appendChild(document.createTextNode(`${child}`))
    return e
  }, el)

export const dumpHTML = e =>
  append(document.createElement('div'), [e]).innerHTML

export const mount = (componentClass, target, props) =>
  new componentClass(`${target.id + className(componentClass)}`, props).mount(target)

const className = componentClass => `_${componentClass}`.match(/function ([A-Z]\w+)/)[1]

const isFunction = x => typeof x === 'function'

const callIfExist = (f, context) => isFunction(f) && f.bind(context)()

const isUnit = x => (typeof x === 'string' || typeof x === 'number')

const toArray = x => Object.keys(x).map(k => x[k])

const child = attrs => (el, i) => {
  if (isUnit(el)) return el

  const _attrs = {
    ...el.attrs,
    [_ID]: attrs[_ID] + '.' + i
  }

  return {
    ...el,
    attrs: _attrs,
    children: (el.children || []).map(child(_attrs))
  }
}

export function dom (tag, attrs, ...children) {
  const e = (typeof tag === 'function')
    ? new tag(className(tag), (attrs || {}), ...children).render()
    : document.createElement(tag)

  if (children.length === 1 && Array.isArray(children[0])) {
    children = children[0]
  }

  return setAttrs(append(e, children), attrs)
}

export function h (tag, attrs, ...children) {
  const _attrs = { ...attrs, [_ID]: '1' }

  return {
    tag,
    attrs: _attrs,
    children: children.map(child(_attrs))
  }
}

export function render (el) {
  if (isUnit(el)) return el

  let { tag, attrs, children = [] } = el

  if (children.length === 1 && !isUnit(children[0])) {
    children = toArray(children[0])
  }

  const e = (typeof tag === 'function')
    ? new tag(className(tag), (attrs || {}), ...children).renderedElement
    : append(setAttrs(document.createElement(tag), attrs), children.map(render))

  return e
}

export class Component {
  constructor(id, props, ...children) {
    this.id = id
    this.props = { ...props }
    this.state = {}
    this.children = children
  }

  get self() {
    return $(`[${_ID}=${this.id}]`)
  }

  get renderedElement() {
    return render(this.render(this.props))
  }

  valueOf() {
    return this.renderedElement
  }

  setState(partial = {}) {
    this.state = { ...this.state, ...partial }
    this.update()
  }

  mount(target) {
    this.unmount()
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
