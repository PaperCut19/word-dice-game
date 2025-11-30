import { useState } from "react";
import Button from "./components/Button";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";

function PlayArea({ setCurrentPage }) {
  // load dice from storage
  const [diceArray, setDiceArray] = useState(() => diceStorage.getAllDice());
  // track active dice in play area
  const [activeDice, setActiveDice] = useState([]);
  const [manageMode, setManageMode] = useState("");

  // take local copy of dice and analyze what the user wants to do with them to create a final group of dice
  const displayDiceArray = activeDice.map((dice) => {
    let onClick = () => {};

    // check to see if dice should be clickable
    const shouldBeClickable =
      manageMode === "delete" || manageMode === "freeze";

    // check to see if delete handler should be given to dice
    if (manageMode === "delete") {
      onClick = () => {
        const newArray = activeDice.filter((d) => d.playId !== dice.playId);
        setActiveDice(newArray);
      };
    }

    return {
      ...dice,
      // Pass the computed value to the component prop
      isClickable: shouldBeClickable,
      onClick: onClick,
    };
  });

  // handler to add dice to play area
  const handleAddDice = (dice) => {
    const newDice = {
      ...dice,
      playId: Date.now(),
    };
    setActiveDice([...activeDice, newDice]);
  };

  // handler to roll all active dice
  const handleRoll = () => {
    const rolledDice = activeDice.map((dice) => {
      // get all 6 faces
      const faces = [
        dice.text1,
        dice.text2,
        dice.text3,
        dice.text4,
        dice.text5,
        dice.text6,
      ].filter((face) => face && face.trim() !== ""); //remove empty/blank faces
      // pick random face
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      console.log("Old face:", dice.mainFace, "New face:", randomFace);

      // update mainFace with random result
      return { ...dice, mainFace: randomFace };
    });
    setActiveDice(rolledDice);
  };

  return (
    <div className="main-container">
      <h1 className="mb-8 font-fancyLetters text-4xl">Play Area</h1>

      {/* two sections side by side on desktop */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* left section, dice selector */}
        <div className="border-main">
          <h2 className="yellow-underlined-heading">Your Dice</h2>

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
          <h2 className="yellow-underlined-heading">Play Area</h2>

          {/* display active dice */}
          <div className="mb-4 flex flex-wrap gap-3">
            {displayDiceArray.map((dice) => (
              <DiceDataBlock key={dice.playId} dice={dice} />
            ))}
          </div>

          <p className="text-gray-500">
            Click a dice on the left to add it here
          </p>

          {/* buttons */}
          <div className="flex gap-2">
            <Button onClick={handleRoll}>Roll Dice</Button>
            <Button onClick={() => setActiveDice([])}>Delete All</Button>
            <Button onClick={() => setManageMode("delete")}>Delete</Button>
            <Button onClick={() => setManageMode("freeze")}>Freeze</Button>
            <Button
              onClick={() => setManageMode("")}
              className="button-primary"
            >
              Finished Editing
            </Button>
          </div>
        </div>
      </div>

      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default PlayArea;
