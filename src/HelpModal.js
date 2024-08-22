import React from 'react';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>How to Play Moley</h2>
        <div className="modal-body">
          <p>
            <strong>Aim of Moley:</strong> To unmask the Mole without giving away the secret word. 
            If you are the Mole, your mission is to blend in with the other players, avoid detection, 
            and work out the secret word.
          </p>
          <p>
            <strong>Unmasking The Mole:</strong> Once everyone has said their word, the discussion begins to 
            identify the Mole. This is your chance to convince others of your innocence while 
            finding the real Mole. After the debate, everyone votes by pointing to the player 
            they believe is the Mole.
          </p>
          <p>
            <strong>Scoring:</strong> To determine the best player, keep track of the points. Here's how scoring works:
          </p>
          <ul>
            <li><strong>If the Mole escapes undetected:</strong> The Mole scores 2 points. Everyone else scores 0 points.</li>
            <li><strong>If the Mole is caught (but guesses the secret word):</strong> The Mole scores 1 point. Everyone else scores 0 points.</li>
            <li><strong>If the Mole is caught (and doesn’t guess the secret word):</strong> The Mole scores 0 points. Everyone else scores 2 points.</li>
          </ul>
          <p>The first player to 5 points wins!</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
