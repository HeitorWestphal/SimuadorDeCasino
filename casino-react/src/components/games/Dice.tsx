import React, { useState, useRef, useEffect } from 'react';
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

const MultiplierInput = styled.input`
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

const DiceContainer = styled.div`
  width: 100px;
  height: 100px;
  margin: 20px auto;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1s ease;
`;

const DiceFace = styled.div<{ value: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border: 2px solid #444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  color: #333;
  backface-visibility: hidden;
`;

interface DiceProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Dice: React.FC<DiceProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [targetNumber, setTargetNumber] = useState(50);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  const startTime = useRef<number>(0);

  const calculateMultiplier = (target: number) => {
    // Higher target = higher risk = higher multiplier
    return (100 / (100 - target)).toFixed(2);
  };

  const startGame = () => {
    if (bet > balance) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setResult(0);
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      
      if (elapsed >= 2) {
        const finalResult = Math.floor(Math.random() * 100);
        setResult(finalResult);
        setGameActive(false);

        if (finalResult >= targetNumber) {
          const win = bet * Number(calculateMultiplier(targetNumber));
          onBalanceChange(win);
          setMultiplier(Number(calculateMultiplier(targetNumber)));
        } else {
          setMultiplier(0);
        }
        return;
      }

      // Animate dice rolling
      const tempResult = Math.floor(Math.random() * 100);
      setResult(tempResult);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <GameArea>
      <h2>Dice</h2>
      <BetControls>
        <BetInput
          type="number"
          min="1"
          max={balance}
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameActive}
        />
        <MultiplierInput
          type="number"
          min="1"
          max="99"
          value={targetNumber}
          onChange={(e) => setTargetNumber(Math.max(1, Math.min(99, Number(e.target.value))))}
          disabled={gameActive}
        />
        <Button onClick={startGame} disabled={gameActive || bet > balance}>
          {gameActive ? 'Rolando...' : 'Rolar Dados'}
        </Button>
      </BetControls>

      <DiceContainer>
        <DiceFace value={result}>
          {result}
        </DiceFace>
      </DiceContainer>

      {!gameActive && result > 0 && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          {result >= targetNumber ? (
            <>
              Vitória! Multiplicador: {multiplier}x
              <br />
              Ganho: ${(bet * multiplier).toFixed(2)}
            </>
          ) : (
            'Derrota!'
          )}
        </div>
      )}
    </GameArea>
  );
};

export default Dice; 