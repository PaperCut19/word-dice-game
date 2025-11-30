import { useState } from "react";
import Button from "./components/Button";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";

function PlayArea({ setCurrentPage }) {
  // load dice from storage
  const [diceArray, setDiceArray] = useState(() => diceStorage.getAllDice());
  // track active dice in play area
  const [activeDice, setActiveDice] = useState([]);

  // handler to add dice to play area
  const handleAddDice = (dice) => {
    const newDice = {
      ...dice,
      playId: Date.now(),
    };
    setActiveDice([...activeDice, newDice]);
  };

  return (
    <div className="main-container">
      <h1 className="mb-8 font-fancyLetters text-4xl">Play Area</h1>

      {/* two sections side by side on desktop */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* left section, dice selector */}
        <div className="border-main">
          <h2 className="text-2xl font-bold">Your Dice</h2>

          {/* display all dice */}
          <div className="flex flex-col gap-3">
            {diceArray.map((dice) => (
              <div key={dice.id} onClick={() => handleAddDice(dice)}>
                <DiceDataBlock dice={dice} />
              </div>
            ))}
          </div>
        </div>

        {/* right section, play area */}
        <div className="border-main">
          <h2 className="text-2xl font-bold">Play Area</h2>

          {/* display active dice */}
          <div className="mb-4 flex flex-wrap gap-3">
            {activeDice.map((dice) => (
              <DiceDataBlock key={dice.playId} dice={dice} />
            ))}
          </div>

          <p className="text-gray-500">
            Click a dice on the left to add it here
          </p>
        </div>
      </div>

      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default PlayArea;
