import { useState } from "react";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import Authentication from "./components/Authentication";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function HomePage({ setCurrentPage }) {
  const [inputValue, setInputValue] = useState("");

  // helper to create a dice object from a letter
  const createDiceObject = (char, index) => {
    return {
      id: Date.now() + index,
      text1: char, // side 1 is the actual letter
      text2: "",
      text3: "",
      text4: "",
      text5: "",
      text6: "",
      mainFace: char, // start showing the actual letter
      showExtraInfo: false, //initialize as not showing the extra info
    };
  };

  // initialize with 'WORDS' as objects
  const [frontPageDice, setFrontPageDice] = useState(() =>
    "WORDS".split("").map((char, index) => createDiceObject(char, index)),
  );

  // handler to toggle the info state
  const handleDiceClick = (id) => {
    const newDiceArray = frontPageDice.map((dice) => {
      if (dice.id === id) {
        return { ...dice, showExtraInfo: !dice.showExtraInfo };
      }
      return dice;
    });
    setFrontPageDice(newDiceArray);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Please enter a word");
      return;
    }

    // use createDiceObject so we store objects, not strings
    const newDiceArray = inputValue
      .toUpperCase()
      .split("")
      .map((char, index) => createDiceObject(char, index));

    setFrontPageDice(newDiceArray);
    setInputValue(""); // Clear input after submit
  };

  const handleRoll = () => {
    const rolledDice = frontPageDice.map((dice) => {
      // 1. generate 5 random letters for sides 2-6
      const randomSides = Array.from({ length: 5 }, () =>
        ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)),
      );
      // 2. create the pool of faces (side 1 + 5 randoms)
      const allFaces = [dice.text1, ...randomSides];

      // 3. pick a random face from the 6 options
      const newMainFace = allFaces[Math.floor(Math.random() * allFaces.length)];

      return {
        ...dice,
        text2: randomSides[0],
        text3: randomSides[1],
        text4: randomSides[2],
        text5: randomSides[3],
        text6: randomSides[4],
        mainFace: newMainFace,
      };
    });
    setFrontPageDice(rolledDice);
  };

  const handleReset = () => {
    // reset mainFace back to text1 (the original letter)
    const resetDice = frontPageDice.map((dice) => ({
      ...dice,
      mainFace: dice.text1,
    }));
    setFrontPageDice(resetDice);
  };

  return (
    <div className="main-container">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[13fr_7fr] lg:grid-rows-1">
        <div className="secondary-container border-main gap-4 border-7 p-4 md:flex-col lg:p-10">
          <h1 className="yellow-underlined-heading text-4xl">
            Dice Testing Area
          </h1>

          {/* front page dice blocks */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {frontPageDice.map((dice) => {
              // merge the click handler into the dice object
              // DiceDataBlock expects 'dice.onClick' to exist
              const diceWithHandler = {
                ...dice,
                onClick: () => handleDiceClick(dice.id),
              };

              return (
                <DiceDataBlock
                  key={dice.id}
                  dice={diceWithHandler}
                  showMetadata={false}
                />
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full flex-wrap justify-center gap-2">
            <Button className="button-third" onClick={handleRoll}>
              Roll Dice
            </Button>
            <Button onClick={handleReset}>Reset Dice</Button>
          </div>

          {/* input */}
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
            placeholder="Change 'words' to what?"
            className="text-input w-50 text-center"
          />

          <Button className="button-secondary w-50" onClick={handleSubmit}>
            Submit
          </Button>
        </div>

        <div className="">
          <div className="border-main secondary-container border-7 p-7 md:flex-col">
            <h1 className="yellow-underlined-heading text-4xl">
              Full Experience
            </h1>
            <Authentication setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
