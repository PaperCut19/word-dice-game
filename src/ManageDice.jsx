import { useState } from "react";
import { useDiceManager } from "./hooks/useDiceManager";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import ManageMenu from "./components/ManageMenu";
import DiceCreation from "./components/DiceCreation";
import NavigationMenu from "./components/NavigationMenu";
import { useAuth } from "./context/AuthContext";

function ManageDice({ setCurrentPage, currentPage }) {
  // --- 1. HOOKS INSTEAD OF LOCAL STATE ---
  // we alias 'diceObjects' to 'diceArray' so we don't have to rename everything below
  const {
    diceObjects: diceArray,
    saveDiceObject,
    deleteDiceObject,
    loading,
  } = useDiceManager();

  const { user } = useAuth(); // get the user for the header

  // --- 2. LOCAL USER INTERFACE STATE ---
  const [activeSection, setActiveSection] = useState(null); // can be: null, 'create', or 'delete'
  const [foundDice, setFoundDice] = useState(null); // For storing the actual dice object
  const [manageMode, setManageMode] = useState("");
  const [diceExtraInfoList, setDiceExtraInfoList] = useState([]);

  // --- 3. PREPARE DISPLAY DATA ---
  const displayDiceArray = diceArray.map((dice) => {
    let onClick = () => {};
    const shouldbeClickable = manageMode === "edit" || manageMode === "delete";
    const showExtraInfo = diceExtraInfoList.includes(dice.id);

    if (manageMode === "") {
      onClick = () => {
        // if it's already showing extra info (included), remove it, if not, then add it to the list
        if (diceExtraInfoList.includes(dice.id)) {
          setDiceExtraInfoList(
            diceExtraInfoList.filter((id) => id !== dice.id),
          );
        } else {
          setDiceExtraInfoList([...diceExtraInfoList, dice.id]);
        }
      };
    }

    if (manageMode === "delete") {
      onClick = async () => {
        // [!] use the hook's delete function
        // we await it just in case we want to add logic later, but strictly not needed here
        await deleteDiceObject(dice.id);
        console.log(`Dice "${dice.name}" deleted!`);
      };
    }

    if (manageMode === "edit") {
      onClick = () => {
        setFoundDice(dice);
        setActiveSection("editMenu2");
      };
    }

    return {
      ...dice,
      isClickable: shouldbeClickable,
      onClick: onClick,
      showExtraInfo: showExtraInfo,
    };
  });

  // --- 4. HANDLERS ---

  // handler for creating new dice
  const handleCreateSubmit = async (diceData) => {
    const newDice = {
      // if we are on API, the database will overwrite this ID
      // if local, this ID will be used
      id: Date.now(),
      name: diceData.name || Date.now().toString(),
      ...diceData,
      mainFace: diceData.text1,
    };

    // simple client-side duplicate check
    if (
      diceArray.some((dice) => {
        return dice.name === newDice.name;
      })
    ) {
      alert("there's another dice with the same name. use a different name.");
      return;
    }

    // [!] send to the manager (pessimistic: user interface won't update until this finishes)
    await saveDiceObject(newDice);
    console.log(`Dice ${newDice.name} creation requested`);
  };

  // handler for editing dice
  const handleEditSubmit = async (diceData) => {
    // merge the original ID with new data
    const updatedDice = {
      ...foundDice,
      ...diceData,
      mainFace: diceData.text1,
    };

    // [!] send update to manager
    await saveDiceObject(updatedDice);
    console.log(`Dice "${diceData.name}" update requested`);

    // close the edit menu immediately
    setActiveSection(null);
    setFoundDice(null);
  };

  // auto-create (batch)
  const handleAutoCreate = async () => {
    const newDiceList = [
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
        id: Date.now() + 4,
        name: "don",
        text1: "d",
        text2: "o",
        text3: "n",
        text4: "d",
        text5: "o",
        text6: "n",
        mainFace: "d",
      },
      {
        id: Date.now() + 5,
        name: "ava",
        text1: "a",
        text2: "v",
        text3: "a",
        text4: "a",
        text5: "v",
        text6: "a",
        mainFace: "a",
      },
      {
        id: Date.now() + 6,
        name: "aiden",
        text1: "a",
        text2: "i",
        text3: "d",
        text4: "e",
        text5: "n",
        text6: "a",
        mainFace: "a",
      },
      {
        id: Date.now() + 7,
        name: "colleen",
        text1: "c",
        text2: "o",
        text3: "l",
        text4: "l",
        text5: "e",
        text6: "e",
        mainFace: "c",
      },
    ];

    // loop through and save each one
    for (const dice of newDiceList) {
      await saveDiceObject(dice);
    }
  };

  // delete all (batch)
  const handleDeleteAll = async () => {
    // loop through and delete each one
    for (const dice of diceArray) {
      await deleteDiceObject(dice.id);
    }
    console.log("all dice deletion requested");
  };

  // menu toggles
  const handleEditButton = () => {
    setManageMode("edit");
    setActiveSection("");
  };
  const handleCreateDice = () => {
    setManageMode("create");
    setActiveSection("create");
  };
  const handleDeleteDice = () => {
    setManageMode("delete");
    setActiveSection("delete");
  };
  const handleClear = () => {
    setManageMode("");
    setActiveSection("");
  };

  return (
    <div className="main-container">
      {/* --- HEADER SECTION --- */}
      <div className="mb-4 text-center">
        <h1 className="font-fancyLetters text-4xl">Manage Your Dice</h1>

        {/* [!] Conditional Greeting */}
        {user ? (
          <h2 className="mt-5 text-2xl">
            Welcome{" "}
            <span className="rounded-lg bg-purple-300 p-1.5">
              {user.username}
            </span>
          </h2>
        ) : (
          <div className="mt-5 flex flex-col items-center justify-center">
            <h1 className="w-fit rounded-lg bg-purple-300 p-2 text-black">
              Guest Mode
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              (Your dice objects will only be saved to this computer in this
              browser)
            </p>
          </div>
        )}
      </div>

      {/* Menu Area */}
      <div className="flex flex-col items-center justify-center gap-2">
        <ManageMenu
          onCreateDice={handleCreateDice}
          onEditDice={handleEditButton}
          onDeleteDice={handleDeleteDice}
          onClear={handleClear}
          autoCreate={handleAutoCreate}
          manageMode={manageMode}
        />
      </div>

      {/* create section */}
      {activeSection === "create" && (
        <DiceCreation onSubmit={handleCreateSubmit} />
      )}

      {/* edit section */}
      {activeSection === "editMenu2" && foundDice && (
        <DiceCreation onSubmit={handleEditSubmit} diceToEdit={foundDice} />
      )}

      {/* delete section */}
      {activeSection === "delete" && (
        <div className="border-main flex flex-col gap-2">
          <Button onClick={handleDeleteAll}>Delete All</Button>
        </div>
      )}

      {/* display grid */}
      <div className="grid-wrapper">
        {loading ? (
          // [!] simple loading state
          <div className="p-10 text-center font-bold text-gray-400">
            Loading your dice...
          </div>
        ) : (
          <div className="dice-grid">
            {displayDiceArray.length > 0 ? (
              displayDiceArray.map((dice) => (
                <DiceDataBlock dice={dice} key={dice.id} />
              ))
            ) : (
              <div className="p-4 text-lg text-gray-500">
                No dice found. Create one!
              </div>
            )}
          </div>
        )}
      </div>

      {/* footer nav */}
      <NavigationMenu
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default ManageDice;
