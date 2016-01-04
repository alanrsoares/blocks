# blocks
Micro react-like, redux-compatible, plain js library for event-driven ui components


## Example

```javascript
import { h, t, Component } from 'blocks';

class DraftsCounter extends Component {
  constructor() {
    super('#draftsCounter');
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

  render() {
    return h('span', {
      id: 'draftsCounter',
      class: 'headerRibbon'
    }, [ t(this.state.counter) ]);
  }
}

export default new DraftsCounter();

```
