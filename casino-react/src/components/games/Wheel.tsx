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

const WheelContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`;

const WheelCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
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
  border-top: 30px solid #ff0000;
  z-index: 2;
`;

interface WheelProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Wheel: React.FC<WheelProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState<{ message: string; multiplier: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const segments = [
    { value: 2, color: '#FF0000', label: '2x' },
    { value: 3, color: '#000000', label: '3x' },
    { value: 5, color: '#FF0000', label: '5x' },
    { value: 10, color: '#000000', label: '10x' },
    { value: 20, color: '#FF0000', label: '20x' },
    { value: 50, color: '#000000', label: '50x' },
    { value: 100, color: '#FF0000', label: '100x' },
    { value: 0, color: '#000000', label: '0x' }
  ];

  useEffect(() => {
    drawWheel();
  }, [rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    const segmentAngle = (2 * Math.PI) / segments.length;
    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + rotation;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.stroke();

      // Draw labels
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(segment.label, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();
  };

  const spinWheel = () => {
    if (bet > balance) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setResult(null);

    const spins = 5; // Number of full rotations
    const extraDegrees = Math.random() * 360; // Random final position
    const totalRotation = spins * 360 + extraDegrees;
    const duration = 5000; // 5 seconds
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = startRotation + totalRotation * easeOut(progress);

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Calculate result
        const finalRotation = (currentRotation % 360) * (Math.PI / 180);
        const segmentIndex = Math.floor((2 * Math.PI - finalRotation) / ((2 * Math.PI) / segments.length));
        const segment = segments[segmentIndex % segments.length];

        if (segment.value > 0) {
          const winAmount = bet * segment.value;
          onBalanceChange(winAmount);
          setResult({
            message: `Você ganhou $${winAmount}!`,
            multiplier: segment.value
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

    animate();
  };

  return (
    <GameArea>
      <h2>Roda da Fortuna</h2>
      <BetControls>
        <BetInput
          type="number"
          min="1"
          max={balance}
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameActive}
        />
        <Button onClick={spinWheel} disabled={gameActive || bet > balance}>
          {gameActive ? 'Girando...' : 'Girar Roda'}
        </Button>
      </BetControls>

      <WheelContainer>
        <Pointer />
        <WheelCanvas
          ref={canvasRef}
          width={300}
          height={300}
        />
      </WheelContainer>

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

export default Wheel; 