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

  // handler that will automatically create a bunch of dice
  const handleAutoCreate = () => {
    const newDice = [
      {
        id: Date.now(),
        name: "mildred",
        text1: "m",
        text2: "i",
        text3: "l",
        text4: "d",
        text5: "r",
        text6: "e",
        mainFace: "m",
      },
      {
        id: Date.now() + 1,
        name: "daniel",
        text1: "d",
        text2: "a",
        text3: "n",
        text4: "i",
        text5: "e",
        text6: "l",
        mainFace: "d",
      },
      {
        id: Date.now() + 2,
        name: "cristian",
        text1: "c",
        text2: "r",
        text3: "i",
        text4: "s",
        text5: "t",
        text6: "i",
        mainFace: "c",
      },
      {
        id: Date.now() + 3,
        name: "colleen",
        text1: "c",
        text2: "o",
        text3: "l",
        text4: "l",
        text5: "e",
        text6: "e",
        mainFace: "c",
      },
      {
        id: Date.now() + 4,
        name: "don",
        text1: "d",
        text2: "o",
        text3: "n",
        mainFace: "d",
      },
      {
        id: Date.now() + 5,
        name: "alyssa",
        text1: "a",
        text2: "l",
        text3: "y",
        text4: "s",
        text5: "s",
        text6: "a",
        mainFace: "a",
      },
      {
        id: Date.now() + 6,
        name: "ava",
        text1: "a",
        text2: "v",
        text3: "a",
        mainFace: "a",
      },
      {
        id: Date.now() + 7,
        name: "aiden",
        text1: "a",
        text2: "i",
        text3: "d",
        text4: "e",
        text5: "n",
        mainFace: "a",
      },
    ];

    setDiceArray([...diceArray, ...newDice]);
  };

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
  const handleEditButton = () => {
    setManageMode("edit");
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

  return (
    <div className="main-container">
      <h1 className="font-fancyLetters text-4xl">Manage Your Dice</h1>

      {/* Menu Area */}
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Permanent Menu - always visible */}
        <ManageMenu
          onCreateDice={handleCreateDice}
          onEditDice={handleEditButton}
          onDeleteDice={handleDeleteDice}
          onClear={handleClear}
          autoCreate={handleAutoCreate}
          manageMode={manageMode}
        />
      </div>

      {/* create dice section */}
      {activeSection === "create" && (
        <DiceCreation onSubmit={handleCreateSubmit} />
      )}

      {/* Edit Menu 2 - DiceCreation component */}
      {activeSection === "editMenu2" && foundDice && (
        <DiceCreation onSubmit={handleEditSubmit} diceToEdit={foundDice} />
      )}

      {/* delete dice section */}
      {activeSection === "delete" && (
        <div className="border-main flex flex-col gap-2">
          <Button onClick={handleDeleteAll}>Delete All</Button>
        </div>
      )}

      {/* display all dice */}
      <div className="w-full overflow-x-auto">
        <div className="mx-auto grid w-max auto-cols-max grid-flow-col grid-rows-2 gap-3">
          {displayDiceArray.map((dice) => (
            <DiceDataBlock key={dice.id} dice={dice} />
          ))}
        </div>
      </div>

      {/* home button */}
      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default ManageDice;
