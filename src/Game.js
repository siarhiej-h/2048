import React from 'react';
import Board from './Board';
import { generateNewTile } from './actions/generateTileHandler';
import { getKeyHandler } from './inputHandlers/keyboard';
import { getTouchHandler } from './inputHandlers/touch';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const size = props.fieldSize;
    let sqr = Array(size).fill().map(() => Array(size).fill(null));
    sqr = generateNewTile(generateNewTile(sqr));

    this.state = {  
      squares: sqr,
      isMoved : false,
      isStarted : false,
      score : 0
    };

    this.keyPressed = this.keyPressed.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  touchStart(event) {
    let touch = event.touches[0];
    if (!touch)
      return;

    this.setState(() => {
      return { touch : { X : touch.clientX, Y : touch.clientY }};
    });
  }

  touchEnd(event) {
    const handler = getTouchHandler(event, this.state.touch);
    this.handleMove(handler);
  }

  keyPressed(event) {
    const handler = getKeyHandler(event);
    this.handleMove(handler);
  }

  handleMove(handler) {
    this.setState((state) => {
      const { squares, isMoved, isStarted, score } = handler(state);
      return { squares : squares, isMoved : isMoved, isStarted : isStarted, score : score };
    });

    this.setState((state) => {
      const { isMoved, squares } = state;
      if (isMoved) {
        return { squares: generateNewTile(squares.slice()) };
      }

      return state;
    });
  }

  // just a hack for iOS bouncing effect
  handleTouchMove(event) {
    const className = event.target.className;
    if (className.includes('square')) {
      event.preventDefault();;
      return;
    }
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
            squares={this.state.squares} score={this.state.score}
          />
        </div>
        <div className="game-info">
          <span>{(this.state.isStarted && !this.state.isMoved) ? "Nothing has moved" : null}</span>
        </div>
      </div>
    );
  }
}

export default Game;