function DiceDataBlock({ dice, showMetadata = true }) {
  return (
    <div className="group flex flex-col items-center">
      {showMetadata && (
        <>
          <h1>Dice Name: {dice.name || "N/A"}</h1>
          <h1>Dice ID: {dice.id || ""}</h1>
        </>
      )}
      <div className="dice-box">
        <h1 className="dice-letter">{dice.mainFace || dice.text1 || ""}</h1>
      </div>
    </div>
  );
}

export default DiceDataBlock;
