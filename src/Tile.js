import React from 'react';

function Tile({ value, rowIndex, colIndex }) {
  if (!value) {
    return <span className="tile tile-empty" />;
  }

  const { number, isNew, isMerged } = value;
  const tileClass = `tile tile-${number} ${isNew ? 'tile-new' : ''} ${isMerged ? 'tile-merged' : ''}`;

  return (
    <span
      className={tileClass}
      data-row={rowIndex}
      data-col={colIndex}
    >
      {number}
    </span>
  );
}

export default Tile;
