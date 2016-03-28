const { Component, $, mount, dom, setAttrs, append } = blocks

// enable jsx resolution
const React = {
  createElement: dom
}

const headsOrTails = () => Math.random() < .5

const range = n => [...Array(Math.max(0, n))]

const grid = n => range(n).map(y => range(Math.ceil(n / 2)).map(x => +headsOrTails()))

const mirror = xss => xss.map(xs => xs.concat(xs.slice().reverse().slice(1)))

const randomInt = (min=0, max=255) => Math.floor(Math.random() * (max - min + 1)) + min

const randomColor = () => `rgb(${randomInt()}, ${randomInt()}, ${randomInt()})`

class GithubAvatar extends Component {
  render() {
    return (
      <div class='grid'>
        {this.renderRows(this.state.grid)}
      </div>
    )
  }

  renderRows(rows) {
    return rows.map(cells =>
      <div class='row'>{this.renderCells(cells)}</div>
    )
  }

  renderCells(cells) {
    return cells.map(this.renderCell.bind(this))
  }

  renderCell(cell) {
    const style = `
      background-color: ${ cell ? this.state.color : '#F0F0F0' }
    `
    return (
      <div
        class='cell'
        style={style}>
      </div>
    )
  }
}

const makeAvatar = () => (
  <GithubAvatar
    color={randomColor()}
    grid={mirror(grid(5))}
  />
)

class App extends Component {
  render() {
    const { users } = this.state
    return (
      <div class='app'>
        <div class='header'>
          <div class='title'>
            Users
          </div>
          <div class='number'>
            { users }‣
          </div>
        </div>
        <div class='container'>
          {range(users).map(makeAvatar)}
        </div>
      </div>
    )
  }
}

mount(App, $('#appContainer'), { users: 30 })
