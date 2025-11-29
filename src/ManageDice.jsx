import { useState, useEffect, useRef } from "react";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import ManageMenu from "./components/ManageMenu";
import AskUser from "./components/AskUser";
import DiceCreation from "./components/DiceCreation";

function ManageDice({ setCurrentPage }) {
  // State
  const [diceArray, setDiceArray] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // can be: null, 'create', or 'delete'
  const [diceToDelete, setDiceToDelete] = useState("");
  const [diceToEdit, setDiceToEdit] = useState(""); // ← ADD THIS LINE
  const [foundDice, setFoundDice] = useState(null); // For storing the actual dice object

  // using ref so we can tell the computer to only upload changes to browser storage after the first render of the local copy, this makes sure that when ManageDice component mounts, an empty array isn't immediately being uploaded to the browser storage
  const isFirstRender = useRef(true);

  // load dice from browser storage
  useEffect(() => {
    const loadedDice = diceStorage.getAllDice();
    setDiceArray(loadedDice);
  }, []);

  // auto-save to browser storage when diceArray changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip saving on first render
    }
    diceStorage.uploadAllDice(diceArray);
  }, [diceArray]);

  // handler edit menu 1
  const handleEditMenu1 = () => {
    setActiveSection("editMenu1");
  };

  // handler find dice to edit
  const handleFindDiceToEdit = () => {
    if (!diceToEdit) {
      alert("Please enter a dice name to edit");
      return;
    }

    const found = diceArray.find((dice) => dice.name === diceToEdit);

    if (!found) {
      alert(`No dice found with name "${diceToEdit}"`);
      return;
    }

    setFoundDice(found);
    alert(`Found dice "${found.name}"! (Edit form will come next)`);
    // Later: setActiveSection('editMenu2');
  };

  // open create dice section
  const handleCreateDice = () => {
    setActiveSection("create");
  };

  // open delete dice section
  const handleDeleteDice = () => {
    setActiveSection("delete");
  };

  // clear menu handler
  const handleClear = () => {
    setActiveSection(null);
  };

  // handler create new dice
  const handleCreateSubmit = (diceData) => {
    const newDice = {
      id: Date.now(),
      name: diceData.name || Date.now().toString(),
      ...diceData,
      mainFace: diceData.text1,
    };

    // Check for duplicate names
    if (diceArray.some((dice) => dice.name === newDice.name)) {
      alert("there's another dice with the same name. use a different name");
      return;
    }

    setDiceArray([...diceArray, newDice]);
    alert(`dice "${newDice.name}" has been created!`);
  };

  // delete all dice - just update React state
  const handleDeleteAll = () => {
    setDiceArray([]);
    alert("All dice got deleted!");
  };

  // delete one dice button event handler
  const handleDeleteOneMenu = () => {
    setActiveSection("deleteOne");
  };

  // delete one dice - just filter React state
  const handleDeleteOne = () => {
    if (!diceToDelete) {
      alert("Please enter a dice name to delete");
      return;
    }

    const diceExists = diceArray.some((dice) => dice.name === diceToDelete);

    if (!diceExists) {
      alert(`No dice found with name "${diceToDelete}"`);
      return;
    }

    const filteredArray = diceArray.filter(
      (dice) => dice.name !== diceToDelete,
    );
    setDiceArray(filteredArray); // useEffect saves automatically
    setDiceToDelete("");
    alert(`Dice "${diceToDelete}" deleted!`);
  };

  return (
    <div className="main-container">
      <h1 className="font-fancyLetters text-4xl">Manage Your Dice</h1>

      {/* Menu Area */}
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Permanent Menu - always visible */}
        <ManageMenu
          onCreateDice={handleCreateDice}
          onEditDice={handleEditMenu1}
          onDeleteDice={handleDeleteDice}
          onClear={handleClear}
        />
      </div>

      {/* create dice section */}
      {activeSection === "create" && (
        <DiceCreation onSubmit={handleCreateSubmit} />
      )}

      {/* Edit Menu 1 - AskUser component */}
      {activeSection === "editMenu1" && (
        <AskUser
          label="Name of dice to edit"
          placeholder="Enter dice name"
          value={diceToEdit}
          onChange={(event) => setDiceToEdit(event.target.value)}
          onSubmit={handleFindDiceToEdit}
          buttonText="Edit Dice"
        />
      )}

      {/* delete dice section */}
      {activeSection === "delete" && (
        <div className="border-main flex flex-col gap-2">
          <Button onClick={handleDeleteAll}>Delete All</Button>
          <Button onClick={handleDeleteOneMenu}>Delete One Dice</Button>
        </div>
      )}

      {/* delete one dice section */}
      {activeSection === "deleteOne" && (
        <AskUser
          label="Name of dice to delete"
          placeholder="Enter dice name"
          value={diceToDelete}
          onChange={(event) => setDiceToDelete(event.target.value)}
          onSubmit={handleDeleteOne}
          buttonText="Delete"
        />
      )}

      {/* display all dice */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {diceArray.map((dice) => (
          <DiceDataBlock key={dice.id} dice={dice} />
        ))}
      </div>

      {/* home button */}
      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default ManageDice;
