# blocks
Micro react-like, redux-compatible, plain js library for event-driven ui components


## Examples

> A simple component

```javascript
import { h, t, Component } from 'blocks';

class Hello extends Component {
  constructor() {
    super('#hello')
  }
  render({ name }) {
    return h('span', {}, [ t(`Hello, ${ name }`) ]);
  }
}
```

> A component with lifecycle callbacks

```javascript
import { h, t, Component } from 'blocks';

class Counter extends Component {
  constructor() {
    super('#counter');
  }

  increase() {
    this.setState({ counter: this.state.counter + 1 });
  }

  decrease() {
    this.setState({ counter: this.state.counter - 1 });
  }

  onUpdate({ counter }) {
    if (!counter) {
      this.unmount();
    }
  }

  render({ counter }) {
    return h('span', {
      class: 'ribbon'
    }, [ t(counter) ]);
  }
}

```
