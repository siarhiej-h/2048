/**
 * Processes a move in a given direction using accessor functions
 * @param {Object} state - Current game state
 * @param {Object} accessors - Object with get and set functions for accessing squares
 * @returns {Object} Updated game state
 */
function processMove(state, accessors) {
  if (!canMove(state.squares, accessors)) {
    return {
      squares: state.squares,
      isMoved: false,
      isStarted: state.isStarted,
      score: state.score,
    };
  }

  // Deep copy squares to avoid mutating state
  const squares = state.squares.map((row) =>
    row.map((square) => (square ? square.copy() : null))
  );
  
  let score = state.score;
  const length = squares.length;
  const { get, set } = accessors;

  for (let i = 0; i < length; i++) {
    const row = getRowObject(length);

    // Process from the end of the row (direction of movement)
    for (let j = length - 1; j >= 0; j--) {
      const item = get(squares, i, j);
      if (item) {
        item.isNew = false;
        item.isMerged = false;

        const index = row.getLastNonOccupiedIndex();

        if (row.canMerge(item)) {
          row.merge();
          score += row.mergedSum;
        } else {
          row.occupied++;
          row.items[index] = item;
        }
      }
    }

    // Update squares with processed row
    for (let j = 0; j < length; j++) {
      set(squares, i, j, row.items[j]);
    }
  }

  return {
    squares,
    isMoved: true,
    isStarted: true,
    score,
  };
}

/**
 * Checks if a move is possible in the given direction
 * @param {Array<Array>} squares - 2D array representing the game board
 * @param {Object} accessors - Object with get function for accessing squares
 * @returns {boolean} True if a move is possible
 */
function canMove(squares, accessors) {
  const length = squares.length;
  const { get } = accessors;

  for (let i = 0; i < length; i++) {
    let j = 0;
    while (j < length - 1) {
      const startItem = get(squares, i, j);
      const endItem = get(squares, i, j + 1);

      if (!startItem) {
        j++;
        continue;
      }

      // Can move if there's an empty space or mergeable tile
      if (!endItem || startItem.number === endItem.number) {
        return true;
      }

      j++;
    }
  }

  return false;
}

/**
 * Creates a row object to track tile positions during movement
 * @param {number} length - Length of the row
 * @returns {Object} Row object with helper methods
 */
function getRowObject(length) {
  const row = {
    length,
    items: new Array(length),
    occupied: 0,
    mergedSum: 0,
    mergedTiles: new Set(),
  };

  row.getLastNonOccupiedIndex = function () {
    return row.length - row.occupied - 1;
  };

  row.canMerge = function (item) {
    if (row.occupied > 0) {
      const nextIndex = row.getLastNonOccupiedIndex() + 1;

      // Already merged items can't be merged again within the same move
      if (row.mergedTiles.has(nextIndex)) {
        return false;
      }

      return item.number === row.items[nextIndex].number;
    }

    return false;
  };

  row.merge = function () {
    const index = row.getLastNonOccupiedIndex() + 1;
    const item = row.items[index];
    item.number *= 2;
    item.isMerged = true;
    row.items[index] = item;
    row.mergedTiles.add(index);

    // Calculate score
    row.mergedSum = item.number;
  };

  return row;
}

// Accessor functions for different directions
function leftGet(squares, i, j) {
  return squares[i][squares.length - j - 1];
}

function leftSet(squares, i, j, item) {
  squares[i][squares.length - j - 1] = item;
}

function upGet(squares, i, j) {
  const length = squares.length;
  return squares[length - j - 1][i];
}

function upSet(squares, i, j, item) {
  const length = squares.length;
  squares[length - j - 1][i] = item;
}

function rightGet(squares, i, j) {
  return squares[i][j];
}

function rightSet(squares, i, j, item) {
  squares[i][j] = item;
}

function downGet(squares, i, j) {
  return squares[j][i];
}

function downSet(squares, i, j, item) {
  squares[j][i] = item;
}

export function handleLeft(state) {
  const accessors = { get: leftGet, set: leftSet };
  return processMove(state, accessors);
}

export function handleRight(state) {
  const accessors = { get: rightGet, set: rightSet };
  return processMove(state, accessors);
}

export function handleUp(state) {
  const accessors = { get: upGet, set: upSet };
  return processMove(state, accessors);
}

export function handleDown(state) {
  const accessors = { get: downGet, set: downSet };
  return processMove(state, accessors);
}

export function handleNone(state) {
  return {
    squares: state.squares,
    isMoved: false,
    isStarted: state.isStarted,
    score: state.score,
  };
}
