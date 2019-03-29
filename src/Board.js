import React from 'react';
import Square from './Square';

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]} key={"sqr" + i + j} rowIndex={i} colIndex={j}
      />
    );
  }

  renderRow(rowIndex) {
    const row = this.props.squares[rowIndex];
    return (
      <div className="board-row" key={"br" + rowIndex}>{
        row.map((_col, colIndex) => this.renderSquare(rowIndex, colIndex))
      }</div>
    );
  }

  render() {
    return (
      <div>
        <div className="status">ASDF</div>
        {this.props.squares.map((_row, rowIndex) => this.renderRow(rowIndex))}
      </div>
    );
  }
}

export default Board;