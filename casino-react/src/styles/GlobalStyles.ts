import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .header {
    background: rgba(0, 0, 0, 0.3);
    padding: 20px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(10px);
    border-bottom: 2px solid #ffd700;
  }

  .casino-logo {
    height: 120px;
    margin-right: auto;
  }

  .balance {
    font-size: 28px;
    color: #ffd700;
    margin: 0 auto;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }

  .games-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .game-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 25px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: #ffd700;
  }

  .game-title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .bet-controls {
    display: flex;
    gap: 10px;
    margin: 15px 0;
    align-items: center;
    flex-wrap: wrap;
  }

  .bet-input {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    padding: 10px;
    border-radius: 8px;
    width: 120px;
  }

  .bet-input:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .btn {
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
  }

  .btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .game-area {
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
  }

  .cards {
    display: flex;
    gap: 10px;
    margin: 15px 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    width: 60px;
    height: 84px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: black;
    font-size: 14px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .card.red {
    color: #e74c3c;
  }

  .dice {
    width: 50px;
    height: 50px;
    background: white;
    color: black;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .roulette-wheel {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: conic-gradient(
      #e74c3c 0deg 20deg,
      #2c3e50 20deg 40deg,
      #e74c3c 40deg 60deg,
      #2c3e50 60deg 80deg,
      #e74c3c 80deg 100deg,
      #2c3e50 100deg 120deg,
      #e74c3c 120deg 140deg,
      #2c3e50 140deg 160deg,
      #e74c3c 160deg 180deg,
      #2c3e50 180deg 200deg,
      #e74c3c 200deg 220deg,
      #2c3e50 220deg 240deg,
      #e74c3c 240deg 260deg,
      #2c3e50 260deg 280deg,
      #e74c3c 280deg 300deg,
      #2c3e50 300deg 320deg,
      #e74c3c 320deg 340deg,
      #2c3e50 340deg 360deg
    );
    position: relative;
    margin: 20px auto;
    transition: transform 1.5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  }

  .roulette-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background: #ffd700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: black;
  }

  .slots {
    display: flex;
    gap: 10px;
    margin: 20px 0;
  }

  .slot-reel {
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
  }

  .result {
    font-size: 18px;
    font-weight: bold;
    margin: 15px 0;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
  }

  .win {
    background: rgba(39, 174, 96, 0.3);
    color: #2ecc71;
    border: 1px solid #2ecc71;
  }

  .lose {
    background: rgba(231, 76, 60, 0.3);
    color: #e74c3c;
    border: 1px solid #e74c3c;
  }

  .push {
    background: rgba(241, 196, 15, 0.3);
    color: #f1c40f;
    border: 1px solid #f1c40f;
  }

  .quick-bet {
    display: flex;
    gap: 10px;
    margin: 10px 0;
    flex-wrap: wrap;
  }

  .quick-bet-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .quick-bet-btn:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
  }

  @media (max-width: 768px) {
    .games-container {
      grid-template-columns: 1fr;
      padding: 15px;
    }
    
    .bet-controls {
      justify-content: center;
    }
  }
`;

export default GlobalStyles; 