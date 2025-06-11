import React, { useState } from 'react';
import styled from 'styled-components';

const RechargeMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #ffd700;
  border-radius: 8px;
  padding: 15px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RechargeInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
`;

const RechargeButton = styled.button`
  padding: 8px 15px;
  background-color: #ffd700;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface HeaderProps {
  balance: number;
  onAddBalance: (amount: number) => void;
}

const Header: React.FC<HeaderProps> = ({ balance, onAddBalance }) => {
  const [showRechargeMenu, setShowRechargeMenu] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const handleRecharge = () => {
    const amount = parseInt(rechargeAmount);
    if (amount > 0) {
      onAddBalance(amount);
      setRechargeAmount('');
      setShowRechargeMenu(false);
    }
  };

  return (
    <div className="header">
      <img src="/Logo.png" alt="ÉosGuri.BET" className="casino-logo" />
      <div className="balance">Saldo: ${balance.toLocaleString()}</div>
      <div style={{ position: 'relative' }}>
        <div 
          className="menu-icon" 
          onClick={() => setShowRechargeMenu(!showRechargeMenu)}
          style={{ fontSize: '120px', cursor: 'pointer', marginLeft: '20px' }}
        >
          💰
        </div>
        {showRechargeMenu && (
          <RechargeMenu>
            <h4>Recarga Personalizada</h4>
            <RechargeInput
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              placeholder="Valor"
              min="10"
            />
            <RechargeButton onClick={handleRecharge}>Adicionar</RechargeButton>
          </RechargeMenu>
        )}
      </div>
    </div>
  );
};

export default Header; 