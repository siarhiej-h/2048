function normalize(squares, get, set) {
    const length = squares.length;
    let newLine = new Array(length);
    let moves = 0;
    let newItem;
    let mergedTiles = [];

    for (let i = 0; i !== length; i++) {
      let occupied = 0;
      let merged = new Map();
      for (let j = length - 1; j >= 0; j--) {
        const item = get(squares, i, j);
        if (item) {

          if (item.isNew) {
            newItem = item;
          }

          // store previously merged, in case moves happen - change the state
          if (item.merged) {
            mergedTiles.push(item);
          }

          const index = length - 1 - occupied;
          if (occupied > 0 && item.number === newLine[index + 1].number && !merged.has(index + 1)) {
            let item = newLine[index + 1];
            item.number = item.number * 2;
            item.merged = true;

            var mergedIndex = mergedTiles.indexOf(item);
            if (mergedIndex > -1) {
              mergedTiles.splice(mergedIndex, 1);
            }

            newLine[index + 1] = item;
            merged.set(index + 1, true);
            moves++;
          }
          else {
            occupied++;
            if (index !== j) {
                moves++;
            }
            newLine[index] = item; 
          }
        }
      }
  
      for (let j = 0; j !== length; j++) {
        let item = newLine[j];
        newLine[j] = null;
        set(squares, i, j, item);
      }
    }
    
    if (moves > 0) {

      if (newItem) {
        newItem.isNew = false;
      }

      mergedTiles.forEach(i => i.merged = false);
    }
  
    return { squares : squares, moves : moves, started : true };
  }
  
  function leftGet(squares, i, j) {
    return squares[i][squares.length - j - 1];
  }
  
  function leftSet (squares, i, j, item) {
    squares[i][squares.length - j - 1] = item;
  };
  
  function upGet(squares, i, j) {
    const length = squares.length;
    return squares[length - j - 1][i];
  }
  
  function upSet(squares, i, j, item) {
    const length = squares.length;
    squares[length - j - 1][i] = item;
  };
  
  function rightGet(squares, i, j) {
    return squares[i][j];
  }
  
  function rightSet(squares, i, j, item) {
    squares[i][j] = item;
  };
  
  function downGet(squares, i, j) {
    return squares[j][i];
  }
  
  function downSet(squares, i, j, item) {
    squares[j][i] = item;
  };

  export function handleLeft(newSquares) {
    console.log("left");
    return normalize(newSquares, leftGet, leftSet);
  }

  export function handleRight(newSquares) {
    console.log("right");
    return normalize(newSquares, rightGet, rightSet);
  }

  export function handleUp(newSquares) {
    console.log("up");
    return normalize(newSquares, upGet, upSet);
  }

  export function handleDown(newSquares) {
    console.log("down");
    return normalize(newSquares, downGet, downSet);
  }