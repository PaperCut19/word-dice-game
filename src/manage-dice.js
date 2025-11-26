import "./style.css";
import { Dice } from "./diceClass";
import { diceStorage } from "./diceStorage";
import { manageDiceElements } from "./manageDiceElements";

// const dice1 = new Dice(1);
// const dice2 = new Dice(2);

const diceArray = diceStorage.getAllDice();
const {
  diceBlockDiv,
  menuArea,
  createBlocksDiv,
  createDiceTextArea,
  nameOfNewDiceHeader,
  menu,
  deleteDiceArea,
} = manageDiceElements;

// diceArray.push(dice1, dice2);

const inputDice = {
  name: "",
  id: "",
  text1: "",
  text2: "",
  text3: "",
  text4: "",
  text5: "",
  text6: "",
  mainFace: "",
};

// const inputDiceArray = [];

// menu area
menuArea.addEventListener("click", (event) => {
  if (event.target.matches("#createDiceButton")) {
    toggle(menu);
    toggle(createBlocksDiv);
  }

  if (event.target.matches("#toggleMenuButton")) {
    toggle(menu);

    toggleIfOpen(createBlocksDiv);
    toggleIfOpen(deleteDiceArea);
  }

  if (event.target.matches("#deleteDiceButton")) {
    toggle(menu);
    toggle(deleteDiceArea);
  }
});

// create dice text area on input
createDiceTextArea.addEventListener("input", (event) => {
  if (event.target.id.startsWith("createDiceText")) {
    const number = event.target.id.replace("createDiceText", "");

    inputDice[`text${number}`] = event.target.value[0] || "";
  }

  if (event.target.matches("#nameOfNewDiceText")) {
    inputDice.name = event.target.value;
    nameOfNewDiceHeader.textContent = `Name: ${inputDice.name}`;
  }
});

// create dice text area on click
createDiceTextArea.addEventListener("click", (event) => {
  if (event.target.matches("#createDiceSubmit")) {
    inputDice.id = Date.now();

    if (!inputDice.name) {
      inputDice.name = inputDice.id;
    }

    if (!diceArray.some((dice) => dice.name === inputDice.name)) {
      const newDice = {
        ...inputDice,
        mainFace: inputDice.text1,
      };
      diceArray.push(newDice);
      diceStorage.uploadAllDice(diceArray);
      resetInputDice();
      displayDice();
      alert(
        `this dice object has been uploaded to local storage. the name of the dice is "${newDice.name}". This is the object: ${JSON.stringify(newDice)}`,
      );
    } else {
      alert("There's another dice with the same name. Use a different name");
    }
  }
});

// faceValueButton.addEventListener("click", () => {
//   dice1.showFaces();
// });

displayDice();

function displayDice() {
  diceBlockDiv.innerHTML = "";

  diceArray.forEach((dice) => {
    const diceElement = document.createElement("div");

    diceElement.innerHTML = `
  <div class="group flex flex-col items-center">
  <h1>Dice Name: ${dice.name || ""}</h1>
      <h1>Dice ID: ${dice.id}</h1>
          <div
            class="dice-box"
          >
            <h1
              class="dice-letter"
            >
              ${dice.mainFace}
            </h1>
          </div>
        </div>
  `;

    diceBlockDiv.appendChild(diceElement);
  });
}

function resetInputDice() {
  inputDice.name = "";
  inputDice.text1 = "";
  inputDice.text2 = "";
  inputDice.text3 = "";
  inputDice.text4 = "";
  inputDice.text5 = "";
  inputDice.text6 = "";
  inputDice.mainFace = "";

  document
    .querySelectorAll('#createDiceTextArea input[type="text"]')
    .forEach((input) => {
      input.value = "";
    });
  nameOfNewDiceHeader.textContent = "Name:";
}

function toggle(element) {
  element.classList.toggle("hidden");
}

function toggleIfOpen(element) {
  if (!element.classList.contains("hidden")) {
    toggle(element);
  }
}
