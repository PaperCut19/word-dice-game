function DiceDataBlock({ dice, showMetadata = true }) {
  const getDiceBoxColor = () => {
    // If custom color set, use it
    if (dice.color) {
      return dice.color;
    }

    // Get the letter
    const letter = (dice.mainFace || dice.text1 || "").toUpperCase();

    // If empty, return default/gray
    if (!letter) {
      return "bg-gray-300 group-hover:bg-gray-400";
    }

    // Otherwise, auto-determine from letter
    const vowels = ["A", "E", "I", "O", "U"];
    return vowels.includes(letter)
      ? "bg-red-400 group-hover:bg-red-300"
      : "bg-blue-400 group-hover:bg-blue-300";
  };

  return (
    <div className="group flex flex-col items-center" onClick={dice.onClick}>
      {showMetadata && (
        <>
          <h1>Dice Name: {dice.name || "N/A"}</h1>
          <h1>Dice ID: {dice.id || ""}</h1>
          {dice.frozen && (
            <h1 className="pb-2 text-xl text-blue-400 underline underline-offset-4">
              Frozen
            </h1>
          )}
        </>
      )}
      <div
        className={`dice-box ${getDiceBoxColor()} ${dice.isClickable && "border-clickable"}`}
      >
        <h1 className="dice-letter">{dice.mainFace || dice.text1 || ""}</h1>
      </div>
    </div>
  );
}

export default DiceDataBlock;
