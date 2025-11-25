import "./style.css";
import { Dice } from "./diceLogic";

const dice1 = new Dice(1);
const dice2 = new Dice(2);

const diceArray = [];
diceArray.push(dice1, dice2);

const faceValueButton = document.querySelector("#faceValueButton");
const diceBlockDiv = document.querySelector("#diceBlockDiv");

faceValueButton.addEventListener("click", () => {
  dice1.showFaces();
});

diceArray.forEach((dice) => {
  const diceElement = document.createElement("div");

  diceElement.innerHTML = `
  <div class="group flex flex-col items-center">
      <h1>Dice ID: ${dice.id}</h1>
          <div
            class="flex h-40 w-40 items-center justify-center rounded-4xl bg-gray-300 duration-400 group-hover:cursor-pointer group-hover:bg-gray-200"
          >
            <h1
              class="text-8xl text-red-500 duration-400 group-hover:text-red-400"
            >
              ${dice.mainFace}
            </h1>
          </div>
        </div>
  `;

  diceBlockDiv.appendChild(diceElement);
});
