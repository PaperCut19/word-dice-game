import { useState } from "react";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import NavigationMenu from "./components/NavigationMenu";

function HomePage({ setCurrentPage }) {
  const [inputValue, setInputValue] = useState("");
  const [frontPageDice, setFrontPageDice] = useState(["W", "O", "R", "D", "S"]);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Please enter a word");
      return;
    }

    // Convert input to array of letters
    const newLetters = inputValue.toUpperCase().split("");
    setFrontPageDice(newLetters);
    setInputValue(""); // Clear input after submit
  };

  return (
    <div className="main-container">
      <div className="secondary-container border-main gap-4 border-7 p-10 md:flex-col">
        <h1 className="yellow-underlined-heading text-4xl">
          Dice Testing Area
        </h1>

        {/* front page dice blocks */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {frontPageDice.map((letter, index) => {
            return (
              <DiceDataBlock
                key={index}
                dice={{ text1: letter }}
                showMetadata={false}
              />
            );
          })}
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
    </div>
  );
}

export default HomePage;
