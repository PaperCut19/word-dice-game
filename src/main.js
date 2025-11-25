import "./style.css";

let frontPageDice = ["W", "O", "R", "D", "S"];
let userText = "";

const frontPageDiceDiv = document.querySelector("#frontPageDice");
const diceTextInput = document.querySelector("#diceTextInput");
const changeDiceSubmit = document.querySelector("#changeDiceSubmit");

diceTextInput.addEventListener("input", (event) => {
  userText = event.target.value;
});
diceTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    updateDice();
  }
});

changeDiceSubmit.addEventListener("click", updateDice);

displayDice();

function displayDice() {
  frontPageDiceDiv.innerHTML = "";

  frontPageDice.forEach((dice) => {
    const diceElement = document.createElement("div");

    diceElement.innerHTML = `
  <div class="group">
          <div
            class="flex h-40 w-40 items-center justify-center rounded-4xl bg-gray-300 duration-400 group-hover:cursor-pointer group-hover:bg-gray-200"
          >
            <h1
              class="text-8xl text-red-500 duration-400 group-hover:text-red-400"
            >
              ${dice}
            </h1>
          </div>
        </div>
  `;

    frontPageDiceDiv.appendChild(diceElement);
  });
}

function updateDice() {
  if (userText) {
    userText = userText.toUpperCase();
    frontPageDice = [...userText];
    displayDice();
  }
}
