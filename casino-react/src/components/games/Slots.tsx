import { useState } from 'react';
import styled from 'styled-components';

interface SlotsProps {
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

const SlotsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const Reel = styled.div<{ spinning: boolean }>`
  width: 80px;
  height: 100px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  animation: ${props => props.spinning ? 'spin 0.5s linear infinite' : 'none'};

  @keyframes spin {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
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

const TurboButton = styled(Button)<{ active?: boolean }>`
  background: ${props => props.active ? 'linear-gradient(45deg, #e74c3c, #c0392b)' : 'linear-gradient(45deg, #2ecc71, #27ae60)'};
  color: white;
  font-size: 14px;
  padding: 8px 15px;
`;

const Slots: React.FC<SlotsProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);
  const [turboMode, setTurboMode] = useState(false);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
  const multipliers = {
    '🍒': 10,
    '🍋': 8,
    '🍊': 6,
    '🍇': 4,
    '💎': 20,
    '7️⃣': 50
  };

  const spin = () => {
    if (bet > balance) return;

    setSpinning(true);
    setResult(null);
    onBalanceChange(-bet);

    if (turboMode) {
      // Turbo mode: instant result
      const newReels = symbols.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      setReels(newReels);
      checkWin(newReels);
      setSpinning(false);
    } else {
      // Normal mode: animated spin
      let spins = 0;
      const spinInterval = setInterval(() => {
        const newReels = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        setReels(newReels);
        spins++;

        if (spins >= 20) {
          clearInterval(spinInterval);
          const finalReels = symbols.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
          setReels(finalReels);
          checkWin(finalReels);
          setSpinning(false);
        }
      }, 100);
    }
  };

  const checkWin = (finalReels: string[]) => {
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      const multiplier = multipliers[finalReels[0] as keyof typeof multipliers];
      const winAmount = bet * multiplier;
      onBalanceChange(winAmount);
      setResult({
        message: `JACKPOT! ${finalReels.join('')} - Você ganhou ${winAmount}!`,
        type: 'win'
      });
    } else {
      setResult({
        message: `${finalReels.join('')} - Você perdeu!`,
        type: 'lose'
      });
    }
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  const toggleTurbo = () => {
    setTurboMode(!turboMode);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🍒 Caça-Níqueis 🍒</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
          min="1"
          max={balance}
          disabled={spinning}
        />
        <Button onClick={spin} disabled={spinning}>
          {spinning ? 'Girando...' : 'Girar'}
        </Button>
        <TurboButton onClick={toggleTurbo} active={turboMode}>
          Modo Turbo: {turboMode ? 'ON' : 'OFF'}
        </TurboButton>
      </BetControls>

      <QuickBet>
        <QuickBetButton onClick={() => handleQuickBet(25)}>R$ 25</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(100)}>R$ 100</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(250)}>R$ 250</QuickBetButton>
      </QuickBet>

      <GameArea>
        <SlotsContainer>
          {reels.map((symbol, index) => (
            <Reel key={index} spinning={spinning}>
              {symbol}
            </Reel>
          ))}
        </SlotsContainer>
        <div style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>
          🍒🍒🍒 = 10x | 🍋🍋🍋 = 8x | 🍊🍊🍊 = 6x<br />
          💎💎💎 = 20x | 7️⃣7️⃣7️⃣ = 50x
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

export default Slots; 