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

    // check to see if block should be given an onClick value that allows the block to be freeze itself
    if (manageMode === "freeze") {
      onClick = () => {
        const newArray = activeDice.map((d) =>
          d.playId === dice.playId ? { ...d, frozen: !d.frozen } : d,
        );
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

  // handler that adds all dice into the play area
  const handleAddAll = () => {
    const newArray = diceArray.map((dice) => ({
      ...dice,
      playId: Date.now() + Math.random(),
    }));
    setActiveDice([...activeDice, ...newArray]);
  };

  // handler to delete all dice that aren't frozen
  const handleDeleteAll = () => {
    const newArray = activeDice.filter((dice) => dice.frozen);
    setActiveDice(newArray);
  };

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
      if (dice.frozen) {
        return dice;
      }

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* left section, dice selector */}
        <div className="border-main md:col-span-1">
          <h2 className="yellow-underlined-heading">Your Dice</h2>

          {/* display all dice */}
          <div className="grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto">
            {diceArray.map((dice) => (
              <div key={dice.id} onClick={() => handleAddDice(dice)}>
                <DiceDataBlock dice={dice} />
              </div>
            ))}
          </div>
        </div>

        {/* right section, play area */}
        <div className="border-main overflow-hidden md:col-span-3">
          <h2 className="yellow-underlined-heading">Play Area</h2>

          {/* display active dice */}
          <div className="w-full overflow-x-auto">
            <div className="mx-auto mb-4 grid w-max auto-cols-auto grid-flow-col grid-rows-2 gap-3 pb-2">
              {displayDiceArray.map((dice) => (
                <DiceDataBlock key={dice.playId} dice={dice} />
              ))}
            </div>
          </div>

          <p className="text-gray-500">
            Click a dice on the left to add it here
          </p>

          {/* buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRoll}>Roll Dice</Button>
            <Button onClick={handleDeleteAll}>Delete All</Button>
            <Button
              className={
                manageMode === "delete"
                  ? "button-secondary bg-yellow-500"
                  : "button-secondary"
              }
              onClick={() => setManageMode("delete")}
            >
              Delete
            </Button>
            <Button
              className={
                manageMode === "freeze"
                  ? "button-secondary bg-yellow-500"
                  : "button-secondary"
              }
              onClick={() => setManageMode("freeze")}
            >
              Freeze
            </Button>
            <Button
              onClick={() => setManageMode("")}
              className="button-primary"
            >
              Finished Editing
            </Button>
            <Button onClick={handleAddAll}>Add All</Button>
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
