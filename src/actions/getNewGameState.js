import { generateNewTile } from './generateTileHandler';

/**
 * Creates a new game state with initial tiles
 * @param {number} size - The size of the game board (e.g., 4 for a 4x4 board)
 * @returns {Object} Initial game state object
 */
export function getNewGameState(size) {
  const squares = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  
  // Generate two initial tiles
  const squaresWithTiles = generateNewTile(generateNewTile(squares));

  return {
    squares: squaresWithTiles,
    isMoved: false,
    isStarted: false,
    score: 0,
    rewinds: 0,
    history: [],
  };
}
