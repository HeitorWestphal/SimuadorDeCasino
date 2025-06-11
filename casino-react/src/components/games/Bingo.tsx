import React, { useState, useEffect } from 'react';
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

const BingoCard = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin: 20px 0;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const BingoCell = styled.div<{ marked?: boolean }>`
  width: 40px;
  height: 40px;
  background: ${props => props.marked ? '#4CAF50' : '#f0f0f0'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const HeaderCell = styled(BingoCell)`
  background: #2c3e50;
  color: white;
  font-weight: bold;
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

const CalledNumbers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
  justify-content: center;
`;

const CalledNumber = styled.div`
  width: 30px;
  height: 30px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

interface BingoProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

interface BingoCard {
  numbers: number[][];
  marked: boolean[][];
}

const Bingo: React.FC<BingoProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [card, setCard] = useState<BingoCard>({ numbers: [], marked: [] });
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'initial' | 'playing' | 'final'>('initial');
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);

  const generateBingoCard = () => {
    const numbers: number[][] = [];
    const marked: boolean[][] = [];

    // Gerar números para cada coluna
    for (let col = 0; col < 5; col++) {
      const columnNumbers: number[] = [];
      const columnMarked: boolean[] = [];
      const min = col * 15 + 1;
      const max = min + 14;

      for (let row = 0; row < 5; row++) {
        if (col === 2 && row === 2) {
          // Espaço livre no centro
          columnNumbers.push(0);
          columnMarked.push(true);
        } else {
          let num;
          do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (columnNumbers.includes(num));
          columnNumbers.push(num);
          columnMarked.push(false);
        }
      }
      numbers.push(columnNumbers);
      marked.push(columnMarked);
    }

    return { numbers, marked };
  };

  const startGame = () => {
    if (bet <= 0 || bet > balance) {
      return;
    }

    onBalanceChange(-bet);
    setCard(generateBingoCard());
    setCalledNumbers([]);
    setGamePhase('playing');
    setResult(null);
  };

  const callNumber = () => {
    if (gamePhase !== 'playing') return;

    const availableNumbers = [];
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      setGamePhase('final');
      setResult({ message: 'Nenhum número disponível!', type: 'lose' });
      return;
    }

    const newNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    setCalledNumbers(prev => [...prev, newNumber]);

    // Verificar se o número está na cartela
    const newMarked = card.marked.map((col, colIndex) =>
      col.map((cell, rowIndex) =>
        cell || card.numbers[colIndex][rowIndex] === newNumber
      )
    );

    setCard(prev => ({ ...prev, marked: newMarked }));

    // Verificar vitória
    if (checkWin(newMarked)) {
      const winAmount = bet * 5; // Multiplicador de 5x para vitória
      onBalanceChange(winAmount);
      setGamePhase('final');
      setResult({ message: `BINGO! Você ganhou $${winAmount}!`, type: 'win' });
    }
  };

  const checkWin = (marked: boolean[][]) => {
    // Verificar linhas
    for (let row = 0; row < 5; row++) {
      if (marked.every(col => col[row])) return true;
    }

    // Verificar colunas
    for (let col = 0; col < 5; col++) {
      if (marked[col].every(cell => cell)) return true;
    }

    // Verificar diagonais
    if (marked[0][0] && marked[1][1] && marked[2][2] && marked[3][3] && marked[4][4]) return true;
    if (marked[0][4] && marked[1][3] && marked[2][2] && marked[3][1] && marked[4][0]) return true;

    return false;
  };

  const startNewGame = () => {
    setCard({ numbers: [], marked: [] });
    setCalledNumbers([]);
    setGamePhase('initial');
    setResult(null);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎯 Bingo 🎯</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value) || 0)}
          placeholder="Aposta"
          min="1"
        />
      </BetControls>
      <GameArea>
        {card.numbers.length > 0 && (
          <BingoCard>
            <HeaderCell>B</HeaderCell>
            <HeaderCell>I</HeaderCell>
            <HeaderCell>N</HeaderCell>
            <HeaderCell>G</HeaderCell>
            <HeaderCell>O</HeaderCell>
            {card.numbers.map((col, colIndex) =>
              col.map((num, rowIndex) => (
                <BingoCell
                  key={`${colIndex}-${rowIndex}`}
                  marked={card.marked[colIndex][rowIndex]}
                >
                  {num === 0 ? 'FREE' : num}
                </BingoCell>
              ))
            )}
          </BingoCard>
        )}
        {calledNumbers.length > 0 && (
          <CalledNumbers>
            {calledNumbers.map((num, index) => (
              <CalledNumber key={index}>{num}</CalledNumber>
            ))}
          </CalledNumbers>
        )}
      </GameArea>
      {gamePhase === 'initial' && (
        <button className="btn" onClick={startGame}>
          Iniciar Jogo
        </button>
      )}
      {gamePhase === 'playing' && (
        <button className="btn" onClick={callNumber}>
          Chamar Número
        </button>
      )}
      {gamePhase === 'final' && (
        <button className="btn" onClick={startNewGame}>
          Novo Jogo
        </button>
      )}
      {result && (
        <div className={`result ${result.type}`} style={{ display: 'block' }}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default Bingo; 