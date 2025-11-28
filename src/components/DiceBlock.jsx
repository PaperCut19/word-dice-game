function DiceBlock({ letter }) {
  return (
    <div className="group flex flex-col items-center">
      <div className="dice-box">
        <h1 className="dice-letter">{letter}</h1>
      </div>
    </div>
  );
}

export default DiceBlock;
