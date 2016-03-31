import test from 'ava'
import { h, Component } from '../build'

test('creates a single element node', (t) => {
  const actual = h('hr', null)
  const expected = { tag: 'hr', attrs: { 'data-blocks-id': '1' }, children: [] }
  t.same(actual, expected)
})

test('creates a single element node with attributes', (t) => {
  const actual = h('div', { class: 'myClass' })
  const expected = { tag: 'div', attrs: { 'class': 'myClass', 'data-blocks-id': '1' }, children: [] }
  t.same(actual, expected)
})

test('creates a single element node with a single child', (t) => {
  const actual = h('div', null, ['bar'])
  const expected = { tag: 'div', attrs: { 'data-blocks-id': '1' }, children: ['bar'] }
  t.same(actual, expected)
})

test('creates a single element node with mixed nested nodes', (t) => {
  const actual = h('div', null, ['bar', h('a', { href: '#' }, 'click me')])
  const expected = {
    tag: 'div',
    attrs: { 'data-blocks-id': '1' },
    children: [
      'bar', {
        tag: 'a',
        attrs: { href: '#', 'data-blocks-id': '1.1' },
        children: ['click me']
      }
    ]
  }
  t.same(actual, expected)
})

test('creates a custom component node', (t) => {
  class App extends Component {
    render () {
      h('div')
    }
  }
  const actual = h(App)
  const expected = { tag: App, attrs: { 'data-blocks-id': '1' }, children: [] }
  t.same(actual, expected)
})
