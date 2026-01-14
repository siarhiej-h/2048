/**
 * Creates a copy of a square object
 * @param {Object} square - The square to copy
 * @returns {Object} A new square object with the same properties
 */
function copySquare(square) {
  return {
    number: square.number,
    isNew: square.isNew,
    isMerged: square.isMerged,
    copy: function() {
      return copySquare(this);
    },
  };
}

/**
 * Creates a new square with the specified number
 * @param {number} number - The number value for the square (typically 2 or 4)
 * @returns {Object} A new square object
 */
export function CreateSquare(number) {
  const square = {
    number,
    isNew: true,
    isMerged: false,
    copy: function() {
      return copySquare(this);
    },
  };
  return square;
}
