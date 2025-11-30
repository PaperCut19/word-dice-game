import { useEffect, useState } from "react";
import DiceDataBlock from "./DiceDataBlock";
import Button from "./Button";

function DiceCreation({ onSubmit, diceToEdit = null }) {
  // Form inputs - pre-fill if editing
  const [diceName, setDiceName] = useState(diceToEdit?.name || "");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");

  useEffect(() => {
    if (diceToEdit) {
      setDiceName(diceToEdit.name);
      setText1(diceToEdit.text1);
      setText2(diceToEdit.text2);
      setText3(diceToEdit.text3);
      setText4(diceToEdit.text4);
      setText5(diceToEdit.text5);
      setText6(diceToEdit.text6);
    }
  }, [diceToEdit]);

  const handleSubmit = () => {
    const diceData = {
      name: diceName,
      text1,
      text2,
      text3,
      text4,
      text5,
      text6,
      isClickable: false,
      onClick: () => {},
    };

    // Pass data back to parent
    onSubmit(diceData);

    // Reset form only if creating (not editing)
    if (!diceToEdit) {
      setDiceName("");
      setText1("");
      setText2("");
      setText3("");
      setText4("");
      setText5("");
      setText6("");
    }
  };

  return (
    <div className="border-main">
      {/* Header - only shows when editing */}
      {diceToEdit && (
        <h2 className="yellow-underlined-heading">Editing: {diceName}</h2>
      )}
      <div className="flex flex-col items-center gap-2 md:flex-row">
        {/* dice preview */}
        <DiceDataBlock dice={{ name: diceName, text1: text1 }} />

        {/* form inputs */}
        <div className="flex flex-col gap-2 md:ml-5">
          <label htmlFor="nameOfNewDiceText">Name of Dice</label>
          <input
            type="text"
            id="nameOfNewDiceText"
            className="text-input"
            value={diceName}
            onChange={(event) => setDiceName(event.target.value)}
          />

          <label htmlFor="createDiceText1">Side 1</label>
          <input
            type="text"
            id="createDiceText1"
            className="text-input"
            value={text1}
            onChange={(event) => setText1(event.target.value[0] || "")}
            maxLength={1}
          />
          <label htmlFor="createDiceText2">Side 2</label>
          <input
            type="text"
            id="createDiceText2"
            className="text-input"
            value={text2}
            onChange={(event) => setText2(event.target.value[0] || "")}
            maxLength={1}
          />
          <label htmlFor="createDiceText3">Side 3</label>
          <input
            type="text"
            id="createDiceText3"
            className="text-input"
            value={text3}
            onChange={(event) => setText3(event.target.value[0] || "")}
            maxLength={1}
          />
          <label htmlFor="createDiceText4">Side 4</label>
          <input
            type="text"
            id="createDiceText4"
            className="text-input"
            value={text4}
            onChange={(event) => setText4(event.target.value[0] || "")}
            maxLength={1}
          />
          <label htmlFor="createDiceText5">Side 5</label>
          <input
            type="text"
            id="createDiceText5"
            className="text-input"
            value={text5}
            onChange={(event) => setText5(event.target.value[0] || "")}
            maxLength={1}
          />
          <label htmlFor="createDiceText6">Side 6</label>
          <input
            type="text"
            id="createDiceText6"
            className="text-input"
            value={text6}
            onChange={(event) => setText6(event.target.value[0] || "")}
            maxLength={1}
          />

          <Button onClick={handleSubmit}>
            {diceToEdit ? "Update Dice" : "Create Dice"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DiceCreation;
