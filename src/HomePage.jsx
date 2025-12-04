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

      <Button onClick={handleSubmit}>Submit</Button>

      {/* navigate buttons */}
      <NavigationMenu setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default HomePage;
