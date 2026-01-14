import {
  handleDown,
  handleLeft,
  handleUp,
  handleRight,
  handleNone,
} from '../actions/moveHandlers';

/**
 * Maps keyboard key codes to move handlers
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {Function} A handler function that processes the move
 */
export function getKeyHandler(event) {
  const keyCode = event.keyCode || event.which;
  
  switch (keyCode) {
    case 37: // Left arrow
      return (state) => handleLeft(state);
    case 38: // Up arrow
      return (state) => handleUp(state);
    case 39: // Right arrow
      return (state) => handleRight(state);
    case 40: // Down arrow
      return (state) => handleDown(state);
    default:
      return (state) => handleNone(state);
  }
}
