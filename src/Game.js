import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import { getNewGameState } from './actions/getNewGameState';
import { generateNewTile } from './actions/generateTileHandler';
import { getKeyHandler } from './inputHandlers/keyboard';
import { getTouchHandler } from './inputHandlers/touch';

function Game({ fieldSize }) {
  const [gameState, setGameState] = useState(() => getNewGameState(fieldSize));
  const [touchStart, setTouchStart] = useState(null);

  const reset = useCallback(() => {
    setGameState(getNewGameState(fieldSize));
  }, [fieldSize]);

  // Helper function to deep copy squares
  const deepCopySquares = useCallback((squares) => {
    return squares.map((row) =>
      row.map((square) => (square ? square.copy() : null))
    );
  }, []);

  const rewind = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.history.length === 0) {
        return prevState;
      }
      const { squares, score } = prevState.history[prevState.history.length - 1];
      // Deep copy squares from history to avoid mutation
      const copiedSquares = deepCopySquares(squares);
      const newHistory = prevState.history.slice(0, -1);
      return {
        ...prevState,
        squares: copiedSquares,
        score,
        rewinds: prevState.rewinds + 1,
        history: newHistory,
      };
    });
  }, [deepCopySquares]);

  const handleMove = useCallback((handler) => {
    setGameState((prevState) => {
      const { squares, isMoved, isStarted, score } = handler(prevState);

      if (isMoved) {
        // Write history before generating new tile - deep copy to avoid mutation
        const historyEntry = {
          squares: deepCopySquares(prevState.squares),
          score: prevState.score,
        };
        const newSquares = generateNewTile(squares);

        return {
          ...prevState,
          squares: newSquares,
          isMoved: true,
          isStarted,
          score,
          history: [...prevState.history, historyEntry],
        };
      }

      return {
        ...prevState,
        isMoved: false,
      };
    });
  }, [deepCopySquares]);

  const keyPressed = useCallback((event) => {
    if (event.keyCode === 81) {
      rewind();
      return;
    }
    const handler = getKeyHandler(event);
    handleMove(handler);
  }, [rewind, handleMove]);

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    if (touch) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchEnd = useCallback((event) => {
    if (!touchStart) return;

    const handler = getTouchHandler(event, touchStart);
    handleMove(handler);
    setTouchStart(null);
  }, [touchStart, handleMove]);

  const handleTouchMove = useCallback((event) => {
    // Prevent iOS bouncing effect
    const className = event.target.className;
    if (typeof className === 'string' && className.includes('square')) {
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('keydown', keyPressed, false);

    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, false);
      gameBoard.addEventListener('touchend', handleTouchEnd, false);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove, { passive: false });
      document.removeEventListener('keydown', keyPressed, false);

      const gameBoard = document.getElementById('game-board');
      if (gameBoard) {
        gameBoard.removeEventListener('touchstart', handleTouchStart, false);
        gameBoard.removeEventListener('touchend', handleTouchEnd, false);
      }
    };
  }, [handleTouchMove, keyPressed, handleTouchStart, handleTouchEnd]);

  return (
    <div className="game" id="game">
      <div className="game-board" id="game-board">
        <div className="game-header">
          <h1 className="game-title">2048</h1>
          <div className="score-container">
            <div className="score-box">
              <div className="score-label">Score</div>
              <div className="score-value">{gameState.score}</div>
            </div>
            {gameState.rewinds > 0 && (
              <div className="score-box rewinds-box">
                <div className="score-label">Rewinds</div>
                <div className="score-value">{gameState.rewinds}</div>
              </div>
            )}
          </div>
        </div>

        {gameState.isStarted && !gameState.isMoved && (
          <div className="game-message">
            <span>Nothing has moved</span>
          </div>
        )}

        <Board squares={gameState.squares} />

        <div className="game-buttons">
          <button className="game-button" onClick={reset}>
            New Game
          </button>
          <button className="game-button" onClick={rewind}>
            Rewind
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
