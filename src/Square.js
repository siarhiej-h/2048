import React from 'react';

function Square(props) {
  let item = props.value;
  let number = item ? item.number : null;
  let className = item ? (item.isNew ? "square squareNew" : (item.merged ? "square squareMerged" : "square squareOld")) : "square";
  return (
    <span className={className}>
      {number}
    </span>
  );
}

export default Square;