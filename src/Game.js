import React from 'react';
import Board from './Board';

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function normalize(squares, get, set) {
  const length = squares.length;
  let newLine = new Array(length);
  for (let i = 0; i !== length; i++) {
    let occupied = 0;
    for (let j = length - 1; j >= 0; j--) {
      let number = get(squares, i, j);
      if (number) {
        newLine[length - 1 - occupied++] = number;
      }
    }

    for (let j = 0; j !== length; j++) {
      let number = newLine[j];
      set(squares, i, j, number);
      newLine[j] = null;
    }
  }

  return squares;
}

function leftGet(squares, i, j) {
  return squares[i][squares.length - j - 1];
}

function leftSet (squares, i, j, value) {
  squares[i][squares.length - j - 1] = value;
};

function upGet(squares, i, j) {
  const length = squares.length;
  return squares[length - j - 1][i];
}

function upSet(squares, i, j, value) {
  const length = squares.length;
  squares[length - j - 1][i] = value;
};

function rightGet(squares, i, j) {
  return squares[i][j];
}

function rightSet(squares, i, j, value) {
  squares[i][j] = value;
};

function downGet(squares, i, j) {
  return squares[j][i];
}

function downSet(squares, i, j, value) {
  squares[j][i] = value;
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {  
      squares: Array(4).fill().map(() => Array(4).fill(null))
    };

    this.keyPressed = this.keyPressed.bind(this);
  }

  keyPressed(event) {
    const squares = this.state.squares;
    let newSquares = squares.slice();
    switch (event.keyCode){
      case 37:
        newSquares = this.handleLeft(newSquares);
        break;
      case 38:
        newSquares = this.handleUp(newSquares);
        break;
      case 39:
        newSquares = this.handleRight(newSquares);
        break;
      case 40:
        newSquares = this.handleDown(newSquares);
        break;
      default:
        newSquares = this.addNewNumber(newSquares);
        console.log("uh oh");
    }

    this.setState(() => {
      return { squares: newSquares };
    });
  }

  getEmptySquaresCount(squares) {
    let numberOfEmpty = squares.length * squares[0].length;
    for (let i = 0; i !== squares.length; i++) {
      const row = squares[i];
      for (let j = 0; j !== row.length; j++) {
        if (row[j]) {
          numberOfEmpty--;
        }
      }
    }
    console.log(numberOfEmpty);
    return numberOfEmpty;
  }

  addNewNumber(oldSquares) {
    const squares = oldSquares.slice();
    let emptyCount = this.getEmptySquaresCount(squares);
    if (emptyCount === 0)
      return squares;

    let nextNumber = getRndInteger(0, 9) === 9 ? 4 : 2; // 10% chance for 4 to appear
    let nextPosition = getRndInteger(0, emptyCount - 1);

    for (let i = 0; i !== squares.length; i++) {
      const row = squares[i];
      for (let j = 0; j !== row.length; j++) {
        if (row[j]) {
          continue;
        }

        if (nextPosition === 0) {
          squares[i][j] = nextNumber;
          return squares;
        }

        nextPosition--;
      }
    }
  }

  /// TODO PER MATRIX AT ONCE
  normalizeLine(length, get) {
    let newLine = new Array(length).fill(null);
    let occupied = 0;
    for (let i = length - 1; i >= 0; i--) {
      let number = get(i);
      if (number) {
        newLine[length - 1 - occupied++] = number;
      }
    }
    return i => newLine[i];
  }

  handleLeft(newSquares) {
    console.log("left");
    return normalize(newSquares, leftGet, leftSet);
  }

  handleRight(newSquares) {
    console.log("right");
    return normalize(newSquares, rightGet, rightSet);
  }

  handleUp(newSquares) {
    console.log("up");
    return normalize(newSquares, upGet, upSet);
  }

  handleDown(newSquares) {
    console.log("down");
    return normalize(newSquares, downGet, downSet);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyPressed, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyPressed, false);
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
          />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

export default Game;