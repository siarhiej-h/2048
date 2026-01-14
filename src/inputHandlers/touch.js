import {
  handleDown,
  handleLeft,
  handleUp,
  handleRight,
  handleNone,
} from '../actions/moveHandlers';

/**
 * Determines the move direction based on touch gestures
 * @param {TouchEvent} event - The touch event
 * @param {Object} touchStartCoordinates - Starting touch coordinates { x, y }
 * @returns {Function} A handler function that processes the move
 */
export function getTouchHandler(event, touchStartCoordinates) {
  const touch = event.changedTouches[0];
  if (!touch || !touchStartCoordinates) {
    return handleNone;
  }

  const xDiff = touch.clientX - touchStartCoordinates.x;
  const yDiff = touch.clientY - touchStartCoordinates.y;

  // Determine if horizontal or vertical movement is greater
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    // Horizontal movement
    if (xDiff > 0) {
      return handleRight;
    }
    if (xDiff < 0) {
      return handleLeft;
    }
  } else {
    // Vertical movement
    if (yDiff > 0) {
      return handleDown;
    }
    if (yDiff < 0) {
      return handleUp;
    }
  }

  return handleNone;
}
