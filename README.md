# blocks
Micro react-like, redux-compatible, plain js library for event-driven ui components


## Examples

> A simple component

```javascript
import { h, t, Component } from 'blocks'

class Hello extends Component {
  constructor() {
    super('#hello')
  }
  render({ name }) {
    return h('span', {}, [ t(`Hello, ${ name }`) ])
  }
}
```

> A component with lifecycle callbacks

```javascript
import { h, t, Component } from 'blocks'

class Counter extends Component {
  constructor() {
    super('#counter')
  }

  increase() {
    this.setState({ counter: this.state.counter + 1 })
  }

  decrease() {
    this.setState({ counter: this.state.counter - 1 })
  }

  render({ counter }) {
    return h('span', {
      class: 'ribbon'
    }, [ t(counter) ])
  }
}

```


> A slightly complex counter

Check out a [live exmaple](http://jsbin.com/faquhizoxi/edit?js,output) (hit `Run with JS`)

```javascript
import { h, t, Component } from 'blocks'

const KEYS = {
  UP: 38,
  DOWN: 40
}

const button = (label, onClick) =>
  h('button', { onClick }, [t(label)])

const counter = (n = 0) =>
  h('div', {
    class: 'counter',
    style: `
      color: ${ n > 0 ? '#3c3' : '#c33' }
      background: ${ n > 0 ? '#cfc' : '#fcc' }
    `
  }, [t(n)])

const flip = () => Math.random() < .5

class App extends Component {
  constructor() {
    super('#app')
  }

  onMount() {
    document.addEventListener('keyup', (e) => {
      switch(e.which) {
        case KEYS.UP:
          this.inc()
          break
        case KEYS.DOWN:
          this.dec()
          break
      }
    })

    this.state.interval = setInterval(() => flip() ? this.inc() : this.dec(), 1000)
  }

  onUnmount() {
    this.state.interval = clearInterval(this.state.interval)
  }

  inc() {
    this.setState({ count: this.state.count + 1})
  }

  dec() {
    this.setState({ count: this.state.count - 1})    
  }

  render({ count }) {
    return h('div', { class: 'app' }, [
      button('-', this.dec.bind(this)),
      counter(count),
      button('+', this.inc.bind(this))
    ])
  }
}
```
