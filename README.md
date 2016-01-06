# blocks `[WIP]`
Micro react-like, redux-compatible, plain JS library for event-driven ui components

* minimal
* standard
* pure ES2015

## Examples

> A simple component

```javascript
import { $, mount, h, t, Component } from 'blocks'

const hello = (name) =>
  h('span', {}, [ t(`Hello, ${ name }!`) ])

class Hello extends Component {
  render({ name }) {
    return hello(name)
  }
}

mount(Hello, $('#helloContainer'), { name: 'John Doe' })

```

> A component with lifecycle callbacks

```javascript
import { h, t, Component } from 'blocks'

class Counter extends Component {
  increase() {
    this.setState({ count: this.state.count + 1 })
  }

  decrease() {
    this.setState({ count: this.state.count - 1 })
  }

  render({ count }) {
    return h('span', {
      class: 'ribbon'
    }, [ t(count) ])
  }
}

mount(Hello, $('#counterContainer'), { count: 42 })

```

> A slightly complex counter

Check out a [live exmaple](http://jsbin.com/faquhizoxi/edit?js,output) (hit `Run with JS`)

```javascript
import { h, t, Component } from 'blocks'

const ARROW_KEYS = {
  UP: 38,
  DOWN: 40
}

const button = (label, onClick) =>
  h('button', { onClick }, [t(label)])

const counter = (n = 0) =>
  h('div', {
    class: 'counter',
    style: `
      color: ${ n > 0 ? '#3c3' : '#c33' };
      background: ${ n > 0 ? '#cfc' : '#fcc' };
    `
  }, [t(n)])

const headsOrTails = () => Math.random() < .5

class CounterApp extends Component {
  onMount() {
    document.addEventListener('keyup', (e) => {
      switch(e.which) {
        case ARROW_KEYS.UP:
          this.increase()
          break
        case ARROW_KEYS.DOWN:
          this.decrease()
          break
      }
    })

    this.state.interval = setInterval(this.tick.bind(this), 1000)
  }

  onUnmount() {
    this.state.interval = clearInterval(this.state.interval)
  }

  increase() {
    this.setState({ count: this.state.count + 1})
  }

  decrease() {
    this.setState({ count: this.state.count - 1})    
  }

  tick() {
    return headsOrTails() ? this.increase() : this.decrease()
  }

  render({ count }) {
    return h('div', { class: 'app' }, [
      button('-', this.decrease.bind(this)),
      counter(count),
      button('+', this.increase.bind(this))
    ])
  }
}

mount(CounterApp, $('#appContainer'), { count: 10 })
```
