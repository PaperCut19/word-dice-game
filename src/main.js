import "./style.css";
import { Dice } from "./diceLogic";

const dice1 = new Dice(1);
const faceValueButton = document.querySelector("#faceValueButton");

faceValueButton.addEventListener("click", () => {
  dice1.showFaces();
});
