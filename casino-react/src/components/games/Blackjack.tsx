import React, { useState } from 'react';
import styled from 'styled-components';

interface BlackjackProps {
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
  gap: 20px;
`;

const PlayerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const DealerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ScoreDisplay = styled.div`
  font-size: 18px;
  color: #ffd700;
  margin-bottom: 10px;
`;

const Cards = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div<{ isRed?: boolean }>`
  width: 60px;
  height: 84px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.isRed ? '#e74c3c' : 'black'};
  font-size: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Result = styled.div<{ type: 'win' | 'lose' | 'push' }>`
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background: ${props => {
    switch (props.type) {
      case 'win': return 'rgba(39, 174, 96, 0.3)';
      case 'lose': return 'rgba(231, 76, 60, 0.3)';
      case 'push': return 'rgba(241, 196, 15, 0.3)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'win': return '#2ecc71';
      case 'lose': return '#e74c3c';
      case 'push': return '#f1c40f';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'win': return '#2ecc71';
      case 'lose': return '#e74c3c';
      case 'push': return '#f1c40f';
    }
  }};
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

const Blackjack: React.FC<BlackjackProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(10);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'dealer-turn'>('idle');
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [dealerCards, setDealerCards] = useState<number[]>([]);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' | 'push' } | null>(null);

  const getCardValue = (card: number): number => {
    const value = card % 13;
    return value === 0 ? 11 : value > 10 ? 10 : value;
  };

  const getCardDisplay = (card: number): string => {
    const value = card % 13;
    const suit = Math.floor(card / 13);
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return `${values[value]}${suits[suit]}`;
  };

  const isRedCard = (card: number): boolean => {
    const suit = Math.floor(card / 13);
    return suit === 1 || suit === 2;
  };

  const calculateHandValue = (cards: number[]): number => {
    let value = 0;
    let aces = 0;

    cards.forEach(card => {
      const cardValue = getCardValue(card);
      if (cardValue === 11) {
        aces++;
      }
      value += cardValue;
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const startGame = () => {
    if (bet > balance) return;

    const deck = Array.from({ length: 52 }, (_, i) => i);
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const newPlayerCards = [deck[0], deck[2]];
    const newDealerCards = [deck[1], deck[3]];

    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameStatus('playing');
    setResult(null);
    onBalanceChange(-bet);
  };

  const hit = () => {
    if (gameStatus !== 'playing') return;

    const deck = Array.from({ length: 52 }, (_, i) => i);
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const playerValue = calculateHandValue(newPlayerCards);
    if (playerValue > 21) {
      endGame('lose');
    }
  };

  const stand = () => {
    if (gameStatus !== 'playing') return;
    setGameStatus('dealer-turn');
    dealerTurn();
  };

  const dealerTurn = () => {
    let currentDealerCards = [...dealerCards];
    let dealerValue = calculateHandValue(currentDealerCards);

    while (dealerValue < 17) {
      const deck = Array.from({ length: 52 }, (_, i) => i);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      const newCard = deck[0];
      currentDealerCards = [...currentDealerCards, newCard];
      dealerValue = calculateHandValue(currentDealerCards);
    }

    setDealerCards(currentDealerCards);
    determineWinner(dealerValue);
  };

  const determineWinner = (dealerValue: number) => {
    const playerValue = calculateHandValue(playerCards);

    if (dealerValue > 21) {
      endGame('win');
    } else if (playerValue > dealerValue) {
      endGame('win');
    } else if (playerValue < dealerValue) {
      endGame('lose');
    } else {
      endGame('push');
    }
  };

  const endGame = (result: 'win' | 'lose' | 'push') => {
    setGameStatus('idle');
    switch (result) {
      case 'win':
        setResult({ message: 'Você ganhou!', type: 'win' });
        onBalanceChange(bet * 2);
        break;
      case 'lose':
        setResult({ message: 'Você perdeu!', type: 'lose' });
        break;
      case 'push':
        setResult({ message: 'Empate!', type: 'push' });
        onBalanceChange(bet);
        break;
    }
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  const displayCards = (cards: number[], containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    cards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      if (isRedCard(card)) {
        cardDiv.classList.add('red');
      }
      cardDiv.textContent = getCardDisplay(card);
      container.appendChild(cardDiv);
    });
  };

  return (
    <div className="game-card">
      <h2 className="game-title">Blackjack</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
          min="1"
          max={balance}
          disabled={gameStatus !== 'idle'}
        />
        <Button onClick={startGame} disabled={gameStatus !== 'idle' || bet > balance}>
          Iniciar Jogo
        </Button>
      </BetControls>

      <QuickBet>
        <QuickBetButton onClick={() => handleQuickBet(10)}>R$ 10</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(20)}>R$ 20</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(50)}>R$ 50</QuickBetButton>
        <QuickBetButton onClick={() => handleQuickBet(100)}>R$ 100</QuickBetButton>
      </QuickBet>

      <GameArea>
        <DealerSection>
          <ScoreDisplay>Dealer: {calculateHandValue(dealerCards)}</ScoreDisplay>
          <Cards id="dealer-cards">
            {dealerCards.map((card, index) => (
              <Card key={index} isRed={isRedCard(card)}>
                {getCardDisplay(card)}
              </Card>
            ))}
          </Cards>
        </DealerSection>

        <PlayerSection>
          <ScoreDisplay>Você: {calculateHandValue(playerCards)}</ScoreDisplay>
          <Cards id="player-cards">
            {playerCards.map((card, index) => (
              <Card key={index} isRed={isRedCard(card)}>
                {getCardDisplay(card)}
              </Card>
            ))}
          </Cards>
        </PlayerSection>

        {gameStatus === 'playing' && (
          <div>
            <Button onClick={hit}>Hit</Button>
            <Button onClick={stand}>Stand</Button>
          </div>
        )}
      </GameArea>

      {result && (
        <Result type={result.type}>
          {result.message}
        </Result>
      )}
    </div>
  );
};

export default Blackjack; 