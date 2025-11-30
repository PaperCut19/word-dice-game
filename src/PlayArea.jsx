import { useState } from "react";
import Button from "./components/Button";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";

function PlayArea({ setCurrentPage }) {
  // load dice from storage
  const [diceArray, setDiceArray] = useState(() => diceStorage.getAllDice());

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
              <DiceDataBlock key={dice.id} dice={dice} />
            ))}
          </div>
        </div>

        {/* right section, play area */}
        <div className="border-main">
          <h2 className="text-2xl font-bold">Play Area</h2>
          <p>Active dice will go here</p>
        </div>
      </div>

      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default PlayArea;
