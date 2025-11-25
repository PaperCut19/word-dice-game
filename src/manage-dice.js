import "./style.css";
import { Dice } from "./diceLogic";

const dice1 = new Dice(1);
const dice2 = new Dice(2);

const diceArray = [];
diceArray.push(dice1, dice2);

const faceValueButton = document.querySelector("#faceValueButton");
const diceBlockDiv = document.querySelector("#diceBlockDiv");
const toggleMenuButton = document.querySelector("#toggleMenuButton");
const menu = document.querySelector("#menu");
const createBlocksDiv = document.querySelector("#createBlocksDiv");

toggleMenuButton.addEventListener("click", () => {
  console.log("toggle menu");
  menu.classList.toggle("hidden");

  if (!createBlocksDiv.classList.contains("hidden")) {
    createBlocksDiv.classList.toggle("hidden");
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
