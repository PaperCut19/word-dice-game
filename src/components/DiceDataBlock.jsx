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
      return "bg-gray-300 hover:bg-gray-400";
    }

    // Otherwise, auto-determine from letter
    const vowels = ["A", "E", "I", "O", "U"];
    return vowels.includes(letter)
      ? "bg-red-400 hover:bg-red-300"
      : "bg-blue-400 hover:bg-blue-300";
  };

  return (
    <div
      className="group flex w-25 flex-col items-center md:w-30 lg:w-35"
      onClick={dice.onClick}
    >
      {showMetadata && (
        <>
          <h1 className="mx-auto text-center">
            Dice Name: {dice.name || "N/A"}
          </h1>
          <h1 className="hidden">Dice ID: {dice.id || ""}</h1>
          {dice.frozen && (
            <h1 className="pb-2 text-xl text-blue-400 underline underline-offset-4">
              Frozen
            </h1>
          )}
          {dice.showExtraInfo && (
            <div>
              <p>Side 1: {dice.text1}</p>
              <p>Side 2: {dice.text2}</p>
              <p>Side 3: {dice.text3}</p>
              <p>Side 4: {dice.text4}</p>
              <p>Side 5: {dice.text5}</p>
              <p>Side 6: {dice.text6}</p>
            </div>
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
