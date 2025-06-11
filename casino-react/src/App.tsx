import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Blackjack from './components/games/Blackjack';
import DiceGame from './components/games/Dice';
import Roulette from './components/games/Roulette';
import Slots from './components/games/Slots';
import AmericanRoulette from './components/games/AmericanRoulette';
import Bingo from './components/games/Bingo';
import Keno from './components/games/Keno';
import Crash from './components/games/Crash';
import Mines from './components/games/Mines';
import Baccarat from './components/games/Baccarat';
import SicBo from './components/games/SicBo';
import Wheel from './components/games/Wheel';
import Plinko from './components/games/Plinko';
import Limbo from './components/games/Limbo';
import HiLo from './components/games/HiLo';
import CasinoLogo from './Logo.png';
import ReactDOM from 'react-dom';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.img`
  height: 60px;
`;

const BalanceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Balance = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
`;

const RechargeMenu = styled.div`
  position: relative;
`;

const RechargeButton = styled.button`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border: none;
  padding: 12px 25px;
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
`;

const RechargeOptions = styled.div`
  position: fixed;
  top: 90px;
  right: 40px;
  background: rgba(26, 26, 46, 0.98);
  border-radius: 12px;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 260px;
  backdrop-filter: blur(10px);
  border: 1.5px solid #ffd700;
  z-index: 99999;
  box-shadow: 0 12px 40px rgba(0,0,0,0.7);
`;

const RechargeOption = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
  }
`;

const GamesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 15px;
  }
`;

const GameCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-height: 500px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: #ffd700;
  }
`;

const GameTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  font-weight: bold;
`;

function App() {
  const [balance, setBalance] = useState(10000);
  const [showRechargeMenu, setShowRechargeMenu] = useState(false);
  const [rechargeValue, setRechargeValue] = useState('');

  const handleBalanceChange = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const handleRecharge = () => {
    const value = parseInt(rechargeValue);
    if (!isNaN(value) && value > 0) {
      handleBalanceChange(value);
      setRechargeValue('');
      setShowRechargeMenu(false);
    }
  };

  // Portal para o menu de recarga
  const rechargeMenuPortal = showRechargeMenu ? ReactDOM.createPortal(
    <RechargeOptions>
      <h4>Recarga Personalizada</h4>
      <input
        type="number"
        placeholder="Valor"
        min="10"
        value={rechargeValue}
        onChange={e => setRechargeValue(e.target.value)}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', background: '#333', color: 'white' }}
      />
      <button onClick={handleRecharge} style={{ padding: '8px 15px', background: '#ffd700', color: 'black', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Adicionar
      </button>
    </RechargeOptions>,
    document.body
  ) : null;

  return (
    <>
      <GlobalStyles />
      {rechargeMenuPortal}
      <AppContainer>
        <Header>
          <Logo src={CasinoLogo} alt="ÉosGuri.BET" />
          <BalanceDisplay>
            <Balance>Saldo: ${balance.toLocaleString()}</Balance>
            <RechargeMenu>
              <RechargeButton onClick={() => setShowRechargeMenu(!showRechargeMenu)}>
                💰
              </RechargeButton>
            </RechargeMenu>
          </BalanceDisplay>
        </Header>

        <GamesContainer>
          <Blackjack balance={balance} onBalanceChange={handleBalanceChange} />
          <Roulette balance={balance} onBalanceChange={handleBalanceChange} />
          <Slots balance={balance} onBalanceChange={handleBalanceChange} />
          <Crash balance={balance} onBalanceChange={handleBalanceChange} />
          <Plinko balance={balance} onBalanceChange={handleBalanceChange} />
          <HiLo balance={balance} onBalanceChange={handleBalanceChange} />
        </GamesContainer>
      </AppContainer>
    </>
  );
}

export default App;
