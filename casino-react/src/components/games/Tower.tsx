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

const TowerContainer = styled.div`
  width: 300px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  background: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
`;

const Floor = styled.div<{ level: number; active: boolean }>`
  position: absolute;
  width: 100%;
  height: 40px;
  background: ${props => props.active ? '#4CAF50' : '#444'};
  bottom: ${props => props.level * 40}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
`;

const Ball = styled.div<{ x: number; y: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #ff4444;
  border-radius: 50%;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: all 0.1s linear;
`;

interface TowerProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Tower: React.FC<TowerProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 140, y: 0 });
  const [currentFloor, setCurrentFloor] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  const startTime = useRef<number>(0);

  const floors = [
    { multiplier: 1.2 },
    { multiplier: 1.5 },
    { multiplier: 2 },
    { multiplier: 3 },
    { multiplier: 5 },
    { multiplier: 10 },
    { multiplier: 20 },
    { multiplier: 50 },
    { multiplier: 100 },
    { multiplier: 1000 }
  ];

  const startGame = () => {
    if (bet > balance) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setBallPosition({ x: 140, y: 0 });
    setCurrentFloor(0);
    setMultiplier(0);
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      const newY = elapsed * 100; // Fall speed
      const newX = 140 + Math.sin(elapsed * 5) * 20; // Side to side movement

      if (newY >= 400) {
        setGameActive(false);
        return;
      }

      // Check if ball hit a floor
      const floorIndex = Math.floor(newY / 40);
      if (floorIndex > currentFloor) {
        setCurrentFloor(floorIndex);
        if (floorIndex < floors.length) {
          setMultiplier(floors[floorIndex].multiplier);
          onBalanceChange(bet * floors[floorIndex].multiplier);
        }
      }

      setBallPosition({ x: newX, y: newY });
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
      <h2>Tower</h2>
      <BetControls>
        <BetInput
          type="number"
          min="1"
          max={balance}
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameActive}
        />
        <Button onClick={startGame} disabled={gameActive || bet > balance}>
          {gameActive ? 'Jogo em andamento...' : 'Iniciar Jogo'}
        </Button>
      </BetControls>

      <TowerContainer>
        {floors.map((floor, index) => (
          <Floor
            key={index}
            level={index}
            active={index === currentFloor}
          >
            {floor.multiplier}x
          </Floor>
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} />
      </TowerContainer>

      {multiplier > 0 && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Multiplicador: {multiplier}x
          <br />
          Ganho: ${(bet * multiplier).toFixed(2)}
        </div>
      )}
    </GameArea>
  );
};

export default Tower; 