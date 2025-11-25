import "./style.css";

const frontPageDice = ["W", "O", "R", "D", "S"];

const frontPageDiceDiv = document.querySelector("#frontPageDice");

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
