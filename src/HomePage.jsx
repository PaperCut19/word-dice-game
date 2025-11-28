import { useState, useEffect } from "react";
import { diceStorage } from "./diceStorage";

function HomePage({ setCurrentPage }) {
    const [diceArray, setDiceArray] = useState([]);
    const [frontPageDice, setFrontPageDice] = useState(['W', 'O', 'R', 'D', 'S']);
    const [inputValue, setInputValue] = useState('');

    // load dice from localStorage when component mounts
    useEffect(() => {
        const loadedDice = diceStorage.getAllDice();
        setDiceArray(loadedDice);
    }, []);

    const handleSubmit = () => {
        if (inputValue) {
            const upperCaseText = inputValue.toUpperCase();
            setFrontPageDice([...upperCaseText]); //split string into array of letters
            setInputValue(''); // clear input after submit
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="main-container">
            {/* front page dice blocks */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {frontPageDice.map((letter, index) => {
                    return (
                    <div key={index} className="group flex flex-col items-center">
                        <div className="dice-box">
                            <h1 className="dice-letter">{letter}</h1>
                         </div>
                    </div>
                    )
                    
                })}                
            </div>

            {/* input */}
            <input type="text" 
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Change 'words' to what?"
            className="text-input w-50 text-center"
            />

            <button className="button-secondary" onClick={handleSubmit}>
                Submit
            </button>

            {/* navigate to manage page */}
            <button 
            className="button-primary"
            onClick={() => setCurrentPage('manage')}
            >
                Manage Your Dice
            </button>
        </div>
    )
}

export default HomePage;