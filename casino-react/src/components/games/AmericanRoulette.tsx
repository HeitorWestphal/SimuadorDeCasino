import React, { useState, useRef } from 'react';
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

const RouletteWheel = styled.div<{ spinning: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #2c3e50;
  position: relative;
  margin: 20px 0;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  transform: ${props => props.spinning ? 'rotate(1800deg)' : 'rotate(0deg)'};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const WheelCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #e74c3c;
  border-radius: 50%;
  z-index: 2;
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

const BetTypeSelect = styled.select`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 150px;
`;

const BetTypeOption = styled.option`
  background: #2c3e50;
  color: white;
`;

interface AmericanRouletteProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const AmericanRoulette: React.FC<AmericanRouletteProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [betType, setBetType] = useState('red');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinRoulette = () => {
    if (bet <= 0 || bet > balance || isSpinning) {
      return;
    }

    onBalanceChange(-bet);
    setIsSpinning(true);
    setResult(null);

    // Simular o giro da roleta
    setTimeout(() => {
      const number = Math.floor(Math.random() * 38); // 0-36 + 00
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);
      const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(number);
      const isGreen = number === 0 || number === 37; // 37 representa o 00

      let winAmount = 0;
      let message = '';

      switch (betType) {
        case 'red':
          if (isRed) {
            winAmount = bet * 2;
            message = `Vermelho ${number} - Você ganhou $${winAmount}!`;
          } else {
            message = `${isGreen ? 'Verde' : 'Preto'} ${number} - Você perdeu!`;
          }
          break;
        case 'black':
          if (isBlack) {
            winAmount = bet * 2;
            message = `Preto ${number} - Você ganhou $${winAmount}!`;
          } else {
            message = `${isGreen ? 'Verde' : 'Vermelho'} ${number} - Você perdeu!`;
          }
          break;
        case 'green':
          if (isGreen) {
            winAmount = bet * 35;
            message = `Verde ${number === 37 ? '00' : '0'} - Você ganhou $${winAmount}!`;
          } else {
            message = `${isRed ? 'Vermelho' : 'Preto'} ${number} - Você perdeu!`;
          }
          break;
      }

      if (winAmount > 0) {
        onBalanceChange(winAmount);
        setResult({ message, type: 'win' });
      } else {
        setResult({ message, type: 'lose' });
      }

      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎲 Roleta Americana 🎲</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value) || 0)}
          placeholder="Aposta"
          min="1"
        />
        <BetTypeSelect
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
        >
          <BetTypeOption value="red">Vermelho (2x)</BetTypeOption>
          <BetTypeOption value="black">Preto (2x)</BetTypeOption>
          <BetTypeOption value="green">Verde (35x)</BetTypeOption>
        </BetTypeSelect>
      </BetControls>
      <GameArea>
        <RouletteWheel ref={wheelRef} spinning={isSpinning}>
          <WheelCenter />
        </RouletteWheel>
        <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
          Vermelho: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36<br />
          Preto: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35<br />
          Verde: 0, 00
        </div>
      </GameArea>
      <button className="btn" onClick={spinRoulette} disabled={isSpinning}>
        {isSpinning ? 'Girando...' : 'Girar'}
      </button>
      {result && (
        <div className={`result ${result.type}`} style={{ display: 'block' }}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default AmericanRoulette; 