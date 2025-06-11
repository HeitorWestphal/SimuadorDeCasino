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

const MultiplierInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  width: 200px;
  margin: 0 auto;
`;

const MultiplierDisplay = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin: 20px 0;
  color: #4CAF50;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 20px;
  background: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: #4CAF50;
    transition: width 0.1s linear;
  }
`;

interface LimboProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Limbo: React.FC<LimboProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [gameActive, setGameActive] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [result, setResult] = useState<{ message: string; multiplier: number } | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const startGame = () => {
    if (bet > balance || targetMultiplier <= 1) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setResult(null);
    setCurrentMultiplier(1);

    const startTime = Date.now();
    const duration = 3000; // 3 seconds
    const crashPoint = Math.random() * (targetMultiplier - 1) + 1;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Exponential growth
      const multiplier = Math.pow(2, progress * Math.log2(targetMultiplier));
      setCurrentMultiplier(multiplier);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (multiplier >= targetMultiplier) {
          const winAmount = bet * targetMultiplier;
          onBalanceChange(winAmount);
          setResult({
            message: `Você ganhou $${winAmount}!`,
            multiplier: targetMultiplier
          });
        } else {
          setResult({
            message: 'Você perdeu!',
            multiplier: 0
          });
        }
        setGameActive(false);
      }
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
      <h2>Limbo</h2>
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
          min="1.01"
          step="0.01"
          value={targetMultiplier}
          onChange={(e) => setTargetMultiplier(Math.max(1.01, Number(e.target.value)))}
          disabled={gameActive}
        />
        <Button onClick={startGame} disabled={gameActive || bet > balance || targetMultiplier <= 1}>
          {gameActive ? 'Jogando...' : 'Iniciar Jogo'}
        </Button>
      </BetControls>

      {gameActive && (
        <>
          <MultiplierDisplay>
            {currentMultiplier.toFixed(2)}x
          </MultiplierDisplay>
          <ProgressBar progress={(currentMultiplier / targetMultiplier) * 100} />
        </>
      )}

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

export default Limbo; 