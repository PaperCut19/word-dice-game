import { useState } from "react";
import Button from "./components/Button";
import DiceDataBlock from "./components/DiceDataBlock";
import NavigationMenu from "./components/NavigationMenu";
import { useDiceManager } from "./hooks/useDiceManager";
import { useAuth } from "./context/AuthContext";

function PlayArea({ setCurrentPage, currentPage }) {
  // --- 1. GET PERSISTENT DATA ---
  // we only need the list of dice (diceObjects) and the loading state
  // we don't need save/delete here because PlayArea only creates temporary copies
  const { diceObjects: diceArray, loading } = useDiceManager();
  const { user } = useAuth(); // get user info

  // --- 2. LOCAL GAME STATE ---
  // this tracks the dice currently 'on the table' for this specific session
  // it is ephemeral (lost on refresh), which is standard for a game table

  const [activeDice, setActiveDice] = useState([]);
  const [manageMode, setManageMode] = useState("");

  // --- 3. GAME LOGIC (unchanged) ---
  const displayDiceArray = activeDice.map((dice) => {
    let onClick = () => {};
    const shouldBeClickable =
      manageMode === "delete" || manageMode === "freeze";

    if (manageMode === "delete") {
      onClick = () => {
        const newArray = activeDice.filter((d) => d.playId !== dice.playId);
        setActiveDice(newArray);
      };
    }

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
      isClickable: shouldBeClickable,
      onClick: onClick,
    };
  });

  const handleAddAll = () => {
    // clone all persistent dice into the active game area
    const newArray = diceArray.map((dice) => ({
      ...dice,
      playId: Date.now() + Math.random(), // unique id for the game session
      frozen: false,
    }));
    setActiveDice([...activeDice, ...newArray]);
  };

  const handleDeleteAll = () => {
    const newArray = activeDice.filter((dice) => dice.frozen);
    setActiveDice(newArray);
  };

  const handleAddDice = (dice) => {
    const newDice = {
      ...dice,
      playId: Date.now() + Math.random(),
      frozen: false,
    };
    setActiveDice([...activeDice, newDice]);
  };

  const handleRoll = () => {
    const rolledDice = activeDice.map((dice) => {
      if (dice.frozen) return dice;

      // get all 6 faces
      const faces = [
        dice.text1,
        dice.text2,
        dice.text3,
        dice.text4,
        dice.text5,
        dice.text6,
      ].filter((face) => face && face.trim() !== "");

      if (faces.length === 0) return dice;

      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      return { ...dice, mainFace: randomFace };
    });
    setActiveDice(rolledDice);
  };

  return (
    <div className="main-container">
      <h1 className="mb-8 font-fancyLetters text-4xl">Play Area</h1>

      {user ? (
        <h2 className="mt-5 mb-5 text-2xl">
          Welcome{" "}
          <span className="rounded-lg bg-purple-300 p-1.5">
            {user.username}
          </span>
        </h2>
      ) : (
        <div className="mt-5 mb-5 flex flex-col items-center justify-center">
          <h1 className="w-fit rounded-lg bg-purple-300 p-2 text-black">
            Guest Mode
          </h1>
        </div>
      )}

      {/* two sections side by side on desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[7fr_13fr]">
        {/* LEFT SECTION: your collection either from online database or browser storage */}
        <div className="border-main grid-wrapper">
          <h2 className="yellow-underlined-heading">Your Dice</h2>

          <div className="dice-grid">
            {loading ? (
              <div className="p-4 text-gray-500 italic">
                Loading collection...
              </div>
            ) : diceArray.length === 0 ? (
              <div className="p-4 text-gray-500 italic">
                No dice found. Go to 'Manage' to create some!
              </div>
            ) : (
              diceArray.map((dice) => (
                <div key={dice.id} onClick={() => handleAddDice(dice)}>
                  <DiceDataBlock dice={dice} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SECTION: the table (active game) */}
        <div className="border-main min-w-0 overflow-hidden">
          <h2 className="yellow-underlined-heading">Play Area</h2>

          {/* display active dice */}
          <div className="grid-wrapper">
            <div className="dice-grid">
              {displayDiceArray.length > 0 ? (
                displayDiceArray.map((dice) => (
                  <DiceDataBlock key={dice.playId} dice={dice} />
                ))
              ) : (
                <div className="col-span-full flex h-full min-h-[150px] w-full items-center justify-center p-4 text-gray-400 italic">
                  Table is empty. Click on your dice in the 'Your Dice' area to
                  add them!
                </div>
              )}
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 flex flex-col items-center justify-center lg:flex-row lg:justify-between">
            <div className="mb-5 flex gap-2 lg:mb-0">
              <Button
                onClick={handleRoll}
                className="button-secondary bg-purple-300 hover:bg-purple-200"
              >
                Roll Dice
              </Button>

              <Button className="button-primary" onClick={handleAddAll}>
                Add All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
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
                className="button-primary"
                onClick={() => setManageMode("")}
              >
                Finished Editing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NavigationMenu
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default PlayArea;
