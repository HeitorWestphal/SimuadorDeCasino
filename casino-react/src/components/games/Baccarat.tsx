import React, { useState } from 'react';
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

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
`;

const Hand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Card = styled.div`
  width: 60px;
  height: 90px;
  background: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
`;

interface BaccaratProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Baccarat: React.FC<BaccaratProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(1);
  const [betType, setBetType] = useState<'player' | 'banker' | 'tie'>('player');
  const [gameActive, setGameActive] = useState(false);
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [bankerCards, setBankerCards] = useState<number[]>([]);
  const [result, setResult] = useState<{ winner: string; multiplier: number } | null>(null);

  const getCardValue = (card: number) => {
    const value = card % 13;
    return value > 10 ? 0 : value;
  };

  const getHandScore = (cards: number[]) => {
    const score = cards.reduce((sum, card) => sum + getCardValue(card), 0);
    return score % 10;
  };

  const drawCard = () => {
    return Math.floor(Math.random() * 52);
  };

  const startGame = () => {
    if (bet > balance) return;
    onBalanceChange(-bet);
    setGameActive(true);
    setResult(null);

    // Deal initial cards
    const newPlayerCards = [drawCard(), drawCard()];
    const newBankerCards = [drawCard(), drawCard()];
    setPlayerCards(newPlayerCards);
    setBankerCards(newBankerCards);

    const playerScore = getHandScore(newPlayerCards);
    const bankerScore = getHandScore(newBankerCards);

    // Determine winner
    let winner: string;
    let multiplier: number;

    if (playerScore === bankerScore) {
      winner = 'tie';
      multiplier = 8;
    } else if (playerScore > bankerScore) {
      winner = 'player';
      multiplier = 2;
    } else {
      winner = 'banker';
      multiplier = 1.95;
    }

    setResult({ winner, multiplier });

    // Apply winnings
    if (winner === betType) {
      onBalanceChange(bet * multiplier);
    }
  };

  return (
    <GameArea>
      <h2>Baccarat</h2>
      <BetControls>
        <BetInput
          type="number"
          min="1"
          max={balance}
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameActive}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button
            onClick={() => setBetType('player')}
            style={{ background: betType === 'player' ? '#45a049' : '#4CAF50' }}
            disabled={gameActive}
          >
            Jogador (2x)
          </Button>
          <Button
            onClick={() => setBetType('banker')}
            style={{ background: betType === 'banker' ? '#45a049' : '#4CAF50' }}
            disabled={gameActive}
          >
            Banco (1.95x)
          </Button>
          <Button
            onClick={() => setBetType('tie')}
            style={{ background: betType === 'tie' ? '#45a049' : '#4CAF50' }}
            disabled={gameActive}
          >
            Empate (8x)
          </Button>
        </div>
        <Button onClick={startGame} disabled={gameActive || bet > balance}>
          {gameActive ? 'Jogo em andamento...' : 'Iniciar Jogo'}
        </Button>
      </BetControls>

      <CardsContainer>
        <Hand>
          <h3>Jogador</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {playerCards.map((card, index) => (
              <Card key={index}>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][card % 13]}
              </Card>
            ))}
          </div>
          <Score>Pontuação: {getHandScore(playerCards)}</Score>
        </Hand>

        <Hand>
          <h3>Banco</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {bankerCards.map((card, index) => (
              <Card key={index}>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][card % 13]}
              </Card>
            ))}
          </div>
          <Score>Pontuação: {getHandScore(bankerCards)}</Score>
        </Hand>
      </CardsContainer>

      {result && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          {result.winner === betType ? (
            <>
              Vitória! Multiplicador: {result.multiplier}x
              <br />
              Ganho: ${(bet * result.multiplier).toFixed(2)}
            </>
          ) : (
            'Derrota!'
          )}
        </div>
      )}
    </GameArea>
  );
};

export default Baccarat; 