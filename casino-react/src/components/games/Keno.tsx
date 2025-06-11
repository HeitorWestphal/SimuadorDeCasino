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

const KenoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  margin: 20px 0;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const KenoCell = styled.div<{ selected?: boolean; matched?: boolean }>`
  width: 40px;
  height: 40px;
  background: ${props => {
    if (props.matched) return '#4CAF50';
    if (props.selected) return '#2196F3';
    return '#f0f0f0';
  }};
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

const QuickPick = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
  }
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

interface KenoProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Keno: React.FC<KenoProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'initial' | 'playing' | 'final'>('initial');
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);

  const toggleNumber = (number: number) => {
    if (gamePhase !== 'initial') return;

    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      if (prev.length < 10) {
        return [...prev, number];
      }
      return prev;
    });
  };

  const quickPick = () => {
    if (gamePhase !== 'initial') return;

    const numbers: number[] = [];
    while (numbers.length < 10) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers);
  };

  const startGame = () => {
    if (bet <= 0 || bet > balance || selectedNumbers.length !== 10) {
      return;
    }

    onBalanceChange(-bet);
    setCalledNumbers([]);
    setGamePhase('playing');
    setResult(null);

    // Simular chamada de números
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 20) {
        clearInterval(interval);
        evaluateGame();
        return;
      }

      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * 80) + 1;
      } while (calledNumbers.includes(newNumber));

      setCalledNumbers(prev => [...prev, newNumber]);
      count++;
    }, 1000);
  };

  const evaluateGame = () => {
    const matches = selectedNumbers.filter(num => calledNumbers.includes(num));
    const matchCount = matches.length;
    let multiplier = 0;

    // Tabela de pagamento simplificada
    switch (matchCount) {
      case 10: multiplier = 100; break;
      case 9: multiplier = 50; break;
      case 8: multiplier = 20; break;
      case 7: multiplier = 10; break;
      case 6: multiplier = 5; break;
      case 5: multiplier = 2; break;
      default: multiplier = 0;
    }

    if (multiplier > 0) {
      const winAmount = bet * multiplier;
      onBalanceChange(winAmount);
      setResult({ 
        message: `${matchCount} acertos! Você ganhou $${winAmount}!`, 
        type: 'win' 
      });
    } else {
      setResult({ 
        message: `${matchCount} acertos! Você perdeu!`, 
        type: 'lose' 
      });
    }

    setGamePhase('final');
  };

  const startNewGame = () => {
    setSelectedNumbers([]);
    setCalledNumbers([]);
    setGamePhase('initial');
    setResult(null);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎯 Keno 🎯</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value) || 0)}
          placeholder="Aposta"
          min="1"
        />
        <QuickPick onClick={quickPick}>
          Escolha Rápida
        </QuickPick>
      </BetControls>
      <GameArea>
        <KenoGrid>
          {Array.from({ length: 80 }, (_, i) => i + 1).map(num => (
            <KenoCell
              key={num}
              selected={selectedNumbers.includes(num)}
              matched={calledNumbers.includes(num)}
              onClick={() => toggleNumber(num)}
            >
              {num}
            </KenoCell>
          ))}
        </KenoGrid>
        {calledNumbers.length > 0 && (
          <CalledNumbers>
            {calledNumbers.map((num, index) => (
              <CalledNumber key={index}>{num}</CalledNumber>
            ))}
          </CalledNumbers>
        )}
      </GameArea>
      {gamePhase === 'initial' && (
        <button 
          className="btn" 
          onClick={startGame}
          disabled={selectedNumbers.length !== 10}
        >
          Iniciar Jogo ({selectedNumbers.length}/10)
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

export default Keno; 