import React from 'react'
import Button from './Button'

const mines = [{"x":4,"y":4},{"x":5,"y":1},{"x":4,"y":5},{"x":0,"y":0},{"x":6,"y":0},{"x":5,"y":2},{"x":8,"y":5},{"x":3,"y":1},{"x":2,"y":4},{"x":0,"y":8}]

const size = 9

const buttons = new Array(size).fill().map((a, i) => {
  return new Array(size).fill({mine: false}).map((b, j) => {
    if (mines.find(mine => mine.x === i && mine.y === j)) {
      return {
        ...b,
        mine: true
      }
    }

    return b
  })
})

console.log(buttons)

const Playground = () => (
  <div>
    {buttons.map(row =>
      <div className="row">
        {row.map(button =>
          <Button {...button}/>
        )}
      </div>
    )}
  </div>
)

export default Playground
