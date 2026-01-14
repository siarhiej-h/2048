import React from 'react';
import Tile from './Tile';

function Board({ squares }) {
  const renderSquare = (rowIndex, colIndex) => {
    const item = squares[rowIndex][colIndex];
    return (
      <Tile
        key={`tile-${rowIndex}-${colIndex}-${item?.number || 'empty'}`}
        value={item}
        rowIndex={rowIndex}
        colIndex={colIndex}
      />
    );
  };

  const renderRow = (rowIndex) => {
    const row = squares[rowIndex];
    return (
      <div className="board-row" key={`row-${rowIndex}`}>
        {row.map((_col, colIndex) => renderSquare(rowIndex, colIndex))}
      </div>
    );
  };

  return (
    <div className="board">
      {squares.map((_row, rowIndex) => renderRow(rowIndex))}
    </div>
  );
}

export default Board;
