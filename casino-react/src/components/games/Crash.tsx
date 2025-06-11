import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface CrashProps {
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
  position: relative;
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

const CrashGraph = styled.div`
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Multiplier = styled.div<{ color: string }>`
  font-size: 48px;
  font-weight: bold;
  color: ${props => props.color};
  text-shadow: 0 0 10px ${props => props.color}80;
  margin: 20px 0;
`;

const History = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const HistoryItem = styled.div<{ crashed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: ${props => props.crashed ? 'rgba(231, 76, 60, 0.3)' : 'rgba(39, 174, 96, 0.3)'};
  color: ${props => props.crashed ? '#e74c3c' : '#2ecc71'};
  border: 1px solid ${props => props.crashed ? '#e74c3c' : '#2ecc71'};
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

const GraphContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
`;

const GraphCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Plane = styled.div<{ x: number; y: number; rotation: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd700"><path d="M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translate(-50%, -50%) rotate(${props => props.rotation}deg);
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transition: all 0.1s linear;
`;

const MultiplierDisplay = styled.div`
  font-size: 40px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin: 10px 0;
`;

const Crash: React.FC<CrashProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'crashed'>('idle');
  const [multiplier, setMultiplier] = useState(1);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);
  const [graphPoints, setGraphPoints] = useState<{ x: number; y: number }[]>([]);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 100, rotation: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const crashPointRef = useRef<number | undefined>(undefined);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw graph line
    if (graphPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.moveTo(graphPoints[0].x, graphPoints[0].y);

      for (let i = 1; i < graphPoints.length; i++) {
        ctx.lineTo(graphPoints[i].x, graphPoints[i].y);
      }

      ctx.stroke();
    }
  }, [graphPoints]);

  const updatePlanePosition = useCallback((currentMultiplier: number) => {
    const maxHeight = 200; // altura máxima do container
    const progress = Math.min(currentMultiplier / 10, 1); // normaliza para 0-1, com teto em 10x
    const y = maxHeight - (progress * maxHeight);
    const x = progress * 100; // move da esquerda para a direita
    const rotation = Math.min(currentMultiplier * 5, 45); // rotaciona até 45 graus

    setPlanePosition({ x, y, rotation });
  }, []);

  const startGame = useCallback(() => {
    if (gameStatus !== 'idle' || bet <= 0 || bet > balance) return;

    onBalanceChange(-bet);
    setGameStatus('playing');
    setMultiplier(1);
    setGraphPoints([{ x: 0, y: 200 }]);
    setPlanePosition({ x: 0, y: 200, rotation: 0 });
    setResult(null);

    // Gerar ponto de crash
    const crashPoint = Math.random() < 0.3 
      ? 1 + Math.random() * 2 // 30% chance de crash entre 1x e 3x
      : 1 + Math.random() * 9; // 70% chance de crash entre 1x e 10x
    crashPointRef.current = crashPoint;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - (startTimeRef.current || now)) / 1000;
      const currentMultiplier = 1 + (elapsed * 0.5); // Aumenta 0.5x por segundo

      if (currentMultiplier >= (crashPointRef.current || 10)) {
        setGameStatus('crashed');
        setResult({ message: `Crash em ${currentMultiplier.toFixed(2)}x!`, type: 'lose' });
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Reset do jogo após 2 segundos
        setTimeout(() => {
          setGameStatus('idle');
          setMultiplier(1);
          setGraphPoints([]);
          setPlanePosition({ x: 0, y: 200, rotation: 0 });
        }, 2000);
        return;
      }

      setMultiplier(currentMultiplier);
      
      // Atualizar pontos do gráfico
      const newPoint = {
        x: (elapsed * 50) % 300, // Move da esquerda para a direita
        y: 200 - (currentMultiplier * 20) // Move de baixo para cima
      };
      setGraphPoints(prev => [...prev, newPoint]);
      
      // Atualizar posição do avião
      updatePlanePosition(currentMultiplier);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [bet, balance, gameStatus, onBalanceChange, updatePlanePosition]);

  const cashOut = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const winAmount = Math.floor(bet * multiplier);
    onBalanceChange(winAmount);
    setGameStatus('idle');
    setResult({ message: `Retirada em ${multiplier.toFixed(2)}x! Ganhou $${winAmount}`, type: 'win' });
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset do jogo após 2 segundos
    setTimeout(() => {
      setMultiplier(1);
      setGraphPoints([]);
      setPlanePosition({ x: 0, y: 200, rotation: 0 });
    }, 2000);
  }, [bet, gameStatus, multiplier, onBalanceChange]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph, graphPoints]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="game-card">
      <h2 className="game-title">Crash</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          min="1"
          max={balance}
          disabled={gameStatus === 'playing'}
        />
        <QuickBet>
          <QuickBetButton onClick={() => setBet(50)} disabled={gameStatus === 'playing'}>$50</QuickBetButton>
          <QuickBetButton onClick={() => setBet(100)} disabled={gameStatus === 'playing'}>$100</QuickBetButton>
          <QuickBetButton onClick={() => setBet(500)} disabled={gameStatus === 'playing'}>$500</QuickBetButton>
        </QuickBet>
      </BetControls>

      <GameArea>
        <MultiplierDisplay>{multiplier.toFixed(2)}x</MultiplierDisplay>
        <GraphContainer>
          <GraphCanvas ref={canvasRef} />
          <Plane x={planePosition.x} y={planePosition.y} rotation={planePosition.rotation} />
        </GraphContainer>
        <div>
          <Button onClick={startGame} disabled={gameStatus === 'playing'}>
            Fazer Aposta
          </Button>
          <Button onClick={cashOut} disabled={gameStatus !== 'playing'}>
            Retirar
          </Button>
        </div>
      </GameArea>

      {result && (
        <Result type={result.type}>
          {result.message}
        </Result>
      )}
    </div>
  );
};

export default Crash; 