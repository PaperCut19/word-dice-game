import { useState, useEffect, useRef } from "react";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import ManageMenu from "./components/ManageMenu";
import AskUser from "./components/AskUser";
import DiceCreation from "./components/DiceCreation";

function ManageDice({ setCurrentPage }) {
  // State
  const [diceArray, setDiceArray] = useState(() => diceStorage.getAllDice()); // load dice from browser storage
  const [activeSection, setActiveSection] = useState(null); // can be: null, 'create', or 'delete'
  const [foundDice, setFoundDice] = useState(null); // For storing the actual dice object
  const [manageMode, setManageMode] = useState("");

  // using ref so we can tell the computer to only upload changes to browser storage after the first render of the local copy, this makes sure that when ManageDice component mounts, an empty array isn't immediately being uploaded to the browser storage
  const isFirstRender = useRef(true);

  // takes the local copy of the dice and analyzes what the user is currently trying to do with the dice to create a final group of dice to display
  const displayDiceArray = diceArray.map((dice) => {
    let onClick = () => {};

    // checks if dice should be clickable
    const shouldBeClickable = manageMode === "edit" || manageMode === "delete";

    // checks if dice should have delete handler
    if (manageMode === "delete") {
      onClick = () => {
        const newArray = diceArray.filter((d) => d.id !== dice.id);
        setDiceArray(newArray);
        alert(`Dice "${dice.name}" deleted!`);
      };
    }

    // checks if dice should have edit handler
    if (manageMode === "edit") {
      onClick = () => {
        setFoundDice(dice);
        setActiveSection("editMenu2");
      };
    }

    return {
      ...dice,
      // Pass the computed value to the component prop
      isClickable: shouldBeClickable,
      onClick: onClick,
    };
  });

  // auto-save to browser storage when diceArray changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip saving on first render
    }
    diceStorage.uploadAllDice(diceArray);
  }, [diceArray]);

  // handler for edit menu 2, submitting the edited dice to local copy
  const handleEditSubmit = (diceData) => {
    const updatedArray = diceArray.map((dice) =>
      dice.id === foundDice.id
        ? { ...dice, ...diceData, mainFace: diceData.text1 }
        : dice,
    );

    setDiceArray(updatedArray);
    alert(`Dice "${diceData.name}" has been updated!`);
  };

  // handler to activate 'edit menu 1'
  const handleEditMenu1 = () => {
    setActiveSection("editMenu1");
    setManageMode("edit");
  };

  // handler for edit menu 1, find dice to edit
  const handleFindDiceToEdit = (diceName) => {
    if (!diceName) {
      alert("Please enter a dice name to edit");
      return;
    }

    const found = diceArray.find((dice) => dice.name === diceName);

    if (!found) {
      alert(`No dice found with name "${diceName}"`);
      return;
    }

    setFoundDice(found);
    setActiveSection("editMenu2");
  };

  // open create dice section
  const handleCreateDice = () => {
    setActiveSection("create");
    setManageMode("create");
  };

  // open delete dice section
  const handleDeleteDice = () => {
    setActiveSection("delete");
    setManageMode("delete");
  };

  // clear menu handler
  const handleClear = () => {
    setActiveSection(null);
    setManageMode("");
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

  // handler for activating delete one dice menu
  const handleDeleteOneMenu = () => {
    setActiveSection("deleteOne");
    setManageMode("delete");
  };

  // handler for delete one dice
  const handleDeleteOne = (diceName) => {
    if (!diceName) {
      alert("Please enter a dice name to delete");
      return;
    }

    const diceExists = diceArray.some((dice) => dice.name === diceName);

    if (!diceExists) {
      alert(`No dice found with name "${diceName}"`);
      return;
    }

    const filteredArray = diceArray.filter((dice) => dice.name !== diceName);
    setDiceArray(filteredArray);
    alert(`Dice "${diceName}" deleted!`);
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
          onSubmit={handleFindDiceToEdit}
          buttonText="Find Dice"
        />
      )}

      {/* Edit Menu 2 - DiceCreation component */}
      {activeSection === "editMenu2" && foundDice && (
        <DiceCreation onSubmit={handleEditSubmit} diceToEdit={foundDice} />
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
          onSubmit={handleDeleteOne}
          buttonText="Delete"
        />
      )}

      {/* display all dice */}
      <div className="grid w-full grid-flow-col grid-rows-2 gap-3 overflow-x-auto md:grid-rows-4">
        {displayDiceArray.map((dice) => (
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
