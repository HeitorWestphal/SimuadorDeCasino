import React, { useState } from 'react';
import styled from 'styled-components';

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
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div<{ selected?: boolean }>`
  width: 60px;
  height: 90px;
  background: ${props => props.selected ? '#4CAF50' : 'white'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-5px);
  }
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
`;

const HandRank = styled.div`
  font-size: 18px;
  margin: 10px 0;
  text-align: center;
`;

interface VideoPokerProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

interface Card {
  suit: string;
  value: string;
  selected: boolean;
}

const VideoPoker: React.FC<VideoPokerProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [cards, setCards] = useState<Card[]>([]);
  const [handRank, setHandRank] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<'initial' | 'draw' | 'final'>('initial');
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = () => {
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value, selected: false });
      }
    }
    return deck;
  };

  const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const dealInitialHand = () => {
    if (bet <= 0 || bet > balance) {
      return;
    }

    onBalanceChange(-bet);
    const deck = shuffleDeck(createDeck());
    const initialHand = deck.slice(0, 5);
    setCards(initialHand);
    setGamePhase('draw');
    setResult(null);
  };

  const toggleCardSelection = (index: number) => {
    if (gamePhase !== 'draw') return;

    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], selected: !newCards[index].selected };
      return newCards;
    });
  };

  const drawNewCards = () => {
    const deck = shuffleDeck(createDeck());
    const newCards = [...cards];
    let deckIndex = 5;

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].selected) {
        newCards[i] = { ...deck[deckIndex], selected: false };
        deckIndex++;
      }
    }

    setCards(newCards);
    setGamePhase('final');
    evaluateHand(newCards);
  };

  const evaluateHand = (hand: Card[]) => {
    const values = hand.map(card => card.value);
    const suits = hand.map(card => card.suit);
    const uniqueValues = new Set(values);
    const uniqueSuits = new Set(suits);

    let rank = '';
    let multiplier = 0;

    // Royal Flush
    if (uniqueSuits.size === 1 && 
        values.includes('A') && 
        values.includes('K') && 
        values.includes('Q') && 
        values.includes('J') && 
        values.includes('10')) {
      rank = 'Royal Flush';
      multiplier = 250;
    }
    // Straight Flush
    else if (uniqueSuits.size === 1 && isStraight(values)) {
      rank = 'Straight Flush';
      multiplier = 50;
    }
    // Four of a Kind
    else if (uniqueValues.size === 2 && 
             values.filter(v => v === values[0]).length === 4) {
      rank = 'Four of a Kind';
      multiplier = 25;
    }
    // Full House
    else if (uniqueValues.size === 2) {
      rank = 'Full House';
      multiplier = 9;
    }
    // Flush
    else if (uniqueSuits.size === 1) {
      rank = 'Flush';
      multiplier = 6;
    }
    // Straight
    else if (isStraight(values)) {
      rank = 'Straight';
      multiplier = 4;
    }
    // Three of a Kind
    else if (uniqueValues.size === 3 && 
             values.filter(v => v === values[0]).length === 3) {
      rank = 'Three of a Kind';
      multiplier = 3;
    }
    // Two Pair
    else if (uniqueValues.size === 3) {
      rank = 'Two Pair';
      multiplier = 2;
    }
    // One Pair
    else if (uniqueValues.size === 4) {
      rank = 'One Pair';
      multiplier = 1;
    }
    // High Card
    else {
      rank = 'High Card';
      multiplier = 0;
    }

    setHandRank(rank);
    const winAmount = bet * multiplier;
    
    if (multiplier > 0) {
      onBalanceChange(winAmount);
      setResult({ 
        message: `${rank} - Você ganhou $${winAmount}!`, 
        type: 'win' 
      });
    } else {
      setResult({ 
        message: `${rank} - Você perdeu!`, 
        type: 'lose' 
      });
    }
  };

  const isStraight = (values: string[]) => {
    const valueOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const sortedValues = [...values].sort((a, b) => 
      valueOrder.indexOf(a) - valueOrder.indexOf(b)
    );
    
    // Verificar sequência normal
    let isSequential = true;
    for (let i = 1; i < sortedValues.length; i++) {
      if (valueOrder.indexOf(sortedValues[i]) !== valueOrder.indexOf(sortedValues[i-1]) + 1) {
        isSequential = false;
        break;
      }
    }

    // Verificar sequência com Ás no final (A-2-3-4-5)
    if (!isSequential && sortedValues.includes('A')) {
      const aceLastValues = [...sortedValues].filter(v => v !== 'A');
      aceLastValues.push('A');
      isSequential = true;
      for (let i = 1; i < aceLastValues.length; i++) {
        if (valueOrder.indexOf(aceLastValues[i]) !== valueOrder.indexOf(aceLastValues[i-1]) + 1) {
          isSequential = false;
          break;
        }
      }
    }

    return isSequential;
  };

  const startNewGame = () => {
    setCards([]);
    setHandRank('');
    setGamePhase('initial');
    setResult(null);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎮 Video Poker 🎮</h2>
      <BetControls>
        <BetInput
          type="number"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value) || 0)}
          placeholder="Aposta"
          min="1"
        />
      </BetControls>
      <GameArea>
        <CardsContainer>
          {cards.map((card, index) => (
            <Card
              key={index}
              selected={card.selected}
              onClick={() => toggleCardSelection(index)}
            >
              {card.suit === '♥' || card.suit === '♦' ? (
                <span style={{ color: 'red' }}>{card.value}{card.suit}</span>
              ) : (
                <span>{card.value}{card.suit}</span>
              )}
            </Card>
          ))}
        </CardsContainer>
        {handRank && <HandRank>{handRank}</HandRank>}
      </GameArea>
      {gamePhase === 'initial' && (
        <button className="btn" onClick={dealInitialHand}>
          Distribuir Cartas
        </button>
      )}
      {gamePhase === 'draw' && (
        <button className="btn" onClick={drawNewCards}>
          Trocar Cartas Selecionadas
        </button>
      )}
      {gamePhase === 'final' && (
        <button className="btn" onClick={startNewGame}>
          Novo Jogo
        </button>
      )}
      {result && (
        <div className={`result ${result.type}`} style={{ display: 'block' }}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default VideoPoker; 