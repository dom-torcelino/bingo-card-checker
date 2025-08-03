import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [step, setStep] = useState(1);
  const [numCards, setNumCards] = useState(0);
  const [cards, setCards] = useState([]);
  const [tempCard, setTempCard] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [drawNumber, setDrawNumber] = useState("");
  const [winners, setWinners] = useState([]);

  const handleNumCardsSubmit = () => {
    setCards([]);
    setCurrentCardIndex(0);
    setStep(2);
  };

  const handleCardInput = () => {
    const rawEntries = tempCard.split(",").map((entry) => entry.trim());
    const numbers = rawEntries
      .map((n) => {
        const parsed = parseInt(n.replace(/[^0-9]/g, ""), 10);
        return isNaN(parsed) ? null : parsed;
      })
      .filter((n) => n !== null);

    if (numbers.length !== 24) {
      alert(
        "Please enter exactly 24 valid numbers. The center is a FREE space."
      );
      return;
    }

    const card = [];
    let index = 0;
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) 
        {
        if (i === 2 && j === 2) {
          row.push(null); // Center free space
        } else {
          row.push(numbers[index]);
          index++;
        }
      }
      card.push(row);
    }

    setCards([...cards, card]);
    setTempCard("");

    if (currentCardIndex + 1 === numCards) {
      setStep(3);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleDrawSubmit = () => {
    const num = parseInt(drawNumber, 10);
    if (!isNaN(num) && !calledNumbers.includes(num)) {
      const updated = [...calledNumbers, num];
      setCalledNumbers(updated);
      checkForWinners(updated);
    }
    setDrawNumber("");
  };

  const handleUndoDraw = () => {
    const updated = [...calledNumbers];
    updated.pop();
    setCalledNumbers(updated);
    checkForWinners(updated);
  };

  const checkForWinners = (called) => {
    const newWinners = [];
    cards.forEach((card, idx) => {
      if (isWinner(card, called)) newWinners.push(idx);
    });
    setWinners(newWinners);
  };

  const isWinner = (card, called) => {
    const isCalledOrFree = (num) => num === null || called.includes(num);

    for (let row of card) {
      if (row.every((n) => isCalledOrFree(n))) return true;
    }
    for (let col = 0; col < 5; col++) {
      if (card.every((row) => isCalledOrFree(row[col]))) return true;
    }
    const diag1 = card.every((row, i) => isCalledOrFree(row[i]));
    const diag2 = card.every((row, i) => isCalledOrFree(row[4 - i]));
    return diag1 || diag2;
  };

  const resetDraws = () => {
    setCalledNumbers([]);
    setWinners([]);
  };

  return (
    <div className="container">
      <h2>Bingo Checker</h2>

      {step === 1 && (
        <div className="card-setup">
          <p>How many cards?</p>
          <input
            type="number"
            value={numCards}
            onChange={(e) => setNumCards(parseInt(e.target.value))}
          />
          <button onClick={handleNumCardsSubmit}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="card-input">
          <p>
            Enter card {currentCardIndex + 1} numbers (comma-separated 24
            numbers, center is FREE):
          </p>
          <input
            type="text"
            value={tempCard}
            onChange={(e) => setTempCard(e.target.value)}
          />
          <button onClick={handleCardInput}>Submit Card</button>
        </div>
      )}

      {step === 3 && (
        <div className="draw-section">
          <p>Enter drawn number:</p>
          <input
            type="number"
            value={drawNumber}
            onChange={(e) => setDrawNumber(e.target.value)}
          />
          <button onClick={handleDrawSubmit}>Submit</button>
          <button onClick={handleUndoDraw}>Undo Draw</button>
          <button onClick={resetDraws}>Reset Draws</button>

          <p>Called Numbers: {calledNumbers.join(", ")}</p>

          <div className="cards-grid">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`card ${winners.includes(idx) ? "winner" : ""}`}
              >
                <p>
                  Bingo Card #{idx + 1}{" "}
                  {winners.includes(idx) && <strong>(Winner)</strong>}
                </p>
                <table>
                  <tbody>
                    {card.map((row, r) => (
                      <tr key={r}>
                        {row.map((n, c) => (
                          <td
                            key={c}
                            className={`cell ${n === null ? "free" : calledNumbers.includes(n) ? "matched" : ""}`}
                          >
                            {n === null ? "★" : n}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
