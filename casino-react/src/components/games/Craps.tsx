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

const DiceContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
`;

const Die = styled.div`
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

const GamePhase = styled.div`
  font-size: 18px;
  margin: 10px 0;
  text-align: center;
`;

interface CrapsProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Craps: React.FC<CrapsProps> = ({ balance, onBalanceChange }) => {
  const [bet, setBet] = useState(100);
  const [dice, setDice] = useState([1, 1]);
  const [gamePhase, setGamePhase] = useState<'initial' | 'point' | 'final'>('initial');
  const [point, setPoint] = useState(0);
  const [result, setResult] = useState<{ message: string; type: 'win' | 'lose' } | null>(null);

  const rollDice = () => {
    if (bet <= 0 || bet > balance) {
      return;
    }

    if (gamePhase === 'initial') {
      onBalanceChange(-bet);
    }

    const newDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    setDice(newDice);
    const sum = newDice[0] + newDice[1];

    if (gamePhase === 'initial') {
      // Primeira rodada
      if (sum === 7 || sum === 11) {
        // Natural - Vitória
        onBalanceChange(bet * 2);
        setResult({ message: `Natural! ${sum} - Você ganhou $${bet * 2}!`, type: 'win' });
        setGamePhase('final');
      } else if (sum === 2 || sum === 3 || sum === 12) {
        // Craps - Derrota
        setResult({ message: `Craps! ${sum} - Você perdeu!`, type: 'lose' });
        setGamePhase('final');
      } else {
        // Point
        setPoint(sum);
        setGamePhase('point');
        setResult({ message: `Point: ${sum}`, type: 'win' });
      }
    } else if (gamePhase === 'point') {
      // Rodadas subsequentes
      if (sum === point) {
        // Acertou o point - Vitória
        onBalanceChange(bet * 2);
        setResult({ message: `Point! ${sum} - Você ganhou $${bet * 2}!`, type: 'win' });
        setGamePhase('final');
      } else if (sum === 7) {
        // Sete - Derrota
        setResult({ message: `Sete! ${sum} - Você perdeu!`, type: 'lose' });
        setGamePhase('final');
      } else {
        // Continua jogando
        setResult({ message: `Jogue novamente! Point: ${point}`, type: 'win' });
      }
    }
  };

  const startNewGame = () => {
    setDice([1, 1]);
    setGamePhase('initial');
    setPoint(0);
    setResult(null);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">🎲 Craps 🎲</h2>
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
        <DiceContainer>
          <Die>{dice[0]}</Die>
          <Die>{dice[1]}</Die>
        </DiceContainer>
        {gamePhase === 'point' && (
          <GamePhase>
            Point: {point}
          </GamePhase>
        )}
      </GameArea>
      {gamePhase !== 'final' && (
        <button className="btn" onClick={rollDice}>
          {gamePhase === 'initial' ? 'Começar Jogo' : 'Jogar Dados'}
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

export default Craps; 