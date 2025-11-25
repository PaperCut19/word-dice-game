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
            class="dice-box"
          >
            <h1
              class="dice-letter"
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
