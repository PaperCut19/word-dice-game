import { useState, useEffect } from "react";
import { diceStorage } from "./diceStorage";

function ManageDice({ setCurrentPage }) {
    // State
    const [diceArray, setDiceArray] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [createDiceOpen, setCreateDiceOpen] = useState(false);
    const [deleteDiceOpen, setDeleteDiceOpen] = useState(false);

    // Form inputs
    const [diceName, setDiceName] = useState('');
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [text4, setText4] = useState('');
    const [text5, setText5] = useState('');
    const [text6, setText6] = useState('');

    // load dice from local storage
    useEffect(() => {
        const loadedDice = diceStorage.getAllDice();
        setDiceArray(loadedDice);
    }, []);

    // auto-save to local storage when diceArray changes
    useEffect(() => {
        if (diceArray.length > 0) {
            diceStorage.uploadAllDice(diceArray);
        }
    }, [diceArray])

    // toggle menu
    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
        // close other sections if open
        if (createDiceOpen) setCreateDiceOpen(false);
        if (deleteDiceOpen) setDeleteDiceOpen(false);
    };

    // open create dice section
    const handleCreateDice = () => {
        setMenuOpen(false);
        setCreateDiceOpen(true);
    };

    // open delete dice section
    const handleDeleteDice = () => {
        setMenuOpen(false);
        setDeleteDiceOpen(true);
    }

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

    // delete all dice
    const handleDeleteAll = () => {
        diceStorage.clearAllDice();
        setDiceArray([]);
        alert('all dice got deleted!');
    };

    return (
    <div className="main-container">
        <h1 className="font-fancyLetters text-4xl">Manage Your Dice</h1>

        {/* Menu Area */}
        <div className="flex flex-col items-center justify-center gap-2">
            {/* toggle menu button */}
            <button className="button-secondary" onClick={handleToggleMenu}>
                Toggle Menu
            </button>

            {/* Menu */}
            {menuOpen && (
                <div className="border-main flex flex-col items-center justify-center gap-2">
                    <button className="button-secondary" onClick={handleCreateDice}>
                        Create Dice
                    </button>
                    <button className="button-secondary" onClick={() => alert('edit feature coming soon!')}>
                        Edit Dice
                    </button>
                    <button className="button-secondary" onClick={handleDeleteDice}>
                        Delete Dice
                    </button>
                </div>
            )}
        </div>

        {/* create dice section */}
        {createDiceOpen && (
        <div className="border-main flex flex-col gap-2 md:flex-row">
            {/* dice preview */}
            <div className="flex flex-col items-center justify-center">
                <h1 className="max-w-[100px] wrap-break-word">
                    Name: {diceName || 'N/A'}
                </h1>
                <div className="dice-box">
                    <h1 className="dice-letter">{text1 || ''}</h1>
                </div>
            </div>

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

                <button className="button-secondary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            
        </div>
        )}
    
        {/* delete dice section */}
        {deleteDiceOpen && (
        <div className="border-main">
            <button className="button-secondary" onClick={handleDeleteAll}>
                Delete All
            </button>
        </div>
        )}

        {/* display all dice */}
        <div className="flex flex-wrap items-center justify-center gap-3">
            {diceArray.map((dice) => (  
                <div className="group flex flex-col items-center">
                <h1>Dice Name: {dice.name || ''}</h1>
                <h1>Dice ID: {dice.id || ''}</h1>
                <div className="dice-box">
                    <h1 className="dice-letter">{dice.mainFace}</h1>
                </div>
            </div>
            ))}
        </div>
        
        {/* home button */}
        <button className="button-primary" onClick={() => setCurrentPage('home')}>
            Home Page
        </button>
    </div>
    )
}

export default ManageDice;