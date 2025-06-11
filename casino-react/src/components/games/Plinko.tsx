import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface PlinkoProps {
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

const PlinkoContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 20px 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Ball = styled.div<{ x: number; y: number }>`
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: all 0.1s linear;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const Peg = styled.div<{ x: number; y: number }>`
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`;

const Bucket = styled.div<{ x: number; multiplier: number }>`
  width: 60px;
  height: 40px;
  background: ${props => props.multiplier >= 2 ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  border: 1px solid ${props => props.multiplier >= 2 ? '#2ecc71' : '#e74c3c'};
  position: absolute;
  left: ${props => props.x}px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.multiplier >= 2 ? '#2ecc71' : '#e74c3c'};
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

const Plinko: React.FC<PlinkoProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [gameStatus, setGameStatus] = useState<'idle' | 'dropping' | 'result'>('idle');
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);
  const [ballPath, setBallPath] = useState<number[]>([]);
  const [finalBucket, setFinalBucket] = useState<number | null>(null);
  const [ballPosition, setBallPosition] = useState<{ row: number; col: number } | null>(null);
  const rows = 8;
  const buckets = 9;
  const multipliers = [0, 0.5, 1, 2, 5, 2, 1, 0.5, 0];

  // Inicia o jogo
  const startGame = () => {
    if (bet <= 0 || bet > balance || gameStatus !== 'idle') return;
    onBalanceChange(-bet);
    setGameStatus('dropping');
    setResult(null);
    setFinalBucket(null);
    setBallPath([]);
    setBallPosition({ row: 0, col: Math.floor(buckets / 2) });
    // Gera o caminho da bolinha (esquerda ou direita aleatório)
    const path: number[] = [];
    let col = Math.floor(buckets / 2);
    for (let i = 0; i < rows; i++) {
      const move = Math.random() < 0.5 ? -1 : 1;
      col = Math.max(0, Math.min(buckets - 1, col + move));
      path.push(col);
    }
    setBallPath(path);
  };

  // Animação da bolinha caindo
  useEffect(() => {
    if (gameStatus !== 'dropping' || ballPath.length === 0) return;
    let step = 0;
    setBallPosition({ row: 0, col: Math.floor(buckets / 2) });
    const interval = setInterval(() => {
      if (step < ballPath.length) {
        setBallPosition({ row: step + 1, col: ballPath[step] });
        step++;
      } else {
        clearInterval(interval);
        setFinalBucket(ballPath[ballPath.length - 1]);
        setGameStatus('result');
      }
    }, 200);
    return () => clearInterval(interval);
  }, [gameStatus, ballPath]);

  // Calcula o resultado ao final
  useEffect(() => {
    if (gameStatus === 'result' && finalBucket !== null && result === null) {
      const multiplier = multipliers[finalBucket];
      if (multiplier > 0) {
        const win = Math.floor(bet * multiplier);
        onBalanceChange(win);
        setResult({ message: `Parabéns! Caiu no bucket ${finalBucket + 1} (x${multiplier}) e você ganhou $${win}!`, type: 'win' });
      } else {
        setResult({ message: `Caiu no bucket ${finalBucket + 1} (x0). Você perdeu!`, type: 'lose' });
      }
    }
  }, [gameStatus, finalBucket, bet, multipliers, onBalanceChange, result]);

  // Permite jogar novamente após o resultado
  const resetGame = () => {
    setGameStatus('idle');
    setResult(null);
    setFinalBucket(null);
    setBallPath([]);
    setBallPosition(null);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎱 Plinko 🎱</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={e => setBet(Number(e.target.value))}
          min="1"
          max={balance}
          disabled={gameStatus !== 'idle'}
        />
        <QuickBet>
          <QuickBetButton onClick={() => setBet(50)} disabled={gameStatus !== 'idle'}>$50</QuickBetButton>
          <QuickBetButton onClick={() => setBet(100)} disabled={gameStatus !== 'idle'}>$100</QuickBetButton>
          <QuickBetButton onClick={() => setBet(500)} disabled={gameStatus !== 'idle'}>$500</QuickBetButton>
        </QuickBet>
      </BetControls>

      <GameArea>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Plinko grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(rows + 1)].map((_, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {[...Array(buckets)].map((_, colIdx) => {
                  // Mostra a bolinha
                  const isBall = ballPosition && ballPosition.row === rowIdx && ballPosition.col === colIdx;
                  // Mostra o bucket final
                  const isBucket = rowIdx === rows && finalBucket === colIdx;
                  return (
                    <div
                      key={colIdx}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: isBall ? '#ffd700' : isBucket ? (multipliers[colIdx] > 0 ? '#2ecc71' : '#e74c3c') : 'rgba(255,255,255,0.1)',
                        border: isBall ? '2px solid #ffd700' : isBucket ? '2px solid #2ecc71' : '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: isBall ? '#222' : isBucket ? '#fff' : '#888',
                        fontSize: 14,
                        boxShadow: isBall ? '0 0 10px #ffd700' : undefined,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isBall ? '●' : isBucket ? `x${multipliers[colIdx]}` : ''}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Linha de multiplicadores */}
            <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 6 }}>
              {multipliers.map((multi, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 24,
                    textAlign: 'center',
                    color: multi > 0 ? '#ffd700' : '#e74c3c',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}
                >
                  x{multi}
                </div>
              ))}
            </div>
          </div>
        </div>
        {result && (
          <Result type={result.type}>
            {result.message}
          </Result>
        )}
        {gameStatus === 'idle' && (
          <Button onClick={startGame}>Jogar</Button>
        )}
        {gameStatus === 'result' && (
          <Button onClick={resetGame}>Jogar Novamente</Button>
        )}
      </GameArea>
    </div>
  );
};

export default Plinko; 