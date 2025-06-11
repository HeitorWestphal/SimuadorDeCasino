import React, { useState } from 'react';
import styled from 'styled-components';

const GameArea = styled.div`
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  color: white;
  text-align: center;
  margin: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const BetControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const BetInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  width: 200px;
  margin: 0 auto;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const BetTypeSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  width: 200px;
  margin: 0 auto;
`;

const DiceContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const Die = styled.div`
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

interface SicBoProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const SicBo: React.FC<SicBoProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [betType, setBetType] = useState('big');
  const [gameActive, setGameActive] = useState(false);
  const [dice, setDice] = useState<number[]>([]);
  const [result, setResult] = useState<{ message: string; multiplier: number } | null>(null);

  const betTypes = [
    { value: 'big', label: 'Grande (4-17)', multiplier: 1 },
    { value: 'small', label: 'Pequeno (3-18)', multiplier: 1 },
    { value: 'odd', label: 'Ímpar', multiplier: 1 },
    { value: 'even', label: 'Par', multiplier: 1 },
    { value: '4', label: 'Soma 4', multiplier: 60 },
    { value: '5', label: 'Soma 5', multiplier: 30 },
    { value: '6', label: 'Soma 6', multiplier: 17 },
    { value: '7', label: 'Soma 7', multiplier: 12 },
    { value: '8', label: 'Soma 8', multiplier: 8 },
    { value: '9', label: 'Soma 9', multiplier: 6 },
    { value: '10', label: 'Soma 10', multiplier: 6 },
    { value: '11', label: 'Soma 11', multiplier: 6 },
    { value: '12', label: 'Soma 12', multiplier: 6 },
    { value: '13', label: 'Soma 13', multiplier: 8 },
    { value: '14', label: 'Soma 14', multiplier: 12 },
    { value: '15', label: 'Soma 15', multiplier: 17 },
    { value: '16', label: 'Soma 16', multiplier: 30 },
    { value: '17', label: 'Soma 17', multiplier: 60 }
  ];

  const rollDice = () => {
    if (bet > balance) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setResult(null);

    // Roll three dice
    const newDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
    setDice(newDice);

    const sum = newDice.reduce((a, b) => a + b, 0);
    const isEven = sum % 2 === 0;
    const isBig = sum >= 11 && sum <= 17;
    const isSmall = sum >= 4 && sum <= 10;

    let won = false;
    let multiplier = 1;

    switch (betType) {
      case 'big':
        won = isBig;
        break;
      case 'small':
        won = isSmall;
        break;
      case 'odd':
        won = !isEven;
        break;
      case 'even':
        won = isEven;
        break;
      default:
        won = sum === parseInt(betType);
        multiplier = betTypes.find(t => t.value === betType)?.multiplier || 1;
    }

    if (won) {
      const winAmount = bet * multiplier;
      onBalanceChange(winAmount);
      setResult({
        message: `Você ganhou $${winAmount}!`,
        multiplier
      });
    } else {
      setResult({
        message: 'Você perdeu!',
        multiplier: 0
      });
    }

    setGameActive(false);
  };

  return (
    <GameArea>
      <h2>Sic Bo</h2>
      <BetControls>
        <BetInput
          type="number"
          min="1"
          max={balance}
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameActive}
        />
        <BetTypeSelect
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
          disabled={gameActive}
        >
          {betTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label} ({type.multiplier}x)
            </option>
          ))}
        </BetTypeSelect>
        <Button onClick={rollDice} disabled={gameActive || bet > balance}>
          {gameActive ? 'Rolando...' : 'Rolar Dados'}
        </Button>
      </BetControls>

      <DiceContainer>
        {dice.map((value, index) => (
          <Die key={index}>{value}</Die>
        ))}
      </DiceContainer>

      {result && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          {result.message}
          {result.multiplier > 0 && (
            <>
              <br />
              Multiplicador: {result.multiplier}x
            </>
          )}
        </div>
      )}
    </GameArea>
  );
};

export default SicBo; 