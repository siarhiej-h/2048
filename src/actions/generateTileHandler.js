import { CreateSquare } from './createSquare';

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Counts the number of empty squares in the grid
 * @param {Array<Array>} squares - 2D array representing the game board
 * @returns {number} Number of empty squares
 */
function getEmptySquaresCount(squares) {
  let emptyCount = 0;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (!squares[i][j]) {
        emptyCount++;
      }
    }
  }
  return emptyCount;
}

/**
 * Generates a new tile (2 or 4) in a random empty position
 * @param {Array<Array>} squares - 2D array representing the game board
 * @returns {Array<Array>} Updated squares array with new tile (new array, doesn't mutate input)
 */
export function generateNewTile(squares) {
  // Create a deep copy to avoid mutation
  const newSquares = squares.map((row) => row.map((square) => (square ? square.copy() : null)));
  
  const emptyCount = getEmptySquaresCount(newSquares);
  if (emptyCount === 0) {
    return newSquares;
  }

  // 10% chance for 4 to appear, 90% chance for 2
  const nextNumber = getRandomInteger(0, 9) === 9 ? 4 : 2;
  let nextPosition = getRandomInteger(0, emptyCount - 1);

  for (let i = 0; i < newSquares.length; i++) {
    for (let j = 0; j < newSquares[i].length; j++) {
      if (newSquares[i][j]) {
        continue;
      }

      if (nextPosition === 0) {
        newSquares[i][j] = CreateSquare(nextNumber);
        return newSquares;
      }

      nextPosition--;
    }
  }

  return newSquares;
}
