import React from 'react';
import Board from './Board';
import { handleDown, handleLeft, handleUp, handleRight } from './move_handlers/moves';
import { addNewNumber } from './move_handlers/nextNumber';

class Game extends React.Component {
  constructor(props) {
    super(props);

    let sqr = Array(4).fill().map(() => Array(4).fill(null));
    sqr = addNewNumber(sqr);

    this.state = {  
      squares: sqr,
      moves : 0,
      started : false
    };

    this.keyPressed = this.keyPressed.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);

    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  mouseDown(event) {
    this.setState(() => {
      return { mouseX : event.clientX, mouseY : event.clientY };
    });
  }

  mouseUp(event) {
    this.setState(() => {
      return { endMouseX : event.clientX, endMouseY : event.clientY };
    });
    
    let xDiff = event.clientX - this.state.mouseX;
    let yDiff = event.clientY - this.state.mouseY;

    let handler;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      handler = xDiff > 0 ? handleRight : handleLeft;
    }
    else {
      handler = yDiff > 0 ? handleDown : handleUp;
    }

    this.handleMove(handler);
  }

  touchStart(event) {
    let touch = event.touches[0];
    if (!touch)
      return;

    this.setState(() => {
      return { mouseX : touch.clientX, mouseY : touch.clientY };
    });
  }

  touchEnd(event) {
    let touch = event.changedTouches[0];
    if (!touch)
      return;
    
    let xDiff = touch.clientX - this.state.mouseX;
    let yDiff = touch.clientY - this.state.mouseY;

    let handler;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      handler = xDiff > 0 ? handleRight : handleLeft;
    }
    else {
      handler = yDiff > 0 ? handleDown : handleUp;
    }

    this.handleMove(handler);
  }

  keyPressed(event) {
    let handler;
    switch (event.keyCode){
      case 37:
        handler = s => handleLeft(s);
        break;
      case 38:
        handler = s => handleUp(s);
        break;
      case 39:
        handler = s => handleRight(s);
        break;
      case 40:
        handler = s => handleDown(s);
        break;
      default:
        handler = s => { return { moves : 0, squares : s }};
        console.log("uh oh");
    }

    this.handleMove(handler);
  }

  handleMove(handler) {
    this.setState((state) => {
      const { squares, moves, started } = handler(state.squares.slice());
      return { squares : squares, moves : moves, started : started };
    });

    this.setState((state) => {
      const { moves, squares } = state;
      if (moves > 0) {
        return { squares: addNewNumber(squares.slice()) };
      }

      return state;
    });
  }

  handleTouchMove(event) {
    console.log(event);
    const className = event.target.className;
    if (className.includes('square')) {
      event.preventDefault();;
      return;
    }
    
    this.setState(state => {
      return { fuck : state.fuck + 1 };
    });
  }

  componentDidMount() {
    document.addEventListener("touchmove", this.handleTouchMove, { passive : false });
    document.addEventListener("keydown", this.keyPressed, false);

    const doc = document.getElementById("game-board");

    doc.addEventListener("touchstart", this.touchStart, false);
    doc.addEventListener("touchend", this.touchEnd, false);
  }

  componentWillUnmount(){
    document.removeEventListener("touchmove", this.handleTouchMove, { passive : false });
    document.removeEventListener("keydown", this.keyPressed, false);

    const doc = document.getElementById("game-board");

    doc.removeEventListener("touchstart", this.touchStart, false);
    doc.removeEventListener("touchend", this.touchEnd, false);
  }

  render() {
    return (
      <div className="game" id="game">
        <div className="game-board" id="game-board">
          <Board
            squares={this.state.squares}
          />
        </div>
        <div className="game-info">
          <span>{(this.state.started && this.state.moves === 0) ? "Nothing has moved" : null}</span>
        </div>
      </div>
    );
  }
}

export default Game;