import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface RouletteProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

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
  flex: 1;
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

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const WheelContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  margin: 20px 0;
`;

const WheelCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Pointer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ffd700;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
`;

const BettingTable = styled.div`
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  gap: 2px;
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BettingSpot = styled.button<{ color: string }>`
  background: ${props => props.color};
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Result = styled.div<{ type: 'win' | 'lose' }>`
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background: ${props => props.type === 'win' ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  color: ${props => props.type === 'win' ? '#2ecc71' : '#e74c3c'};
  border: 1px solid ${props => props.type === 'win' ? '#2ecc71' : '#e74c3c'};
`;

const QuickBet = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
`;

const QuickBetButton = styled.button`
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

const Roulette: React.FC<RouletteProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'spinning'>('idle');
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const colors = numbers.map(n => {
    if (n === 0) return '#2ecc71';
    return n % 2 === 0 ? '#e74c3c' : '#2c3e50';
  });

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    // Draw segments
    numbers.forEach((number, index) => {
      const startAngle = (index * 2 * Math.PI) / numbers.length + rotation;
      const endAngle = ((index + 1) * 2 * Math.PI) / numbers.length + rotation;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = colors[index];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();

      // Draw numbers
      const textAngle = (startAngle + endAngle) / 2;
      const textX = centerX + (radius * 0.7) * Math.cos(textAngle);
      const textY = centerY + (radius * 0.7) * Math.sin(textAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(number.toString(), 0, 0);
      ctx.restore();
    });

    // Draw center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
  };

  const spinWheel = () => {
    if (selectedNumber === null || bet > balance) return;

    setGameStatus('spinning');
    setResult(null);
    onBalanceChange(-bet);

    let rotation = 0;
    const targetRotation = Math.random() * 10 + 5; // 5-15 full rotations
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      rotation = targetRotation * 2 * Math.PI * easeOut(progress);

      drawWheel(rotation);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Calculate final number
        const finalRotation = rotation % (2 * Math.PI);
        const segmentAngle = (2 * Math.PI) / numbers.length;
        const finalNumber = numbers[Math.floor(finalRotation / segmentAngle)];

        if (finalNumber === selectedNumber) {
          const winAmount = bet * 35; // 35:1 payout for single number
          onBalanceChange(winAmount);
          setResult({ message: `Você ganhou ${winAmount}!`, type: 'win' });
        } else {
          setResult({ message: 'Você perdeu!', type: 'lose' });
        }

        setGameStatus('idle');
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  useEffect(() => {
    const initialRotation = 0;
    drawWheel(initialRotation);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="game-card">
      <h2 className="game-title">Roleta</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
          min="1"
          max={balance}
          disabled={gameStatus !== 'idle'}
        />
        <Button
          onClick={spinWheel}
          disabled={gameStatus !== 'idle' || selectedNumber === null || bet > balance}
        >
          {gameStatus === 'idle' ? 'Girar' : 'Girando...'}
        </Button>
      </BetControls>

      <QuickBet>
        <QuickBetButton onClick={() => handleQuickBet(10)}>R$ 10</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(20)}>R$ 20</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(50)}>R$ 50</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(100)}>R$ 100</QuickBetButton>
      </QuickBet>

      <GameArea>
        <WheelContainer>
          <Pointer />
          <WheelCanvas ref={canvasRef} width={300} height={300} />
        </WheelContainer>

        <BettingTable>
          {numbers.map((number) => (
            <BettingSpot
              key={number}
              color={colors[number]}
              onClick={() => setSelectedNumber(number)}
              disabled={gameStatus !== 'idle'}
              style={{
                background: selectedNumber === number ? '#ffd700' : colors[number],
                color: selectedNumber === number ? '#1a1a2e' : 'white'
              }}
            >
              {number}
            </BettingSpot>
          ))}
        </BettingTable>

        {result && (
          <Result type={result.type}>
            {result.message}
          </Result>
        )}
      </GameArea>
    </div>
  );
};

export default Roulette; 