import React, { useState } from 'react';
import styled from 'styled-components';

const GameArea = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BetControls = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  align-items: center;
  flex-wrap: wrap;
`;

const BetInput = styled.input`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 120px;
`;

const MinesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  gap: 5px;
  margin: 20px auto;
`;

const MineTile = styled.div<{ revealed?: boolean; isMine?: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${props => {
    if (props.revealed) {
      return props.isMine ? '#e74c3c' : '#2ecc71';
    }
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: ${props => props.revealed ? 'default' : 'pointer'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.revealed ? 'inherit' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

interface MinesProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

interface GameState {
  grid: number[][];
  mines: string[];
  gameActive: boolean;
  bet: number;
  clearedTiles: number;
  minesCount: number;
}

const Mines: React.FC<MinesProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(3);
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    mines: [],
    gameActive: false,
    bet: 0,
    clearedTiles: 0,
    minesCount: 0
  });
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' | 'push' } | null>(null);

  const startMines = () => {
    if (bet <= 0 || bet > balance) {
      setResult({ message: 'Aposta inválida!', type: 'lose' });
      return;
    }

    const gridSize = 5;
    const totalTiles = gridSize * gridSize;

    if (minesCount >= totalTiles) {
      setResult({ message: 'Número de minas muito alto para o tamanho do grid!', type: 'lose' });
      return;
    }

    onBalanceChange(-bet);

    const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    const mines: string[] = [];

    while (mines.length < minesCount) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const minePosition = `${row}-${col}`;

      if (!mines.includes(minePosition)) {
        mines.push(minePosition);
      }
    }

    setGameState({
      grid,
      mines,
      gameActive: true,
      bet,
      clearedTiles: 0,
      minesCount
    });

    setResult({ message: 'Jogo iniciado!', type: 'push' });
  };

  const revealTile = (row: number, col: number) => {
    if (!gameState.gameActive || gameState.grid[row][col] !== 0) return;

    const minePosition = `${row}-${col}`;
    const newGrid = [...gameState.grid];

    if (gameState.mines.includes(minePosition)) {
      // Hit a mine
      newGrid[row][col] = -1;
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        gameActive: false
      }));
      endMinesGame(false);
    } else {
      newGrid[row][col] = 1;
      const newClearedTiles = gameState.clearedTiles + 1;
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        clearedTiles: newClearedTiles
      }));

      const totalTiles = gameState.grid.length * gameState.grid[0].length;
      const safeTiles = totalTiles - gameState.minesCount;

      if (newClearedTiles === safeTiles) {
        endMinesGame(true);
      }
    }
  };

  const endMinesGame = (won: boolean) => {
    if (won) {
      const multiplier = calculateMinesMultiplier();
      const winAmount = Math.floor(gameState.bet * multiplier);
      onBalanceChange(winAmount);
      setResult({
        message: `Parabéns! Você limpou o campo e ganhou $${winAmount}!`,
        type: 'win'
      });
    } else {
      setResult({
        message: 'Você atingiu uma mina! Fim de jogo.',
        type: 'lose'
      });
    }

    setGameState(prev => ({
      ...prev,
      gameActive: false
    }));
  };

  const calculateMinesMultiplier = () => {
    const totalTiles = 5 * 5;
    const mines = gameState.minesCount;
    const cleared = gameState.clearedTiles;

    if (cleared === 0) return 1.0;

    let multiplier = 1.0;
    for (let i = 0; i < cleared; i++) {
      multiplier *= (totalTiles - i) / (totalTiles - mines - i);
    }

    return Math.max(1.0, multiplier);
  };

  const cashoutMines = () => {
    if (!gameState.gameActive) return;

    const multiplier = calculateMinesMultiplier();
    const winAmount = Math.floor(gameState.bet * multiplier);
    onBalanceChange(winAmount);

    setResult({
      message: `Retirada! Você ganhou $${winAmount} com ${gameState.clearedTiles} tiles limpos.`,
      type: 'win'
    });

    endMinesGame(true);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">💣 Mines 💣</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value) || 0)}
          placeholder="Aposta"
          min="1"
        />
        <select
          className="bet-input"
          value={minesCount}
          onChange={(e) => setMinesCount(parseInt(e.target.value))}
        >
          <option value="3">3 Minas</option>
          <option value="5">5 Minas</option>
          <option value="8">8 Minas</option>
          <option value="10">10 Minas</option>
        </select>
      </BetControls>
      <div style={{ fontSize: '18px', marginBottom: '15px' }}>
        Multiplicador Atual: {calculateMinesMultiplier().toFixed(2)}x
      </div>
      <GameArea>
        <MinesGrid>
          {gameState.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <MineTile
                key={`${rowIndex}-${colIndex}`}
                revealed={cell !== 0}
                isMine={cell === -1}
                onClick={() => revealTile(rowIndex, colIndex)}
              >
                {cell === -1 ? '💣' : cell === 1 ? '' : ''}
              </MineTile>
            ))
          )}
        </MinesGrid>
      </GameArea>
      <div>
        <button
          className="btn"
          onClick={startMines}
          disabled={gameState.gameActive}
        >
          Iniciar Jogo
        </button>
        <button
          className="btn"
          onClick={cashoutMines}
          disabled={!gameState.gameActive}
        >
          Retirar
        </button>
      </div>
      {result && (
        <div className={`result ${result.type}`} style={{ display: 'block' }}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default Mines; 