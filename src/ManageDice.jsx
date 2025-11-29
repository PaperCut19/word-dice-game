import { useState, useEffect, useRef } from "react";
import { diceStorage } from "./diceStorage";
import DiceDataBlock from "./components/DiceDataBlock";
import Button from "./components/Button";
import ManageMenu from "./components/ManageMenu";

function ManageDice({ setCurrentPage }) {
    // State
    const [diceArray, setDiceArray] = useState([]);
    const [activeSection, setActiveSection] = useState(null); // can be: null, 'create', or 'delete'
    const [diceToDelete, setDiceToDelete] = useState('');

    // using ref so we can tell the computer to only upload changes to browser storage after the first render of the local copy, this makes sure that when ManageDice component mounts, an empty array isn't immediately being uploaded to the browser storage
    const isFirstRender = useRef(true);

    // Form inputs
    const [diceName, setDiceName] = useState('');
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [text4, setText4] = useState('');
    const [text5, setText5] = useState('');
    const [text6, setText6] = useState('');

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


    // open create dice section
    const handleCreateDice = () => {
        setActiveSection('create');
    };


    // open delete dice section
    const handleDeleteDice = () => {
        setActiveSection('delete');
    };

    // clear menu handler
    const handleClear = () => {
        setActiveSection(null);
    };


    // submit new dice
    const handleSubmit = () => {
        const newDice = {
            id: Date.now(),
            name: diceName || Date.now().toString(),
            text1,
            text2,
            text3,
            text4,
            text5,
            text6,
            mainFace: text1
        };

        // check for duplicate names
        if (diceArray.some(dice => dice.name === newDice.name)) {
            alert("there's another dice with the same name. use a different name");
            return;
        }

        setDiceArray([...diceArray, newDice]);

        //reset form
        setDiceName('');
        setText1('');
        setText2('');
        setText3('');
        setText4('');
        setText5('');
        setText6('');

        alert(`dice "${newDice.name}" has been created!`);
    };

    // delete all dice - just update React state
    const handleDeleteAll = () => {
        setDiceArray([]);
        alert('All dice got deleted!');
    };

    // delete one dice button event handler
    const handleDeleteOneMenu = () => {
        setActiveSection('deleteOne');
    };


    // delete one dice - just filter React state
    const handleDeleteOne = () => {
        if (!diceToDelete) {
            alert('Please enter a dice name to delete');
            return;
        }

        const diceExists = diceArray.some(dice => dice.name === diceToDelete);
        
        if (!diceExists) {
            alert(`No dice found with name "${diceToDelete}"`);
            return;
        }

        const filteredArray = diceArray.filter(dice => dice.name !== diceToDelete);
        setDiceArray(filteredArray); // useEffect saves automatically
        setDiceToDelete('');
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
                onEditDice={() => alert('edit feature coming soon!')}
                onDeleteDice={handleDeleteDice}
                onClear={handleClear}
            />
        </div>

        {/* create dice section */}
        {activeSection === 'create' && (
        <div className="border-main flex flex-col gap-2 md:flex-row items-center">
            {/* dice preview - NO metadata, just shows the dice you're building */}
            <DiceDataBlock 
                dice={{ name: diceName, text1: text1 }}
            />

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
                onChange={(event) => setText1(event.target.value[0] || '')}
                maxLength={1}
                />
                <label htmlFor="createDiceText2">Side 2</label>
                <input 
                type="text"
                id="createDiceText2"
                className="text-input"
                value={text2}
                onChange={(event) => setText2(event.target.value[0] || '')}
                maxLength={1}
                />
                <label htmlFor="createDiceText3">Side 3</label>
                <input 
                type="text"
                id="createDiceText3"
                className="text-input"
                value={text3}
                onChange={(event) => setText3(event.target.value[0] || '')}
                maxLength={1}
                />
                <label htmlFor="createDiceText4">Side 4</label>
                <input 
                type="text"
                id="createDiceText4"
                className="text-input"
                value={text4}
                onChange={(event) => setText4(event.target.value[0] || '')}
                maxLength={1}
                />
                <label htmlFor="createDiceText5">Side 5</label>
                <input 
                type="text"
                id="createDiceText5"
                className="text-input"
                value={text5}
                onChange={(event) => setText5(event.target.value[0] || '')}
                maxLength={1}
                />
                <label htmlFor="createDiceText6">Side 6</label>
                <input 
                type="text"
                id="createDiceText6"
                className="text-input"
                value={text6}
                onChange={(event) => setText6(event.target.value[0] || '')}
                maxLength={1}
                />

                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
        )}
    
        {/* delete dice section */}
        {activeSection === 'delete' && (
        <div className="border-main flex flex-col gap-2">
            <Button onClick={handleDeleteAll}>Delete All</Button>
            <Button onClick={handleDeleteOneMenu}>Delete One Dice</Button>
        </div>
        )}

        {/* delete one dice section */}
        {activeSection === 'deleteOne' && (
        <div className="border-main flex flex-col gap-2">
            <label htmlFor="diceToDelete">Name of dice to delete</label>
            <input 
                className="text-input" 
                type="text" 
                id="diceToDelete" 
                value={diceToDelete} 
                onChange={(event) => setDiceToDelete(event.target.value)}
            />
            <Button onClick={handleDeleteOne}>Submit</Button>
        </div>
        )}

        {/* display all dice */}
        <div className="flex flex-wrap items-center justify-center gap-3">
            {diceArray.map((dice) => (
                <DiceDataBlock key={dice.id} dice={dice} />
            ))}
        </div>
        
        {/* home button */}
        <Button className="button-primary" onClick={() => setCurrentPage('home')}>Home Page</Button>
    </div>
    )
}

export default ManageDice;