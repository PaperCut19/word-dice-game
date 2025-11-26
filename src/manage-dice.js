import "./style.css";
import { Dice } from "./diceClass";

const dice1 = new Dice(1);
const dice2 = new Dice(2);

const diceArray = [];
diceArray.push(dice1, dice2);

const faceValueButton = document.querySelector("#faceValueButton");
const diceBlockDiv = document.querySelector("#diceBlockDiv");
const menuArea = document.querySelector("#menuArea");
const createBlocksDiv = document.querySelector("#createBlocksDiv");

menuArea.addEventListener("click", (event) => {
  if (event.target.matches("#createDiceButton")) {
    createBlocksDiv.classList.toggle("hidden");
    menu.classList.toggle("hidden");
  }

  if (event.target.matches("#toggleMenuButton")) {
    menu.classList.toggle("hidden");

    if (!createBlocksDiv.classList.contains("hidden")) {
      createBlocksDiv.classList.toggle("hidden");
    }
  }
});

faceValueButton.addEventListener("click", () => {
  dice1.showFaces();
});

diceArray.forEach((dice) => {
  const diceElement = document.createElement("div");

  diceElement.innerHTML = `
  <div class="group flex flex-col items-center">
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
