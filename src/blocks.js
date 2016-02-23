export const $ = query =>
  (els => els.length > 1 ? els : els[0])(document.querySelectorAll(query))

export const replace = (prev, next) =>
  prev.parentNode.replaceChild(next, prev, next)

export const remove = e => e.parentNode.removeChild(e)

export const setAttrs = (el, attrs = {}) =>
  Object.keys(attrs).reduce((e, key) => {
    const EVENT = /^on([A-Z]\w+)$/
    if (EVENT.test(key))
      e.addEventListener(key.match(EVENT)[1].toLowerCase(), attrs[key])
    else
      e.setAttribute(key, attrs[key])
    return e
  }, el)

export const append = (el, children) =>
  children.reduce((e, child, i) => {
    const id = x => x.getAttribute('data-blocks-id')
    const withId = x => id(x) ? x : setAttrs(x, { 'data-blocks-id': `${id(el) || '_1'}.${i}` })

    if (child instanceof HTMLElement)
      e.appendChild(withId(child))
    else
      e.appendChild(document.createTextNode(`${child}`))
    return e
  }, el)

const className = componentClass => `_${componentClass}`.match(/function ([A-Z]\w+)/)[1]

const isFunction = x =>
  typeof x === 'function'

const callIfExist = (f, context) =>
  isFunction(f) && f.bind(context)()

export const dom = (tag, attrs, ...children) => {
  const e = (typeof tag === 'function')
    ? new tag(className(tag), (attrs ? attrs : {}), ...children).render()
    : document.createElement(tag)

  if (children.length === 1 && Array.isArray(children[0])) {
    children = children[0]
  }

  return setAttrs(append(e, children), attrs)
}

export const mount = (componentClass, target, state) =>
  new componentClass(`${target.id + className(componentClass)}`, state).mount(target)

export class Component {
  constructor(id, state, ...children) {
    this.id = id
    this.state = { ...state }
    this.children = children
  }

  get self() {
    return $(`[data-blocks-id=${this.id}]`)
  }

  get renderedElement() {
    return setAttrs(this.render(this.state), {
      'data-blocks-id': this.id
    })
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
