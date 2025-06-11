import React, { useState } from 'react';
import styled from 'styled-components';

interface HiLoProps {
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

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
`;

const Card = styled.div<{ value: number; suit: string }>`
  width: 80px;
  height: 120px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: ${props => ['♥', '♦'].includes(props.suit) ? '#e74c3c' : '#2c3e50'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;

  &::before {
    content: '${props => props.value}';
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
  }

  &::after {
    content: '${props => props.suit}';
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 16px;
  }
`;

const PredictionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const PredictionButton = styled.button<{ type: 'higher' | 'lower' }>`
  background: ${props => props.type === 'higher' ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  color: ${props => props.type === 'higher' ? '#2ecc71' : '#e74c3c'};
  border: 1px solid ${props => props.type === 'higher' ? '#2ecc71' : '#e74c3c'};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.type === 'higher' ? 'rgba(39, 174, 96, 0.5)' : 'rgba(231, 76, 60, 0.5)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const HiLo: React.FC<HiLoProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(10);
  const [gameStatus, setGameStatus] = useState<'idle' | 'running'>('idle');
  const [currentCard, setCurrentCard] = useState<{ value: number; suit: string } | null>(null);
  const [nextCard, setNextCard] = useState<{ value: number; suit: string } | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getRandomCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = Math.floor(Math.random() * 13) + 1;
    return { value, suit };
  };

  const startGame = () => {
    if (bet > balance) return;

    setGameStatus('running');
    setMultiplier(1);
    setResult(null);
    onBalanceChange(-bet);

    const firstCard = getRandomCard();
    setCurrentCard(firstCard);
    setNextCard(null);
  };

  const makePrediction = (isHigher: boolean) => {
    if (!currentCard) return;

    const newCard = getRandomCard();
    setNextCard(newCard);

    const currentValue = currentCard.value;
    const nextValue = newCard.value;

    if (
      (isHigher && nextValue > currentValue) ||
      (!isHigher && nextValue < currentValue)
    ) {
      const newMultiplier = multiplier * 1.5;
      setMultiplier(newMultiplier);
      setCurrentCard(newCard);
      setNextCard(null);
    } else {
      setGameStatus('idle');
      setResult({ message: 'Você perdeu!', type: 'lose' });
    }
  };

  const cashOut = () => {
    if (!currentCard) return;

    const winAmount = Math.floor(bet * multiplier);
    onBalanceChange(winAmount);
    setGameStatus('idle');
    setResult({ message: `Você ganhou ${winAmount}!`, type: 'win' });
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">Hi-Lo</h2>
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
          onClick={startGame}
          disabled={gameStatus !== 'idle' || bet > balance}
        >
          {gameStatus === 'idle' ? 'Iniciar' : 'Aguardando...'}
        </Button>
        <Button
          onClick={cashOut}
          disabled={gameStatus !== 'running'}
          style={{
            background: gameStatus === 'running'
              ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
              : undefined
          }}
        >
          Cash Out
        </Button>
      </BetControls>

      <QuickBet>
        <QuickBetButton onClick={() => handleQuickBet(10)}>R$ 10</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(20)}>R$ 20</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(50)}>R$ 50</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(100)}>R$ 100</QuickBetButton>
      </QuickBet>

      <GameArea>
        <CardContainer>
          {currentCard && (
            <Card value={currentCard.value} suit={currentCard.suit}>
              {values[currentCard.value - 1]}
            </Card>
          )}
          {nextCard && (
            <Card value={nextCard.value} suit={nextCard.suit}>
              {values[nextCard.value - 1]}
            </Card>
          )}
        </CardContainer>

        {gameStatus === 'running' && !nextCard && (
          <PredictionButtons>
            <PredictionButton
              type="higher"
              onClick={() => makePrediction(true)}
            >
              Maior
            </PredictionButton>
            <PredictionButton
              type="lower"
              onClick={() => makePrediction(false)}
            >
              Menor
            </PredictionButton>
          </PredictionButtons>
        )}

        {gameStatus === 'running' && (
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
            Multiplicador: {multiplier.toFixed(1)}x
          </div>
        )}

        {result && (
          <Result type={result.type}>
            {result.message}
          </Result>
        )}
      </GameArea>
    </div>
  );
};

export default HiLo; 